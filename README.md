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
# Create virtual environment (Python 3.12 recommended)
python3.12 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python app/initial_data.py

# Run server
uvicorn app.main:app --reload --port 8000
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
