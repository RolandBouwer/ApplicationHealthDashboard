# Local Postgres with Docker

This guide helps developers run a local PostgreSQL database using Docker for development.

## Prerequisites
- Docker installed

## Start a Postgres container

```
docker run --name local-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=app_health -p 5432:5432 -d postgres:15
```

- This will start a Postgres 15 container with:
  - Username: `postgres`
  - Password: `postgres`
  - Database: `app_health`
  - Port: `5432`

## Stopping and removing the container

```
docker stop local-postgres
# To remove:
docker rm local-postgres
```

## Connecting from your app
- Use `localhost:5432` as the host/port.
- Use the credentials above in your backend `.env` or config.

## Troubleshooting
- If you get a port conflict, stop other Postgres containers or change the `-p` port mapping.
- Data will be lost if you remove the container unless you mount a volume.

## Using a volume for persistence

```
docker run --name local-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=app_health -p 5432:5432 -v pgdata:/var/lib/postgresql/data -d postgres:15
``` 