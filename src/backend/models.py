from sqlalchemy import (
    Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Table
)
from sqlalchemy.orm import relationship
from .database import Base
import datetime

# Association table for many-to-many Application <-> Tag
application_tag = Table(
    'application_tag', Base.metadata,
    Column('application_id', Integer, ForeignKey('applications.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)


class Application(Base):
    __tablename__ = 'applications'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    url = Column(String, nullable=False)
    is_production = Column(Boolean, default=False)
    tags = relationship(
        'Tag', secondary=application_tag, back_populates='applications'
    )
    health_checks = relationship('HealthCheck', back_populates='application')


class Tag(Base):
    __tablename__ = 'tags'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    applications = relationship(
        'Application', secondary=application_tag, back_populates='tags'
    )


class HealthCheck(Base):
    __tablename__ = 'health_checks'
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey('applications.id'))
    status = Column(String, nullable=False)  # 'up' or 'down'
    response_time = Column(Float)
    checked_at = Column(DateTime, default=datetime.datetime.utcnow)
    application = relationship('Application', back_populates='health_checks') 