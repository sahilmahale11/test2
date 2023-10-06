from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from enum import Enum as ENUM
from app.common.models.onboarding import User, UserRepoInfo
from app.common.database import Base

class CodeType(ENUM):

    SCRIPT = 'SCRIPT'
    FUNCTION = 'FUNCTION'
    CLASS = 'CLASS'


class EmbedType(ENUM):

    TITLE = 'TITLE'
    BODY = 'BODY'


class Language(ENUM):

    PYTHON = 'PYTHON'
    CPP = 'CPP'
    JAVA = 'JAVA'


class RepoCodeMetadata(Base):

    __tablename__ = 'repo_code_metadata'
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    user_repo_info_id = Column(Integer, ForeignKey('user_repo_info.id', ondelete='CASCADE'))
    embed_uuid = Column(String)
    name = Column(String)
    branch_name = Column(String)
    code_type = Column(Enum(CodeType))
    language = Column(Enum(Language))
    file_path = Column(String)
    embed_type = Column(Enum(EmbedType))
    url_path = Column(String)
    user_repo_info = relationship(UserRepoInfo, backref=backref("code_metadata", cascade="all, delete-orphan"))

class PRStatus(ENUM):

    OPEN = 'OPEN'
    CLOSE = 'CLOSE'


class PullRequest(Base):

    __tablename__ = 'pull_request'
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'))
    pr_id = Column(String)
    run_id = Column(String)
    uuid = Column(String)
    name = Column(String)
    branch_name = Column(String)
    code_type = Column(Enum(CodeType))
    language = Column(Enum(Language))
    pr_status = Column(Enum(PRStatus))
    file_path = Column(String)
    url_path = Column(String)
    embed_type = Column(Enum(EmbedType))
    score = Column(String)
    user = relationship(User, backref=backref("pull_requests", cascade="all, delete-orphan"))