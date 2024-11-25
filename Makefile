
build-frontend:
	docker build -f docker/Dockerfile.frontend .

build-backend:
	docker build -f docker/Dockerfile.backend .
		
build: build-frontend build-backend
