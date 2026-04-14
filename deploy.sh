#!/usr/bin/env bash

set -euo pipefail

APP_HOSTNAME="${APP_HOSTNAME:-financiallyfit.brain-server.com}"
POSTGRES_USER="${POSTGRES_USER:-financiallyfit}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-change-me}"
POSTGRES_DB="${POSTGRES_DB:-financiallyfit}"
JWT_SECRET_KEY="${JWT_SECRET_KEY:-}"

if [[ -z "${APP_HOSTNAME}" ]]; then
	echo "APP_HOSTNAME must not be empty"
	exit 1
fi

if [[ -z "${POSTGRES_USER}" || -z "${POSTGRES_PASSWORD}" || -z "${POSTGRES_DB}" ]]; then
	echo "POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB must not be empty"
	exit 1
fi

if [[ "${POSTGRES_PASSWORD}" == "change-me" ]]; then
	echo "POSTGRES_PASSWORD is using the insecure default value. Set a strong password before deploying."
	exit 1
fi

if [[ -z "${JWT_SECRET_KEY}" && -f .env.prod ]]; then
	existing_secret="$(grep -E '^JWT_SECRET_KEY=' .env.prod | head -n1 | cut -d= -f2-)"
	if [[ -n "${existing_secret}" ]]; then
		JWT_SECRET_KEY="${existing_secret}"
	fi
fi

if [[ -z "${JWT_SECRET_KEY}" ]]; then
	JWT_SECRET_KEY="$(od -An -N 32 -tx1 /dev/urandom | tr -d ' \n')"
	echo "Generated a JWT secret for this deployment. Set JWT_SECRET_KEY in CI secrets to keep it stable across deploys."
fi

cat > .env.prod <<EOF
APP_HOSTNAME=${APP_HOSTNAME}
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=${POSTGRES_DB}
JWT_SECRET_KEY=${JWT_SECRET_KEY}
EOF

chmod 600 .env.prod

echo "Using APP_HOSTNAME=${APP_HOSTNAME}"

docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build

echo "Deployment finished for https://${APP_HOSTNAME}"
