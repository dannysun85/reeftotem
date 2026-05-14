# ReefTotem Project

## Project Structure

*   `client/`: Public-facing website (React + Vite).
*   `admin/`: Admin dashboard (React + Vite).
*   `server/`: Backend API (Python FastAPI).
*   `docs/`: Project documentation.

## Getting Started

### 1. Backend (Server)

```bash
cd server
# Create/update the project virtual environment with uv.
# Production and development both use Python 3.12 in server/.venv.
uv sync --frozen --python 3.12

# Optional: activate for interactive commands
source .venv/bin/activate

# Initialize database
uv run python -m app.initial_data

# Run server
uv run uvicorn app.main:app --reload --port 8000
```

Production process managers should call the managed virtualenv directly:

```bash
cd server
uv sync --frozen --python 3.12
.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 2. Frontend (Client)

```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

### 3. Admin Dashboard

```bash
cd admin
npm install
npm run dev
# Runs on http://localhost:5174
```

## API Documentation

Once the server is running, visit `http://localhost:8000/docs` for the interactive API documentation (Swagger UI).
