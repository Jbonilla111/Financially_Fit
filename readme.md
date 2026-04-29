# FinanciallyFit

**Empowering Financial Literacy Through Intuitive Design**

A full-stack web application that helps users build financial literacy through structured courses, interactive calculators, and personalized learning. Built with React, FastAPI, PostgreSQL, and Docker.

**Team:** Jazmin, Angella, Angel, Luke  
**Course:** COMP 4610 – GUI Programming | UMass Lowell | 2026  
**GitHub:** https://github.com/Jbonilla111/Financially_Fit
**Website:** https://financiallyfit.brain-server.com/
**Implementation Plan:** https://docs.google.com/spreadsheets/d/1mh5tO-BduKVvs7HRULEBIlCdurgnX2Flr5-XDfbDsiA/edit?usp=sharing
**Presentation slides:** https://docs.google.com/presentation/d/12tyiL-wMLUmb0a0VogL2ldtajW-Id0O_Gt1TBZxXywc/edit?usp=sharing
---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Context API |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| DevOps | Docker Compose |

---

## Prerequisites

Make sure you have the following installed before running the app:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [Git](https://git-scm.com/)

That's it — no need to install Python, Node.js, or PostgreSQL separately. Docker handles everything.

---

## Setup & Running the App

### Step 1 — Clone the repository

```bash
git clone https://github.com/Jbonilla111/Financially_Fit.git
cd Financially_Fit
```

### Step 2 — Start Docker Desktop

Make sure Docker Desktop is open and running on your machine before continuing.

### Step 3 — Start all services

```bash
docker compose up --build
```

This will start 3 containers:
- **frontend** — React app at `http://localhost:3000`
- **backend** — FastAPI server at `http://localhost:8000`
- **db** — PostgreSQL database at port `5432`


### Step 4 — Import course data (first time only)

Once all containers are running, open a **new terminal window** and run:

```bash
docker compose exec backend python import_data.py
```

You should see output like:
```
INFO: Imported standardized course data from /seed-data/debt_management.json
INFO: Imported standardized course data from /seed-data/emergency_fund.json
INFO: Imported standardized course data from /seed-data/foundations-life-insurance.json
INFO: Imported standardized course data from /seed-data/investment_basics.json
INFO: Imported standardized course data from /seed-data/retirement_planning.json
```

only need to run this once. The data persists in the database after that.

### Step 5 — Open the app

Go to **http://localhost:3000** in your browser.

---

## Using the App

1. **Sign up** for a new account on the signup page
2. **Log in** with your credentials
3. Browse the **Courses** page to explore financial literacy courses
4. Use the **Tools** page to access financial calculators
5. Complete the **Onboarding Quiz** for personalized course recommendations
6. Update your profile and daily learning goal in **Settings**

---

## Stopping the App

```bash
docker compose down
```

To also delete the database data (full reset):

```bash
docker compose down -v
```

---

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


## Project Structure

```
Financially_Fit/
├── frontend/               # React app
│   └── src/
│       ├── pages/          # Login, Signup, Courses, Tools, Settings, etc.
│       ├── components/     # Navbar, ProfileSidebar, QuizModal, etc.
│       ├── context/        # UserContext for global state
│       └── data/           # Course JSON files
├── backend/                # FastAPI app
│   ├── api/
│   │   ├── auth.py         # JWT authentication
│   │   └── routers/        # users, courses, tools, titles
│   ├── database/
│   │   ├── models.py       # SQLAlchemy models
│   │   └── schemas.py      # Pydantic schemas
│   └── import_data.py      # Course data seeding script
├── docker-compose.yml      # Local development setup
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/` | Create new user |
| POST | `/users/login` | Login and get JWT token |
| POST | `/users/logout` | Logout |
| GET | `/users/{id}` | Get user profile |
| PUT | `/users/{id}` | Update user profile |
| GET | `/users/{id}/progress` | Get learning progress |
| POST | `/users/{id}/progress/complete` | Mark lesson complete |
| GET | `/courses/` | Get all courses |
| GET | `/courses/{id}` | Get single course |
| GET | `/titles/{id}` | Get lesson by ID |
| GET | `/titles/{id}/questions/` | Get quiz questions |
| POST | `/tools/loan` | Loan calculator |
| POST | `/tools/investment` | Investment calculator |
| POST | `/tools/savings` | Savings calculator |

Full API docs available at **http://localhost:8000/docs** when the app is running.

---

## Troubleshooting

**Courses page is blank?**
Make sure you ran the import script: `docker compose exec backend python import_data.py`

**Port already in use?**
Stop any other apps using ports 3000, 8000, or 5432, then run `docker compose down` and try again.

**Docker containers not starting?**
Make sure Docker Desktop is open and running, then try `docker compose down` followed by `docker compose up --build`.

**Database connection error?**
The backend needs the database to be fully ready. Wait a few seconds after startup and try refreshing.

---

## Team Contributions

| Member | Role | Contributions |
|---|---|---|
| Jazmin | Frontend Developer | React Router, dark mode, navbar search, calculators, onboarding quiz, Docker integration |
| Angel | Frontend Developer | Courses page UI, course content, CourseLanding, CourseLesson, CoursePlayer |
| Angella | Backend Developer | JWT authentication, password hashing, API integration, data validation, profile update endpoint, course import fix |
| Luke | Backend Developer | FastAPI endpoints, PostgreSQL schema, Docker Compose setup, database models, SQLAlchemy ORM |