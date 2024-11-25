MAKEFLAGS += --always-make
.SILENT: # don't output commands being executed
SHELL := /bin/bash
.ONESHELL:

export docker_registry ?= ghcr.io/joshzcold
export DOCKER_BUILDKIT=1

build-frontend:
	set -x
	docker build -t ${docker_registry}/famf-web .

build-backend:
	set -x
	cd backend
	docker build -t ${docker_registry}/famf-server .
		
build: build-frontend build-backend

dev:
	docker compose -f ./docker/docker-compose-dev.yaml up --build 
