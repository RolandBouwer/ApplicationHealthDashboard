# Deploying Application Health Dashboard to Azure App Service (Docker Compose)

This guide explains how to deploy the Application Health Dashboard (frontend + backend) to Azure App Service using Docker Compose (multi-container). It covers prerequisites, Azure setup, environment variables, database configuration, and troubleshooting.

---

## Prerequisites
- Azure subscription with permission to create resources
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- GitHub repository with your project code (including `docker-compose.yml` and Dockerfiles)
- Azure Database for PostgreSQL (recommended for production)

---

## 1. Prepare Your Codebase
- Ensure your `docker-compose.yml` is Azure-ready (see project root for example)
- Remove the `db` service from compose (use Azure Database for PostgreSQL)
- Backend and frontend Dockerfiles should be in `src/backend/Dockerfile` and `src/frontend/Dockerfile`
- Add a `.env` file or set environment variables in Azure (see `.env.azure.example`)

---

## 2. Set Up Azure Database for PostgreSQL
1. In the Azure Portal, create an **Azure Database for PostgreSQL Flexible Server**
2. Note the following details:
   - Server name: `your-db-server.postgres.database.azure.com`
   - Database name: `app_health`
   - Username: `youruser@your-db-server`
   - Password: `yourpassword`
3. Configure firewall rules to allow access from Azure App Service
4. Run the schema/init script (`docs/db-init.sql`) to create tables and seed data

---

## 3. Create Azure Web App for Containers (Docker Compose)
1. In the Azure Portal, create a **Web App**
2. Under **Publish**, select **Docker Compose (Preview)**
3. Set the source to your GitHub repo and specify the path to `docker-compose.yml`
4. Choose a suitable App Service Plan (Standard or Premium recommended)
5. Configure **App Settings** (environment variables):
   - `POSTGRES_HOST=your-db-server.postgres.database.azure.com`
   - `POSTGRES_PORT=5432`
   - `POSTGRES_DB=app_health`
   - `POSTGRES_USER=youruser@your-db-server`
   - `POSTGRES_PASSWORD=yourpassword`

---

## 4. Configure Frontend API URL
- By default, the frontend expects the backend at `/api` or a specific URL.
- In production, set the API base URL in your frontend config or as an environment variable (if supported by your build):
  - Example: `REACT_APP_API_URL=https://<your-app-service-name>.azurewebsites.net/api`
- If using a custom domain, update CORS settings in the backend.

---

## 5. Deploy and Verify
- Push your code to GitHub (if not already)
- Azure will build and deploy your containers automatically
- Visit the App Service URL to verify the frontend loads and can communicate with the backend
- Check the Azure Portal for logs if there are issues

---

## 6. Troubleshooting & Tips
- **Database connection errors:**
  - Double-check firewall rules and credentials for Azure Database for PostgreSQL
  - Ensure the backend environment variables are set correctly
- **Frontend cannot reach backend:**
  - Make sure the API URL is correct and CORS is configured
- **Logs:**
  - Use the Azure Portal to view container logs for both frontend and backend
- **Scaling:**
  - Use the App Service scaling options for production workloads
- **SSL/HTTPS:**
  - Azure App Service provides HTTPS by default for your app’s domain
- **Environment Variables:**
  - Use the Azure Portal’s Configuration blade to securely manage secrets and environment variables

---

## 7. Additional Resources
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/en-us/azure/postgresql/)
- [Docker Compose on Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/tutorial-multi-container-app)

---

**For further customization, see the project’s `README.md` and other docs in the `docs/` folder.** 