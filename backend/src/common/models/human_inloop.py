from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from enum import Enum as ENUM
from app.common.models.onboarding import User
from app.common.database import Base

class HumanVerification(ENUM):
    PASS = 'PASS'
    FAIL = 'FAIL'


class TopLinkScore(Base):

    __tablename__ = 'top_link_score'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'))
    repo_code_metadata_uuid = Column(String)
    project_requirement_metadata_uuid = Column(String)
    score = Column(String)
    human_verification = Column(Enum(HumanVerification))
    user = relationship(User, backref=backref("top_link_score", cascade="all, delete-orphan"))