from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from enum import Enum as ENUM
from app.common.models.onboarding import UserProjectInfo
from app.common.database import Base


class IssueType(ENUM):
    EPIC = 'EPIC'
    STORY = 'STORY'
    TASK = 'TASK'
    BUG = 'BUG'


class EmbedType(ENUM):

    TITLE = 'TITLE'
    BODY = 'BODY'


class ProjectRequirementMetadata(Base):

    __tablename__ = 'project_requirement_metadata'
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    user_project_info_id = Column(Integer, ForeignKey('user_project_info.id', ondelete='CASCADE'))
    embed_uuid = Column(String)
    task_id = Column(String)
    parent_id = Column(String)
    issue_type = Column(Enum(IssueType))
    embed_type = Column(Enum(EmbedType))
    url_path = Column(String)
    user_project_info = relationship(UserProjectInfo,  backref=backref("requirement_metadata", cascade="all, delete-orphan"))
