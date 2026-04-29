# FinanciallyFit

Financial education app with a React frontend and FastAPI backend.

## Current deployment modes

- Local development: JWT mode (`AUTH_MODE=jwt`) with frontend at `http://localhost:3000` and backend at `http://localhost:8000`
- Production target: Authentik forward-auth behind Traefik at `https://financiallyfit.brain-server.com`

## Local development

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Start services:

```bash
docker compose --env-file .env up --build
```

3. Open `http://localhost:3000`.

## Production-oriented compose

The file `docker-compose.prod.yml` is the baseline for your server stack with:

- Traefik labels for `financiallyfit.brain-server.com`
- Authentik middleware applied to both frontend and API routes
- Backend API routing by path prefix on the same hostname
- Internal DB network isolation

Deploy locally on the server with:

```bash
APP_HOSTNAME=financiallyfit.brain-server.com \
POSTGRES_USER=<user> \
POSTGRES_PASSWORD=<password> \
POSTGRES_DB=financiallyfit \
./deploy.sh
```

## Auth behavior implemented

- Added `/users/me` endpoint for authenticated identity bootstrap.
- Added Auth mode switching in backend:
	- `AUTH_MODE=jwt` uses bearer token validation.
	- `AUTH_MODE=authentik` uses trusted Authentik headers from forward auth.
- Added ownership checks for user-scoped endpoints:
	- `/users/{id}` and progress endpoints
	- `/tools/*` and calculation history endpoints

## Remaining infrastructure steps

- Wire production secrets in GitHub Actions for DB and Authentik credentials.
- Import seed course content after first production boot:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec backend python import_data.py
```

## Authentik automation

`setup_auth.py` now provisions and updates the following idempotently:

- Group: `financiallyfit-users`
- Proxy provider: `financiallyfit-proxy`
- Application: `financiallyfit`
- Strict expression policy and policy binding (group membership required)

Environment variables used by `setup_auth.py`:

- `AUTHENTIK_URL`
- `AUTHENTIK_API_TOKEN`
- `APP_NAME` (defaults to `financiallyfit`)
- `APP_HOSTNAME` (defaults to `financiallyfit.brain-server.com`)
- `APP_INTERNAL_HOST` (defaults to `http://financiallyfit-backend:8000`)
- `AUTHENTIK_GROUP_NAME` (defaults to `financiallyfit-users`)
- `AUTHENTIK_POLICY_NAME` (defaults to `financiallyfit-access-policy`)
- `AUTHENTIK_POLICY_EXPRESSION` (optional override)

## Production cutover checklist (brain-server runner)

1. Confirm GitHub repo secrets are set:
	- `AUTHENTIK_URL`
	- `AUTHENTIK_API_TOKEN`
	- `POSTGRES_USER`
	- `POSTGRES_PASSWORD`
	- `POSTGRES_DB`
2. Confirm the self-hosted GitHub runner labels include `self-hosted`, `linux`, `brain-server`.
3. Confirm infrastructure stack is healthy:
	- Traefik running on `web-routing`
	- Authentik outpost/middleware reachable
	- Cloudflare tunnel routes `financiallyfit.brain-server.com` to Traefik
4. Trigger workflow in `.github/workflows/deploy.yml` or push to `main`.
5. Verify Authentik objects were created/updated:
	- Group `financiallyfit-users`
	- App `financiallyfit`
	- Policy `financiallyfit-access-policy` bound to app
6. Validate access control:
	- User in `financiallyfit-users` gets app access
	- Authenticated user outside group gets denied
7. Run post-deploy seed import:
	- `docker compose --env-file .env.prod -f docker-compose.prod.yml exec backend python import_data.py`
8. Smoke test production:
	- `GET /health` returns 200
	- App home loads
	- `/courses/` returns seeded modules
	- Cross-user access to `/users/{other_id}/progress/summary` returns 403
