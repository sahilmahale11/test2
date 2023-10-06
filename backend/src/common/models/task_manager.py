from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from enum import Enum as ENUM
from app.common.models.onboarding import User
from app.common.database import Base


class TaskStatus(str, ENUM):
    INPROGRESS = 'INPROGRESS'
    SUCCESS = 'SUCCESS'
    FAILED = 'FAILED'


class TaskManager(Base):

    __tablename__ = 'task_manager'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'))
    task_id = Column(String)
    task_name = Column(String)
    task_status = Column(Enum(TaskStatus))
    created_at = Column(String)
    updated_at = Column(String)
    user = relationship(User, backref=backref("tasks", cascade="all, delete-orphan"))