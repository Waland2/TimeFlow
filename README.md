
# TimeFlow

A website for tracking your time


## Installation
```bash
1) git clone https://github.com/Waland2/TimeFlow.git
2) edit .env files
3) pick .env file in docker-compose.yml
4) edit nginx/default.conf
5) docker compose build
6) docker compose up -d
```
    
## Tech Stack

| Area        | Technologies                                |
|-------------|---------------------------------------------|
| Frontend    | Next.js 15, React 19, Vanilla CSS           |
| Backend     | FastAPI (Python 3.11), SQLAlchemy + Alembic |
| Database    | PostgreSQL 16 (prod), SQLite (dev)          |
| Infrastructure | Docker, Docker Compose, nginx            |


## Screenshots
![Card selcter](./frontend/public/images/card-selecter-example-1.png)
![Dashboard](./frontend/public/images/dashboard-example-1.png)