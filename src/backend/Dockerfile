# Dockerfile for Backend API only
FROM python:3.11-slim

WORKDIR /app

COPY ./src/backend /app

RUN pip install --no-cache-dir fastapi uvicorn[standard] sqlalchemy psycopg2-binary apscheduler requests \
    && useradd -m appuser \
    && rm -rf /root/.cache

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 