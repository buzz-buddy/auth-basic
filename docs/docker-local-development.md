# Docker local development

Run the API and PostgreSQL locally with Docker Compose. The API uses Nest hot reload; source on the host is bind-mounted into the container.

## Files involved

These existing project files power the local Docker workflow (this guide only documents them; it does not add new Docker assets):

| File | Role |
| --- | --- |
| [`docker-compose.dev.yml`](../docker-compose.dev.yml) | Defines `db` (Postgres) and `api` services, volumes, ports, and env overrides. |
| [`Dockerfile.dev`](../Dockerfile.dev) | Dev image: Node 22, `npm ci`, `prisma generate`, CMD `npm run start:dev`. |
| [`.env.docker.example`](../.env.docker.example) | Template to copy to `.env` for Compose (Postgres, JWT, bootstrap admin, etc.). |
| [`package.json`](../package.json) | npm scripts: `docker:dev`, `docker:dev:down`, `docker:migrate`, `docker:seed`. |
| [`prisma/`](../prisma/) | Schema, migrations, and seed (`seed.ts`) used by migrate/seed commands in the container. |
| [`prisma.config.ts`](../prisma.config.ts) | Prisma config including the seed command. |

**Not used for local Docker:** `Dockerfile.prod`, `docker-compose.prod.yml`, `scripts/docker-entrypoint.sh` (prod migrate-on-start), and `nginx-proxy/` — those are production / reverse-proxy only.

## Prerequisites

- Docker Desktop (or Docker Engine + Compose v2)
- A `.env` file in the project root (see below)

You do **not** need Node or Postgres installed on the host for the Docker workflow.

## Quick start

```bash
# 1. Env for Compose
cp .env.docker.example .env

# 2. Start Postgres + API (builds the image on first run)
npm run docker:dev

# 3. Apply migrations (separate terminal, with stack running or not)
npm run docker:migrate

# 4. Seed persona schema + optional bootstrap admin
npm run docker:seed
```

Equivalent Compose commands:

```bash
docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.dev.yml run --rm api npx prisma migrate deploy
docker compose -f docker-compose.dev.yml run --rm api npm run prisma:seed
```

| URL | What |
| --- | --- |
| http://localhost:3000 | API |
| http://localhost:3000/api/docs | Swagger UI |
| localhost:5432 | Postgres (from host tools) |

Stop the stack:

```bash
npm run docker:dev:down
# or
docker compose -f docker-compose.dev.yml down
```

Data in the Postgres volume is kept. To wipe the DB volume as well:

```bash
docker compose -f docker-compose.dev.yml down -v
```

## How it works

`docker-compose.dev.yml` starts two services:

| Service | Role |
| --- | --- |
| `db` | Postgres 16. Healthy before the API starts. Port mapped from `POSTGRES_PORT` (default `5432`). |
| `api` | Nest in watch mode (`npm run start:dev`). Built from `Dockerfile.dev`. |

**Bind mount:** the project root is mounted at `/app`, so edits on the host reload the app.

**`node_modules` volume:** `api_node_modules` shadows the host `node_modules` so Linux deps from the image are used (important on Windows/macOS).

**Database URL:** Compose sets `DATABASE_URL` to the `db` hostname (`…@db:5432/…`), overriding whatever host URL is in `.env`. From inside containers, always use that host — not `localhost`.

**Env loading:** optional `.env` via `env_file`. Required app secrets (JWT, AWS, Google, bootstrap admin, etc.) come from that file. Compose only hard-overrides `DATABASE_URL` and sets `NODE_ENV=development`.

## Environment setup

1. Copy the Docker example:

   ```bash
   cp .env.docker.example .env
   ```

2. Edit `.env` for local values. At minimum for a happy path:

   - `JWT_ACCESS_SECRET`
   - `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` (if you want a seed admin)
   - AWS / Google vars if you exercise those features

