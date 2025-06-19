from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from .database import SessionLocal

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return Response(content="Database is up", status_code=200)
    except Exception:
        return Response(content="Database is down", status_code=503)


@router.get("/health", tags=["Health"])
def health_check_alias(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return Response(content="Database is up", status_code=200)
    except Exception:
        return Response(content="Database is down", status_code=503) 