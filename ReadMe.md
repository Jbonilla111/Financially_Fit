# FinanciallyFit

FinanciallyFit is a comprehensive financial education application designed to help users learn about personal finance, track their progress, and use financial tools. The project consists of a React frontend and a FastAPI backend, backed by a PostgreSQL database.

## Overall Project Architecture

- Frontend: React application providing an interactive user interface for courses, quizzes, and financial tools.
- Backend: FastAPI application serving RESTful APIs for user management, course content, and progress tracking.
- Database: PostgreSQL database for storing user data, course progress, and application state.
- Authentication: Uses built-in JWT-based authentication by default for both local and production environments, making it easy to deploy as a standalone demo.

## Build Process

The project uses Docker and Docker Compose to manage the build and execution environments, ensuring consistency across development and production.

### Local Development

For local development, the project uses `docker-compose.yml` which mounts your local directories into the containers, allowing for hot-reloading as you make code changes.

1. Environment Setup:
   Copy the example environment file and adjust values if necessary:
```bash
   cp .env.example .env
```

2. Build and Run:
   Start the services using Docker Compose:
```bash
   docker compose --env-file .env up --build
```

3. Access the Application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

### Dockerfiles

- `backend/Dockerfile`: Installs Python dependencies from `requirements.txt` and runs the FastAPI application using Uvicorn.
- `frontend/Dockerfile`: Uses a multi-stage build. The development stage runs the React development server, while the `prod` target builds the static assets and serves them using Nginx.

## Deployment Process

The production deployment is designed to run behind a Traefik reverse proxy and uses `docker-compose.prod.yml` along with a deployment script.

### Production Architecture

- Traefik Integration: Services are exposed via Traefik labels, routing traffic based on hostnames and path prefixes.
- Network Isolation: The database is kept secure on an internal Docker network (`financiallyfit-internal`), inaccessible from the outside.
- Healthchecks: Both frontend and backend containers include healthchecks to ensure reliable service availability.

### Deployment Steps

1. Environment Variables:
   The deployment script requires certain environment variables to be set. You can provide them inline or export them beforehand:
   - `APP_HOSTNAME`: The domain name for the application (e.g., `financiallyfit.brain-server.com`)
   - `POSTGRES_USER`: Database username
   - `POSTGRES_PASSWORD`: Database password (must be changed from default)
   - `POSTGRES_DB`: Database name

2. Run the Deployment Script:
   Execute the `deploy.sh` script to build and deploy the production stack:
   ```bash
   APP_HOSTNAME=financiallyfit.brain-server.com \
   POSTGRES_USER=<user> \
   POSTGRES_PASSWORD=<password> \
   POSTGRES_DB=financiallyfit \
   ./deploy.sh
   ```

   The script performs the following actions:
   - Validates required environment variables.
   - Generates a secure `JWT_SECRET_KEY` if one doesn't exist.
   - Creates a `.env.prod` file with the necessary configuration.
   - Runs `docker compose -f docker-compose.prod.yml up -d --build`.
   - Waits for the backend to become healthy and runs the data seeding script (`import_data.py`) to populate initial course content.