3. Defaults for Postgres (used by Compose if unset):

   | Variable | Default |
   | --- | --- |
   | `POSTGRES_USER` | `postgres` |
   | `POSTGRES_PASSWORD` | `postgres` |
   | `POSTGRES_DB` | `auth_basic` |
   | `POSTGRES_PORT` | `5432` |
   | `PORT` | `3000` |

Do not commit `.env`. Examples stay in `.env.docker.example` / `.env.example`.

## Migrations

Migrations live under `prisma/migrations/`. The API image does **not** run migrations on start; apply them explicitly.

### Apply (deploy existing migrations)

Preferred for shared/local Docker DB after pulling new migration files:

```bash
npm run docker:migrate
```

This runs `prisma migrate deploy` in a one-off `api` container against the Compose `db` service.

### Create a new migration (schema change)

1. Edit `prisma/schema.prisma` (and keep the stack up so the DB is reachable).
2. Create and apply a migration inside the API container:

   ```bash
   docker compose -f docker-compose.dev.yml exec api npx prisma migrate dev --name your_migration_name
   ```

   Use `run --rm` instead of `exec` if the API container is not running — but the `db` service should still be up.

3. Commit the new files under `prisma/migrations/`.

`migrate deploy` only applies already-committed migrations; `migrate dev` creates the migration from schema diffs and applies it (interactive / local use).

### Regenerate Prisma client

Usually already done in the image build. After schema changes, regenerate if needed:

```bash
docker compose -f docker-compose.dev.yml exec api npx prisma generate
```

Because of the anonymous `node_modules` volume, generation inside the container is the reliable path for Docker.

## Seed

```bash
npm run docker:seed
```

Runs `prisma db seed` → `prisma/seed.ts`. That script:

1. Upserts the persona schema seed data.
2. Optionally creates a bootstrap **ADMIN** user when `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` are set in `.env`.
   - Skips create if that admin already exists.
   - Errors if the email exists as a non-admin role.

Seed is idempotent for persona data and for an existing admin. Re-run safely after reset or when adding persona seed updates.

Order on a fresh DB:

1. Start stack  
2. `npm run docker:migrate`  
3. `npm run docker:seed`

## Useful commands

```bash
# Rebuild and start in foreground (logs in terminal)
npm run docker:dev

# Detached
docker compose -f docker-compose.dev.yml up --build -d

# API logs
docker compose -f docker-compose.dev.yml logs -f api

# Shell in API container
docker compose -f docker-compose.dev.yml exec api sh

# Prisma Studio (opens UI; port may need publishing if used often)
docker compose -f docker-compose.dev.yml exec api npx prisma studio

# Restart API only
docker compose -f docker-compose.dev.yml restart api
```

## Connecting to Postgres from the host

With Compose up, connect with any client:

```text
Host:     localhost
Port:     5432          # or POSTGRES_PORT from .env
User:     postgres      # or POSTGRES_USER
Password: postgres      # or POSTGRES_PASSWORD
Database: auth_basic    # or POSTGRES_DB
```

Example URL for host tools (not for containers):

```text
postgresql://postgres:postgres@localhost:5432/auth_basic?schema=public
```

## Troubleshooting

| Issue | What to try |
| --- | --- |
| Port already in use | Change `PORT` or `POSTGRES_PORT` in `.env`, or stop the other process. |
| Migrations fail / can’t reach DB | Ensure `db` is healthy: `docker compose -f docker-compose.dev.yml ps`. Wait for healthcheck, then re-run migrate. |
| Schema changes not reflected | Rebuild once (`--build`), then `prisma generate` in the container; confirm migrate ran. |
| Stale / broken `node_modules` in container | `docker compose -f docker-compose.dev.yml down` then remove the `api_node_modules` volume and `up --build` again. |
| Seed skipped admin | Set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` in `.env`, recreate/restart so env is picked up, seed again. |

This guide covers **local Docker development only**. Production Compose, Hub images, and nginx-proxy are out of scope here.
