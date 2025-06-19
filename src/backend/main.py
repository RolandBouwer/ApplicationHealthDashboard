from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud, database
from typing import List, Optional
from .health import router as health_router
from .health_worker import start_scheduler


models.Base.metadata.create_all(bind=database.engine)


app = FastAPI(title="Application Health Dashboard API")

app.include_router(health_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

start_scheduler()


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Application Endpoints
@app.get("/applications/", response_model=List[schemas.Application])
def list_applications(
    skip: int = 0,
    limit: int = 100,
    is_production: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    return crud.get_applications(
        db, skip=skip, limit=limit, is_production=is_production
    )


@app.post(
    "/applications/", response_model=schemas.Application, status_code=status.HTTP_201_CREATED
)
def create_application(app: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    db_app = crud.get_application_by_name(db, name=app.name)
    if db_app:
        raise HTTPException(status_code=400, detail="Application already registered")
    return crud.create_application(db, app)


@app.get("/applications/{app_id}", response_model=schemas.Application)
def get_application(app_id: int, db: Session = Depends(get_db)):
    db_app = crud.get_application(db, app_id)
    if db_app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_app


@app.put("/applications/{app_id}", response_model=schemas.Application)
def update_application(app_id: int, app: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    db_app = crud.update_application(db, app_id, app)
    if db_app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_app


@app.delete("/applications/{app_id}", response_model=schemas.Application)
def delete_application(app_id: int, db: Session = Depends(get_db)):
    db_app = crud.delete_application(db, app_id)
    if db_app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_app


# Tag Endpoints
@app.get("/tags/", response_model=List[schemas.Tag])
def list_tags(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tags(db, skip=skip, limit=limit)


@app.post(
    "/tags/", response_model=schemas.Tag, status_code=status.HTTP_201_CREATED
)
def create_tag(tag: schemas.TagCreate, db: Session = Depends(get_db)):
    db_tag = crud.get_tag_by_name(db, name=tag.name)
    if db_tag:
        raise HTTPException(status_code=400, detail="Tag already exists")
    return crud.create_tag(db, tag)


@app.delete("/tags/{tag_id}", response_model=schemas.Tag)
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    db_tag = crud.delete_tag(db, tag_id)
    if db_tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    return db_tag


# Health Check Endpoints
@app.get("/applications/{app_id}/health_checks/", response_model=List[schemas.HealthCheck])
def get_health_checks(app_id: int, limit: int = 20, db: Session = Depends(get_db)):
    return crud.get_health_checks(db, app_id, limit=limit)