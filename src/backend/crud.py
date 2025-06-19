from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional
from sqlalchemy.exc import NoResultFound

def get_application(db: Session, app_id: int):
    return db.query(models.Application).filter(models.Application.id == app_id).first()

def get_application_by_name(db: Session, name: str):
    return db.query(models.Application).filter(models.Application.name == name).first()

def get_applications(db: Session, skip: int = 0, limit: int = 100, is_production: Optional[bool] = None):
    query = db.query(models.Application)
    if is_production is not None:
        query = query.filter(models.Application.is_production == is_production)
    return query.offset(skip).limit(limit).all()

def create_application(db: Session, app: schemas.ApplicationCreate):
    db_app = models.Application(
        name=app.name, url=app.url, is_production=app.is_production
    )
    if app.tags:
        tags = db.query(models.Tag).filter(models.Tag.name.in_(app.tags)).all()
        db_app.tags = tags
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

def update_application(db: Session, app_id: int, app: schemas.ApplicationCreate):
    db_app = get_application(db, app_id)
    if not db_app:
        return None
    db_app.name = app.name
    db_app.url = app.url
    db_app.is_production = app.is_production
    if app.tags:
        tags = db.query(models.Tag).filter(models.Tag.name.in_(app.tags)).all()
        db_app.tags = tags
    db.commit()
    db.refresh(db_app)
    return db_app

def delete_application(db: Session, app_id: int):
    db_app = get_application(db, app_id)
    if db_app:
        db.delete(db_app)
        db.commit()
    return db_app

def get_tags(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Tag).offset(skip).limit(limit).all()

def create_tag(db: Session, tag: schemas.TagCreate):
    db_tag = models.Tag(name=tag.name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def get_tag_by_name(db: Session, name: str):
    return db.query(models.Tag).filter(models.Tag.name == name).first()

def add_health_check(db: Session, app_id: int, status: str, response_time: Optional[float]):
    health_check = models.HealthCheck(
        application_id=app_id, status=status, response_time=response_time
    )
    db.add(health_check)
    db.commit()
    db.refresh(health_check)
    return health_check

def get_health_checks(db: Session, app_id: int, limit: int = 20):
    return (
        db.query(models.HealthCheck)
        .filter(models.HealthCheck.application_id == app_id)
        .order_by(models.HealthCheck.checked_at.desc())
        .limit(limit)
        .all()
    )

def delete_tag(db, tag_id):
    tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
    if not tag:
        return None
    db.delete(tag)
    db.commit()
    return tag 