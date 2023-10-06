SHELL := /bin/bash

DOCKER_COM=docker-compose -f docker-compose.yml
DOCKER_DEV=$(DOCKER_COM) -f docker-compose.dev.yml --env-file .env-dev
DOCKER_STAGE=$(DOCKER_COM) -f docker-compose.staging.yml --env-file .env-stage
DOCKER_PROD=$(DOCKER_COM) -f docker-compose.prod.yml --env-file .env-prod

# Development
dev-build:
	@${DOCKER_DEV} build
dev-up: dev-build
	@${DOCKER_DEV} up -d 
dev-restart:
	@${DOCKER_DEV} restart
dev-down:
	@${DOCKER_DEV} down

# Staging
stage-build:
	@${DOCKER_STAGE} build
stage-up: stage-build
	@${DOCKER_STAGE} up -d 
stage-restart:
	@${DOCKER_STAGE} restart
stage-down:
	@${DOCKER_STAGE} down

# Production
prod-build:
	@${DOCKER_PROD} build
prod-up: prod-build
	@${DOCKER_PROD} up -d
prod-restart:
	@${DOCKER_PROD} restart
prod-down:
	@${DOCKER_PROD} down

# Common
ps:
	@docker ps -a
logs:
	@docker-compose logs -f
clean:
	@docker volume prune --force && docker network prune --force
deep-clean:
	@docker system prune -f -a
