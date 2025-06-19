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

3. **Seeding Data:**
   - To seed the database with initial applications and tags, run:
     ```sh
     docker-compose exec backend python seed.py
     ```

## Project Structure
- `src/backend/` - FastAPI backend code
- `Dockerfile` - Backend Docker image
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