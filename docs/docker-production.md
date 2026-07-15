# Docker production

Run Postgres and the API on a server by **pulling pre-built images** from Docker Hub. The server does not build the app; CI builds and pushes. HTTPS is handled by a separate **nginx-proxy** stack.

For local Compose with hot reload, see [docker-local-development.md](./docker-local-development.md). For proxy/SSL setup details, see [nginx-proxy/README.md](../nginx-proxy/README.md).

## Files involved

| File | Role |
| --- | --- |
| [`docker-compose.prod.yml`](../docker-compose.prod.yml) | `db`, `api` (Hub image), optional `seed` profile; joins external `nginx-proxy` network. |
| [`Dockerfile.prod`](../Dockerfile.prod) | Multi-stage build: `production` (API) and `seed` (one-off lean seed image). |
| [`tsconfig.seed.json`](../tsconfig.seed.json) | Compiles `prisma/**/*.ts` to `dist-seed/` via `npm run build:seed` — required by the Dockerfile seed stage so prod runs `node dist-seed/seed.js` (no `ts-node`). |
| [`scripts/docker-entrypoint.sh`](../scripts/docker-entrypoint.sh) | On API start, if `RUN_MIGRATIONS=true`, runs `prisma migrate deploy` then starts the app. |
| [`scripts/server-deploy.sh`](../scripts/server-deploy.sh) | Server-side pull + `up -d` (optional helper; CI deploy SSH not wired yet). |
| [`.env.docker.example`](../.env.docker.example) | Template for production `.env` (`DOCKER_IMAGE`, proxy vars, secrets). |
| [`.github/workflows/docker-hub.yml`](../.github/workflows/docker-hub.yml) | Tests on PR/push; on push to `main`/`master`, builds and pushes API + seed images. |
| [`package.json`](../package.json) | Scripts: `docker:prod`, `docker:prod:down`, `docker:prod:pull`, `docker:prod:seed`, `docker:prod:seed:pull`. |
| [`nginx-proxy/`](../nginx-proxy/) | Separate Compose stack: reverse proxy + Let's Encrypt (run once on the VPS). |

**Not used in production:** `docker-compose.dev.yml`, `Dockerfile.dev` (local hot reload only).

## How it works

```
Internet → nginx-proxy (:80/:443 + SSL)
              ↓  Docker network "nginx-proxy"
           api container (:3000, VIRTUAL_HOST=…)
              ↓
           db (Postgres, bound to 127.0.0.1:5432 only)
```

1. **CI** builds `Dockerfile.prod` targets `production` and `seed`, pushes to Docker Hub.
2. **Server** has `.env` with `DOCKER_IMAGE`, secrets, and nginx-proxy env vars.
3. **Compose** pulls the API image, starts Postgres, then API.
4. **Entrypoint** runs `prisma migrate deploy` (`RUN_MIGRATIONS=true`), then `node dist/main.js`.
5. **nginx-proxy** routes `https://VIRTUAL_HOST` to the API and renews certificates via `LETSENCRYPT_*`.

The API image is lean compiled Nest (`dist/`). There is no bind mount of source. Seed uses a separate image (`dist-seed`) so production VMs do not need `ts-node`.

## Prerequisites (server)

- Docker Engine + Compose v2
- External Docker network `nginx-proxy` from the [nginx-proxy stack](../nginx-proxy/README.md) already running
- DNS A record for the API host pointing at the VPS
- Ports **80** and **443** public; do **not** expose API/Postgres to the internet (Compose binds them to `127.0.0.1`)

## Environment setup

```bash
cp .env.docker.example .env
```

Edit `.env` with real production values. Compose **requires** (fails fast if missing):

| Variable | Purpose |
| --- | --- |
| `DOCKER_IMAGE` | API image, e.g. `youruser/auth-basic:latest` |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` | Postgres credentials |
| `VIRTUAL_HOST` | Public hostname for nginx-proxy |
| `LETSENCRYPT_HOST` | Hostname for the TLS certificate (usually same as `VIRTUAL_HOST`) |
| `LETSENCRYPT_EMAIL` | Contact email for Let's Encrypt |

Also set application secrets in the same `.env` (loaded with `required: true`):

- `JWT_ACCESS_SECRET`, CORS / cookie / app URLs
- AWS SES/S3 as needed
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` if using Google sign-in
- `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` for seed
- `DOCKER_SEED_IMAGE` when pulling the Hub seed image (e.g. `youruser/auth-basic:seed`)

`DATABASE_URL` defaults to `postgresql://…@db:5432/…` using the Compose Postgres service. Prefer keeping that host as `db` inside containers.

Use strong passwords and unique JWT secrets. Do not commit `.env`.

## Quick start (server)

Assume nginx-proxy is already up and the app repo (or at least Compose + `.env`) lives on the server (e.g. `/opt/auth-basic`):

```bash
cd /opt/auth-basic
cp .env.docker.example .env   # first time only; edit secrets and DOCKER_IMAGE

docker compose -f docker-compose.prod.yml pull api
docker compose -f docker-compose.prod.yml up -d

# Optional: seed persona schema + bootstrap admin (one-off)
docker compose -f docker-compose.prod.yml pull seed   # if using Hub seed image
docker compose -f docker-compose.prod.yml --profile seed run --rm seed
```

