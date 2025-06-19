# Docker Usage

## Prerequisites
- Docker
- Docker Compose

## Build and start all services

```
docker-compose up --build
```

This will start:
- PostgreSQL database
- Backend API (FastAPI)

## Stopping services

```
docker-compose down
```

## Notes
- The backend will be available at http://localhost:8000
- The database will be available at localhost:5432
- You can add a frontend service to docker-compose if desired 