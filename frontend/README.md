# AgriGrow / AgriVerse

A smart agriculture platform connecting farmers, buyers, and administrators —
built with React (TanStack Start) on the frontend and Django REST Framework
on the backend.

## Project structure

```
agrigrow-insights-main/   # Frontend (React + TanStack Start + Vite)
backend/                  # Backend (Django REST Framework)
```

## Prerequisites

- Node.js 18+ (npm or bun)
- Python 3.11+
- pip / venv

## Backend setup (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then fill in real values, see below
python manage.py migrate
python manage.py createsuperuser
```

`createsuperuser` doesn't ask for the app's custom `role` field — every new
user defaults to `role="farmer"`. Promote yourself (or anyone) to admin with:

```bash
python manage.py promote_admin <username>
python manage.py runserver
```

The backend runs at `http://localhost:8000` by default.

### Backend environment variables (`backend/.env`)

| Variable | Description |
| --- | --- |
| `DJANGO_SECRET_KEY` | Django's cryptographic secret key. Generate a fresh one — never reuse an old/committed key. |
| `DJANGO_DEBUG` | `True` for local development, `False` in production. |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated list of hostnames the backend is allowed to serve (e.g. `localhost,127.0.0.1` locally, your real domain in production). |
| `DJANGO_CORS_ALLOWED_ORIGINS` | Comma-separated list of frontend origins allowed to call the API. Locally this is `http://localhost:8080` (see note below on the frontend's fixed port). |
| `DATA_GOV_API_KEY` | Your personal API key from [data.gov.in](https://data.gov.in), used by the `fetch_market_prices` management command to pull mandi price data. Get your own free key — do not reuse a key that has ever been shared or committed publicly. |

To generate a secret key locally:

```bash
python -c "import secrets,string; print(''.join(secrets.choice(string.ascii_letters+string.digits+'!@#$%^&*(-_=+)') for _ in range(50)))"
```

**Database:** the project uses SQLite (`db.sqlite3`) by default. This is fine
for local development only — it is not committed to version control (see
`.gitignore`) and should be replaced with a production-grade database
(e.g. PostgreSQL) for any real deployment.

## Frontend setup (React / TanStack Start)

```bash
cd agrigrow-insights-main
npm install        # or: bun install
cp .env.example .env
npm run dev         # or: bun run dev
```

The frontend always runs at `http://localhost:8080` — this project's Vite
config (`@lovable.dev/vite-tanstack-config`) hardcodes port `8080` for the
dev server (`strictPort: true`), overriding Vite's usual default of 5173.
This is why the backend's `DJANGO_CORS_ALLOWED_ORIGINS` defaults to
`http://localhost:8080` — keep them in sync if you ever change the port.

### Frontend environment variables (`agrigrow-insights-main/.env`)

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:8000/api` locally, or `https://api.yourdomain.com/api` in production. |
| `VITE_DATA_GOV_API_KEY` | Your personal API key from [data.gov.in](https://data.gov.in) for live market-price data. Get your own free key — do not reuse a key that has ever been shared or committed publicly. |

## Available scripts (frontend)

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run format` — run Prettier

## Deployment notes

- Never commit `.env` files, `db.sqlite3`, `node_modules/`, or `venv/` — these
  are all covered by `.gitignore`.
- Set `DJANGO_DEBUG=False` and configure real `DJANGO_ALLOWED_HOSTS` /
  `DJANGO_CORS_ALLOWED_ORIGINS` values before deploying the backend.
- Set `VITE_API_URL` to your production backend URL when building the
  frontend for deployment.