npm equivalents from a machine with the repo:

```bash
npm run docker:prod:pull
npm run docker:prod
npm run docker:prod:seed:pull   # pull Hub seed image and run
# or build seed locally then run:
npm run docker:prod:seed
```

Stop:

```bash
npm run docker:prod:down
# or
docker compose -f docker-compose.prod.yml down
```

Postgres data lives in the `pgdata` volume. `down -v` deletes it — use with care.

## Migrations

Production **auto-migrates on API container start**:

1. Compose sets `RUN_MIGRATIONS=true` on `api`.
2. [`scripts/docker-entrypoint.sh`](../scripts/docker-entrypoint.sh) runs `npx prisma migrate deploy`.
3. Then it `exec`s `node dist/main.js`.

You do **not** run `docker:migrate` on production (that script targets the **dev** Compose file). New migrations ship inside the image (`prisma/migrations` is copied into the image); after CI pushes a new image, pull + restart and migrate deploy runs automatically.

| Stage | Command |
| --- | --- |
| Start / redeploy | Handled by entrypoint |
| Manual (rare) | `docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy` |

Create migration files in **development** (`prisma migrate dev`), commit them, then ship via a new image. Do not run interactive `migrate dev` against production.

## Seed

Seed is **not** part of normal API start. It is a one-off container on the `seed` Compose profile.

| Approach | Command |
| --- | --- |
| Pull Hub seed image and run | `npm run docker:prod:seed:pull` or compose `pull seed` + `--profile seed run --rm seed` |
| Build seed image on this machine and run | `npm run docker:prod:seed` |

Set `DOCKER_SEED_IMAGE` (Hub) or rely on the local tag `auth-basic-seed:local` from the build script.

The seed container:

1. Runs compiled `node dist-seed/seed.js`
2. Seeds persona schema data
3. Creates bootstrap admin when `BOOTSTRAP_ADMIN_*` are set (same rules as local)

Container exits when finished (`restart: "no"`). Safe to re-run for idempotent persona upsert / existing admin skip.

## Images and CI

Workflow: [`.github/workflows/docker-hub.yml`](../.github/workflows/docker-hub.yml)

| Event | Behavior |
| --- | --- |
| PR / push to `main` or `master` | Unit tests |
| Push to `main` / `master` | Build & push API (`production` target) and seed (`seed` target) |

Required GitHub secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`.

API tags (via docker/metadata): `latest` on default branch, git SHA, branch name. Seed tag: `{username}/auth-basic:seed`.

Set server `.env`:

```bash
DOCKER_IMAGE=youruser/auth-basic:latest   # or a SHA tag for pin
DOCKER_SEED_IMAGE=youruser/auth-basic:seed
```

Redeploy after a new push:

```bash
# optional helper
DOCKER_IMAGE=youruser/auth-basic:latest ./scripts/server-deploy.sh

# or manually
docker compose -f docker-compose.prod.yml pull api
docker compose -f docker-compose.prod.yml up -d
```

## Services and networking

| Service | Image | Notes |
| --- | --- | --- |
| `db` | `postgres:16-alpine` | `127.0.0.1:5432` only; named volume `pgdata` |
| `api` | `$DOCKER_IMAGE` | `pull_policy: always`; on `default` + `proxy` networks; expose 3000; localhost-mapped host port |
| `seed` | `$DOCKER_SEED_IMAGE` | Profile `seed`; not started by `up` unless profile enabled |

External network:

```yaml
networks:
  proxy:
    external: true
    name: nginx-proxy
```

Create/start that network via the nginx-proxy Compose file before `up` for this stack.

## Useful commands

```bash
# Status / logs
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f db

# Shell in API
docker compose -f docker-compose.prod.yml exec api sh

# Health (inside container or via localhost)
curl -sS http://127.0.0.1:3000/health

# Restart API after env change
docker compose -f docker-compose.prod.yml up -d api
```

## Troubleshooting

| Issue | What to try |
| --- | --- |
| Compose errors on missing vars | Ensure `.env` has `DOCKER_IMAGE`, Postgres creds, and all three Let's Encrypt / `VIRTUAL_HOST` vars. |
| `network nginx-proxy declared as external but could not be found` | Start nginx-proxy stack first so the network exists. |
| No HTTPS / cert | Check DNS, ports 80/443, and nginx-proxy logs; see [nginx-proxy troubleshooting](../nginx-proxy/README.md). |
| Migrations fail at start | Check API logs for Prisma errors; confirm `db` is healthy and `DATABASE_URL` uses host `db`. |
| Old code still running | Confirm `DOCKER_IMAGE` tag, `pull_policy: always` / explicit `pull`, then `up -d`. |
| Seed OOM / missing on prod | Use the Hub/local **seed** image (`docker:prod:seed*`), not `ts-node` inside the API container. |

This guide covers **production Docker** (images, Compose, migrate-on-start, seed profile, CI, deploy). Local hot-reload Compose is documented separately.
