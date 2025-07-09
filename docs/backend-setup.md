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

# Organizational Environment Setup (VPNs, Proxies, SSL)

When deploying or running the backend in a corporate environment (e.g., behind a VPN, proxy, or with strict SSL requirements), follow these guidelines to ensure robust operation:

## 1. Exception Handling
- All network and database operations are wrapped in try/except blocks to catch connection, timeout, and SSL errors.
- Errors are logged with sufficient detail for debugging, but sensitive information is not exposed in API responses.
- If you encounter unclear errors, check backend logs for more details.

## 2. Proxy and VPN Compatibility
- **Outbound Requests:**
  - The backend respects standard proxy environment variables:
    - `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`
  - Set these in your environment or `.env` file as needed:
    ```env
    HTTP_PROXY=http://proxy.company.com:8080
    HTTPS_PROXY=http://proxy.company.com:8080
    NO_PROXY=localhost,127.0.0.1,.company.com
    ```
- **Inbound Requests:**
  - If running behind a reverse proxy (e.g., Nginx), ensure headers like `X-Forwarded-For` are handled correctly. See FastAPI's `TrustedHostMiddleware` for more info.

## 3. SSL Error Handling
- **Database Connections:**
  - If your database requires SSL, configure the connection string accordingly.
  - You can control SSL verification via the `.env` file:
    ```env
    DB_SSLMODE=disable  # or 'require', 'verify-full', etc.
    ```
  - If your organization uses a custom CA, set the `PGSSLROOTCERT` environment variable to the CA bundle path.
- **External APIs:**
  - For outbound HTTPS requests, you can set a custom CA bundle:
    ```env
    REQUESTS_CA_BUNDLE=/path/to/ca-bundle.crt
    ```
  - To disable SSL verification (not recommended for production):
    ```env
    REQUESTS_VERIFY_SSL=false
    ```

## 4. Troubleshooting
- **Address Resolution Errors:**
  - Ensure DNS settings are correct and that the backend host can resolve required addresses.
  - If using a VPN, check split-tunneling and DNS leak settings.
- **SSL Errors:**
  - Verify that the correct CA certificates are available and referenced in your environment.
  - If you see certificate verification errors, try setting `DB_SSLMODE=disable` or updating your CA bundle.
- **Proxy Issues:**
  - Confirm that proxy environment variables are set and exported in the shell or Docker container.
  - Check with your IT team for the correct proxy configuration.

## 5. Example `.env` for Corporate Environments
```env
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_SSLMODE=disable  # or 'require', 'verify-full', etc.
HTTP_PROXY=http://proxy.company.com:8080
HTTPS_PROXY=http://proxy.company.com:8080
NO_PROXY=localhost,127.0.0.1,.company.com
REQUESTS_CA_BUNDLE=/path/to/ca-bundle.crt
REQUESTS_VERIFY_SSL=true
```

## 6. Additional Notes
- Always consult your organization's IT/security team for the correct proxy and SSL settings.
- For persistent issues, provide backend logs to your IT or development team for further analysis. 