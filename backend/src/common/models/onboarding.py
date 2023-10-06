from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from enum import Enum as ENUM
from app.common.database import Base

class User(Base):

    __tablename__ = 'user'
    __table_args__ = {"extend_existing": True}
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    encrypted_password = Column(String)
    organization = Column(String, nullable=True)
    trial = Column(Boolean)
    trial_start_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP)


class UserOAuth(Base):

    __tablename__ = 'user_oauth'
    __table_args__ = {"extend_existing": True}
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'))
    access_token = Column(String)
    refresh_token = Column(String, nullable=True)
    oauth_provider = Column(String)
    cloud_id = Column(String, nullable=True)
    access_token_expiry = Column(TIMESTAMP, nullable=True)
    project_site = Column(String, nullable=True)
    user = relationship(User, backref=backref("oauth", cascade="all, delete-orphan"))


class UserRepoInfo(Base):

    __tablename__ = 'user_repo_info'
    __table_args__ = {"extend_existing": True}
    
    id = Column(Integer, primary_key=True)
    user_oauth_id = Column(Integer, ForeignKey('user_oauth.id', ondelete='CASCADE'))
    repo_id = Column(String)
    repo_name = Column(String)
    owner_name = Column(String)
    branch = Column(String)
    setup_status = Column(Boolean)
    user_oauth = relationship(UserOAuth, backref=backref("repo_info", cascade="all, delete-orphan"))


class UserProjectInfo(Base):

    __tablename__ = 'user_project_info'
    __table_args__ = {"extend_existing": True}
    
    id = Column(Integer, primary_key=True)
    user_oauth_id = Column(Integer, ForeignKey('user_oauth.id', ondelete='CASCADE'))
    project_id = Column(String)
    project_name = Column(String)
    project_key = Column(String)
    setup_status = Column(Boolean)
    user_oauth = relationship(UserOAuth, backref=backref("project_info", cascade="all, delete-orphan"))


class LinkageStatusEnum(ENUM):
    INITIATED = 'INITIATED'
    FAILED = "FAILED"
    AWAITING_VALIDATION = 'AWAITING_VALIDATION'
    SUPPORTED = 'SUPPORTED'
    UNSUPPORTED = 'UNSUPPORTED'
    COMPLETED = 'COMPLETED'


class UserResourceLinkage(Base):

    __tablename__ = 'user_resource_linkage'
    __table_args__ = {"extend_existing": True}
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'))
    user_repo_info_id = Column(Integer, ForeignKey('user_repo_info.id', ondelete='CASCADE'), nullable=True)
    user_project_info_id = Column(Integer, ForeignKey('user_project_info.id', ondelete='CASCADE'), nullable=True)
    linkage_status = Column(Enum(LinkageStatusEnum))
    reason = Column(String)
    user = relationship(User, backref=backref("resource_linkage", cascade="all, delete-orphan"))
    user_repo_info = relationship(UserRepoInfo)
    user_project_info = relationship(UserProjectInfo)