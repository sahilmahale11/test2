# generated by datamodel-codegen:
#   filename:  onboarding.yaml
#   timestamp: 2023-09-15T09:55:39+00:00

from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field, constr


class SignUpRequest(BaseModel):
    first_name: constr(min_length=1) = Field(..., description='First Name')
    last_name: constr(min_length=1) = Field(..., description='Last Name')
    email: EmailStr = Field(..., description='Email')
    password: constr(min_length=1) = Field(..., description='Password')
    organization: Optional[str] = Field(None, description='Organization')


class SignInRequest(BaseModel):
    email: EmailStr = Field(..., description='email of the user')
    password: constr(min_length=1) = Field(..., description='password')


class UserDataResponse(BaseModel):
    first_name: Optional[str] = Field(None, description='First Name')
    last_name: Optional[str] = Field(None, description='Last Name')
    organization: Optional[str] = Field(None, description='Organization')
    github_authorized: Optional[bool] = Field(False, description='GitHub Authorized')
    jira_authorized: Optional[bool] = Field(False, description='Jira Authorized')


class ResponseMessage(BaseModel):
    message: Optional[str] = Field(None, description='ResponseMessage')


class GitHubRepository(BaseModel):
    repo_id: Optional[str] = Field(
        None, description='ID of the repository from GitHub.'
    )
    owner_name: Optional[str] = Field(None, description='Owner name of the repository.')
    repo_name: Optional[str] = Field(None, description='Name of the repository.')


class JiraProject(BaseModel):
    project_id: Optional[str] = Field(None, description='ID of the Jira project.')
    project_name: Optional[str] = Field(None, description='Name of the Jira project.')
    project_key: Optional[str] = Field(None, description='Key of the Jira project.')


class GitHubBranchResponse(BaseModel):
    owner_name: Optional[str] = Field(None, description='Owner name of the repository.')
    repo_name: Optional[str] = Field(None, description='Name of the repository.')
    branches: Optional[List[str]] = None


class SelectGitHubRepositoryRequest(BaseModel):
    repo_id: constr(min_length=1) = Field(
        ..., description='Id of the Github Repository'
    )
    owner_name: constr(min_length=1) = Field(
        ..., description='Owner name of the GitHub repository.'
    )
    repo_name: constr(min_length=1) = Field(
        ..., description='Name of the GitHub repository.'
    )
    branch_name: constr(min_length=1) = Field(..., description='Name of the branch.')


class SelectGithubRepositoryResponse(BaseModel):
    github_authorized: Optional[bool] = Field(False, description='GitHub Authorized')
    message: Optional[str] = Field(None, description='ResponseMessage')


class SelectJiraProjectRequest(BaseModel):
    project_id: constr(min_length=1) = Field(
        ..., description='The projectID of the JIRA project'
    )
    project_name: constr(min_length=1) = Field(
        ..., description='Name of the Jira project.'
    )
    project_key: constr(min_length=1) = Field(
        ..., description='Key of the Jira project.'
    )


class SelectJiraProjectResponse(BaseModel):
    jira_authorized: Optional[bool] = Field(False, description='Jira Authorized')
    message: Optional[str] = Field(None, description='ResponseMessage')


class UserRepoDetails(BaseModel):
    user_repo_info_id: Optional[str] = Field(
        None, description='The ID of the user repository.'
    )
    repo_id: Optional[str] = Field(None, description='The github ID of the repository.')
    owner_name: Optional[str] = Field(None, description='The owner of the repository.')
    repo_name: Optional[str] = Field(None, description='The name of the repository.')


class UserProjectDetails(BaseModel):
    user_project_info_id: Optional[str] = Field(
        None, description='The ID of the user project.'
    )
    project_id: Optional[str] = Field(None, description='The jira ID of the project.')
    project_name: Optional[str] = Field(None, description='The name of the project.')
    project_key: Optional[str] = Field(
        None, description='The key associated with the project.'
    )


class UserConnectionResponse(BaseModel):
    github_authorized: Optional[bool] = Field(False, description='GitHub Authorized')
    repo_details: Optional[UserRepoDetails] = None
    jira_authorized: Optional[bool] = Field(False, description='Jira Authorized')
    project_details: Optional[UserProjectDetails] = None


class GitHubRepoStatus(BaseModel):
    user_repo_info_id: Optional[str] = Field(
        None,
        description='The user_repo_info_id of a GitHub repository saved in database.',
    )
    status: Optional[str] = Field(None, description='status of the repo')


class JiraProjectStatus(BaseModel):
    user_project_info_id: Optional[str] = Field(
        None,
        description='The user_project_info_id of a JIRA project saved in database.',
    )
    status: Optional[str] = Field(None, description='status of the project')


class LinkageStatusRequest(BaseModel):
    user_repo_info_id: Optional[str] = Field(
        None,
        description='The user_repo_info_id of a GitHub repository saved in database.',
    )
    user_project_info_id: Optional[str] = Field(
        None,
        description='The user_project_info_id of a JIRA project saved in database.',
    )
    linkage_status: Optional[str] = Field(
        None, description='linkage status of the repo and project'
    )


class LinkageStatus(Enum):
    NOT_STARTED = 'NOT_STARTED'
    INITIATED = 'INITIATED'
    AWAITING_VALIDATION = 'AWAITING_VALIDATION'
    FAILED = 'FAILED'
    UNSUPPORTED = 'UNSUPPORTED'
    SUPPORTED = 'SUPPORTED'
    COMPLETE = 'COMPLETE'


class TokenResponse(BaseModel):
    token: Optional[str] = Field(None, description='JWT Token')
    token_type: Optional[str] = Field(None, description='Token Type')
    jira_authorized: Optional[bool] = Field(False, description='Jira Authorized')
    github_authorized: Optional[bool] = Field(False, description='GitHub Authorized')
    linkage_status: Optional[LinkageStatus] = None
