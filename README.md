
# TimeFlow

A website for tracking your time
    
## Tech Stack

| Area        | Technologies                                |
|-------------|---------------------------------------------|
| Frontend    | Next.js 15, React 19, Vanilla CSS           |
| Backend     | FastAPI (Python 3.11), SQLAlchemy + Alembic |
| Database    | PostgreSQL 16 (prod), SQLite (dev)          |
| Infrastructure | Docker, Docker Compose, nginx            |


## Screenshots
![Card selecter](./frontend/public/images/card-selecter-example-2.png)
![Dashboard](./frontend/public/images/dashboard-example-1.png)


## Quick Start (Local)
### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn src.main:app 
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment
```
1) create and edit .env.prod file
2) get ssl certificate
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email <email> --agree-tos --no-eff-email \
  -d <domain> -d <...>
3) edit nginx/default.conf
4) edit frontend/src/config.js
5) docker compose build
6) docker compose up -d
```