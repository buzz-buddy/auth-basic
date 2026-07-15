# nginx-proxy on a VPS

Automatic reverse proxy and Let's Encrypt SSL for Docker containers.

This stack uses two images from Docker Hub:

| Image | Role |
|-------|------|
| [nginxproxy/nginx-proxy](https://hub.docker.com/r/nginxproxy/nginx-proxy) | Listens on ports 80/443, routes traffic to containers by domain |
| [nginxproxy/acme-companion](https://hub.docker.com/r/nginxproxy/acme-companion) | Requests and renews SSL certificates automatically |

It runs **separately** from your application. Your app only needs a few environment variables in its own `docker-compose.prod.yml` and `.env`.

---

## How it works

```
Internet
   │
   ▼
┌──────────────────────────────────────┐
│  VPS                                  │
│  ┌────────────────────────────────┐  │
│  │ nginx-proxy (:80, :443)        │  │
│  │  + acme-companion (SSL renew)  │  │
│  └───────────────┬────────────────┘  │
│                  │ Docker network     │
│                  │ "nginx-proxy"      │
│  ┌───────────────▼────────────────┐  │
│  │ Your app container             │  │
│  │  VIRTUAL_HOST=api.example.com  │  │
│  │  expose: 3000                  │  │
│  └───────────────┬────────────────┘  │
│                  │                    │
│  ┌───────────────▼────────────────┐  │
│  │ Database (127.0.0.1:5432 only) │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

1. nginx-proxy watches the Docker socket for containers with `VIRTUAL_HOST` set.
2. It generates nginx config: `https://api.example.com` → `http://<container>:3000`.
3. acme-companion sees `LETSENCRYPT_HOST` on the same container and obtains a certificate from Let's Encrypt.
4. Certificates renew automatically before they expire.

You do **not** write nginx server blocks by hand for each app. Optional snippets go in `vhost.d/` only when you need custom settings (upload limits, timeouts, etc.).

---

## VPS requirements

- Ubuntu 22.04/24.04, Debian 12, or similar Linux VPS
- A public IPv4 address
- Root or sudo access
- Domain(s) you control (DNS A records pointing to the VPS)
- Ports **80** and **443** open in the cloud firewall and on the server

Recommended: **2 GB RAM** minimum if running nginx-proxy + app + database on one machine.

---

## Step 1 — Install Docker on the VPS

SSH into the server:

```bash
ssh root@your-server-ip
```

Install Docker and the Compose plugin (official convenience script):

```bash
curl -fsSL https://get.docker.com | sh
```

Verify:

```bash
docker --version
docker compose version
```

Optional: allow your deploy user to run Docker without sudo:

```bash
usermod -aG docker $USER
# log out and back in for the group change to apply
```

---

## Step 2 — Open firewall ports

Only **80** and **443** need to be public. App and database ports stay on localhost.

**UFW (Ubuntu):**

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

**Cloud provider:** also allow inbound TCP 80 and 443 in the VPS security group / firewall panel (AWS, DigitalOcean, Hetzner, etc.).

Do **not** expose 3000 (API) or 5432 (Postgres) to the internet.

---

## Step 3 — Configure DNS

Create **A records** pointing to your VPS public IP:

| Host | Type | Value |
|------|------|-------|
| `api.yourdomain.com` | A | `203.0.113.10` |
| `admin.yourdomain.com` | A | `203.0.113.10` |

Wait for DNS to propagate (minutes to a few hours). Let's Encrypt will fail if the domain does not resolve to this server.

Check:

```bash
dig +short api.yourdomain.com
```

---

## Step 4 — Install nginx-proxy

Copy the `nginx-proxy/` folder to the server (or clone the repo). Example path: `/opt/nginx-proxy`.

```bash
mkdir -p /opt/nginx-proxy
cd /opt/nginx-proxy
```

Place these files on the server:

```
/opt/nginx-proxy/
├── docker-compose.yml
└── vhost.d/                  # optional per-domain nginx snippets
    └── api.yourdomain.com    # rename from api.example.com if needed
```

Start the stack:

```bash
cd /opt/nginx-proxy
docker compose up -d
```

Verify containers are running:

```bash
docker compose ps
docker network ls | grep nginx-proxy
```

You should see the `nginx-proxy` Docker network. Application containers join this network to be discovered.

**No `.env` file is required** in this folder. SSL email and domains are configured on each app container (see Step 5).

---

## Step 5 — Connect your application

In your app's production `.env` (e.g. auth-basic), set:

```env
VIRTUAL_HOST=api.yourdomain.com
VIRTUAL_PORT=3000
LETSENCRYPT_HOST=api.yourdomain.com
LETSENCRYPT_EMAIL=admin@yourdomain.com
```

| Variable | Purpose |
|----------|---------|
| `VIRTUAL_HOST` | Domain nginx-proxy routes to this container |
| `VIRTUAL_PORT` | Port the app listens on inside the container (3000 for NestJS) |
| `LETSENCRYPT_HOST` | Domain to issue the SSL certificate for (usually same as `VIRTUAL_HOST`) |
| `LETSENCRYPT_EMAIL` | Let's Encrypt account email (expiry notices) |

Your `docker-compose.prod.yml` should:

1. Join the external `nginx-proxy` network
2. `expose` the app port (for nginx over Docker network)
3. Bind the app to `127.0.0.1` only (optional local access, not public)
4. Pass the four variables above in the `api` service `environment` block

Example (already configured in this repo's `docker-compose.prod.yml`):

```yaml
networks:
  proxy:
    external: true
    name: nginx-proxy

services:
  api:
    networks:
      - default
      - proxy
    expose:
      - "3000"
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      VIRTUAL_HOST: ${VIRTUAL_HOST}
      VIRTUAL_PORT: ${VIRTUAL_PORT:-3000}
      LETSENCRYPT_HOST: ${LETSENCRYPT_HOST}
      LETSENCRYPT_EMAIL: ${LETSENCRYPT_EMAIL}

  db:
    ports:
      - "127.0.0.1:5432:5432"
```

Start the app **after** nginx-proxy is running:

```bash
cd /opt/auth-basic
docker compose -f docker-compose.prod.yml up -d
```

Within 1–2 minutes, visit `https://api.yourdomain.com`. The certificate is created automatically on first request.

---

## Multiple domains and subdomains

You do **not** need a `vhost.d` file for each domain by default.

Each service gets its own `VIRTUAL_HOST`:

```yaml
# API
VIRTUAL_HOST=api.yourdomain.com
LETSENCRYPT_HOST=api.yourdomain.com

# Another container (e.g. admin frontend)
VIRTUAL_HOST=admin.yourdomain.com
LETSENCRYPT_HOST=admin.yourdomain.com
```

Each container must:

- Join the `nginx-proxy` network
- Set `VIRTUAL_HOST`, `LETSENCRYPT_HOST`, and `LETSENCRYPT_EMAIL`
- `expose` its internal port and set `VIRTUAL_PORT` if not 80

nginx-proxy creates a separate virtual host and certificate for each.

---

## Optional: `vhost.d` custom config

Files in `vhost.d/` are **optional**. nginx-proxy includes `vhost.d/<domain>` into that domain's server block.

Use when a specific domain needs extra nginx directives:

| File | When to use |
|------|-------------|
| `vhost.d/api.yourdomain.com` | Larger uploads, longer timeouts, WebSockets |

Example (`vhost.d/api.yourdomain.com`):

```nginx
client_max_body_size 25m;
proxy_read_timeout 60s;
```

After editing `vhost.d/`, reload nginx-proxy:

```bash
docker compose exec nginx-proxy nginx -s reload
# or restart the container:
docker compose restart nginx-proxy
```

If all subdomains share the same needs, add one file per domain that requires those settings. Domains without a file use nginx-proxy defaults.

---

## Startup order on a fresh VPS

```bash
# 1. nginx-proxy (once)
cd /opt/nginx-proxy && docker compose up -d

# 2. application
cd /opt/auth-basic
cp .env.docker.example .env   # edit with real secrets and domains
docker compose -f docker-compose.prod.yml pull api
docker compose -f docker-compose.prod.yml up -d
```

---

## Useful commands

```bash
# nginx-proxy logs
cd /opt/nginx-proxy
docker compose logs -f nginx-proxy
docker compose logs -f acme-companion

# List generated certificates
docker compose exec nginx-proxy ls -la /etc/nginx/certs

# Restart proxy after vhost.d changes
docker compose restart nginx-proxy

# See which containers nginx-proxy knows about
docker ps --format "table {{.Names}}\t{{.Status}}" \
  --filter network=nginx-proxy
```

---

## Troubleshooting

### Certificate not issued

- DNS must point to this server: `dig +short api.yourdomain.com`
- Port 80 must be reachable from the internet (Let's Encrypt HTTP challenge)
- Container must be on the `nginx-proxy` network with `LETSENCRYPT_HOST` set
- Check acme logs: `docker compose logs acme-companion`

### 502 Bad Gateway

- App container is not running: `docker compose ps`
- App not on `nginx-proxy` network
- Wrong `VIRTUAL_PORT` (must match the port inside the container, e.g. 3000)
- App not healthy yet — wait for migrations/startup

### Domain shows nginx default page

- `VIRTUAL_HOST` on the app container does not match the URL you're visiting
- App container was started before nginx-proxy — restart the app container

### Connection refused on port 3000 from outside

Expected. Traffic should go through `https://api.yourdomain.com` (ports 80/443), not directly to 3000.

### Rate limits (Let's Encrypt)

Use staging while testing to avoid production rate limits. On acme-companion, add to `docker-compose.yml`:

```yaml
environment:
  ACME_CA_URI: https://acme-staging-v02.api.letsencrypt.org/directory
```

Remove this line before going live.

---

## Security notes

- Keep Postgres and Redis on `127.0.0.1` — never expose them publicly
- Bind the API to `127.0.0.1:3000` if you only need nginx-facing access plus local debugging
- Keep `LETSENCRYPT_EMAIL` valid — you receive expiry warnings if auto-renew fails
- Update images periodically: `docker compose pull && docker compose up -d`

---

## References

- [nginx-proxy documentation](https://github.com/nginx-proxy/nginx-proxy)
- [acme-companion documentation](https://github.com/nginx-proxy/acme-companion)
- [Let's Encrypt](https://letsencrypt.org/)
