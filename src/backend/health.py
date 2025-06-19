from fastapi import APIRouter, Depends, Response
from sqlalchemy import text
from sqlalchemy.orm import Session
from .database import SessionLocal

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return Response(content="Database is up", status_code=200)
    except Exception as e:
        print(f"Health check DB error: {e}")  # For debugging
        return Response(content="Database is down", status_code=503)