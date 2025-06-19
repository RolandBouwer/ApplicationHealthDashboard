from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class TagBase(BaseModel):
    name: str


class TagCreate(TagBase):
    pass


class Tag(TagBase):
    id: int

    class Config:
        orm_mode = True


class HealthCheckBase(BaseModel):
    status: str
    response_time: Optional[float] = None
    checked_at: Optional[datetime] = None


class HealthCheck(HealthCheckBase):
    id: int

    class Config:
        orm_mode = True


class ApplicationBase(BaseModel):
    name: str
    url: str
    is_production: bool = False


class ApplicationCreate(ApplicationBase):
    tags: Optional[List[str]] = []


class Application(ApplicationBase):
    id: int
    tags: List[Tag] = []
    health_checks: List[HealthCheck] = []

    class Config:
        orm_mode = True 