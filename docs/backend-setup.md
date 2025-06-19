# Backend Setup (FastAPI)

## Prerequisites
- Docker & Docker Compose

## Running the Backend

1. **Build and start services:**
   ```sh
   docker-compose up --build
   ```
   This will start both the PostgreSQL database and the FastAPI backend.

2. **API Documentation:**
   - Visit [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive OpenAPI docs.

3. **Database Schema & Seed:**
   - To create the database schema and add initial data, use the provided SQL script:
     ```sh
     # If using docker-compose
     cat docs/db-init.sql | docker-compose exec -T db psql -U postgres -d app_health
     # Or with psql locally
     psql -U postgres -d app_health -f docs/db-init.sql
     ```
   - This will create tables and add AWS/Azure tags and example applications.

4. **Seeding Data (Python alternative):**
   - You can also use the legacy Python script:
     ```sh
     docker-compose exec backend python seed.py
     ```

## Project Structure
- `src/backend/` - FastAPI backend code
- `src/backend/Dockerfile` - Backend Docker image
- `src/frontend/Dockerfile` - Frontend Docker image
- `docker-compose.yml` - Multi-service orchestration
- `docs/` - Documentation

## API Overview
- **Applications:** CRUD, health checks, tags
- **Tags:** CRUD
- **Health Checks:** List, trend, response times
- **Health Endpoint:** The root endpoint `/` checks if the database is up. Returns 200 if DB is up, 503 if not.

## Notes
- The backend will automatically create the target database if it does not exist.
- For local development, run the backend as a module from the `src` directory:
  ```sh
  uvicorn backend.main:app --reload
  ```

See `/docs` endpoint for full OpenAPI schema. 