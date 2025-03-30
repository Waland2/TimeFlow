FROM python:3.11-slim

WORKDIR /app

COPY ./requirements.txt /app/
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./src /app/src
COPY ./alembic.ini /app
COPY ./alembic /app/alembic

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--forwarded-allow-ips=*", "--proxy-headers"]
