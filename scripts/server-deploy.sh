#!/bin/sh
set -eu

DEPLOY_PATH="${DEPLOY_PATH:-/opt/auth-basic}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

if [ -z "${DOCKER_IMAGE:-}" ]; then
  echo "DOCKER_IMAGE is required (e.g. youruser/auth-basic:latest)" >&2
  exit 1
fi

if [ -n "${DOCKERHUB_USERNAME:-}" ] && [ -n "${DOCKERHUB_TOKEN:-}" ]; then
  echo "Logging in to Docker Hub..."
  echo "${DOCKERHUB_TOKEN}" | docker login -u "${DOCKERHUB_USERNAME}" --password-stdin
fi

cd "${DEPLOY_PATH}"

echo "Pulling ${DOCKER_IMAGE}..."
export DOCKER_IMAGE
docker compose -f "${COMPOSE_FILE}" pull api

echo "Starting services..."
docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans

echo "Pruning unused images..."
docker image prune -f

echo "Deploy complete."
