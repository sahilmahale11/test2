from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.common.auth import Hash, JWTBearer, check_jira_token_validity
from app.common.api_logging import logger
from app.common.database import get_db
from app.common import constant
from app import schema, messages
from app.api.api_v1.endpoints import utils

router = APIRouter()

@router.post("/sign_in", response_model=schema.TokenResponse, status_code=status.HTTP_200_OK)
def sign_in(request: schema.SignInRequest, db: Session = Depends(get_db)):

    """Authenticate a user and generate an access token."""

    logger.info(f"Received sign in request: {request.email}")
    user_data = utils.get_user_details(db,request)
    if not user_data:
        logger.error(f"Error: User with email {request.email} not found")
        raise HTTPException(
            status_code=401,
            detail=messages.USER_NOT_REGISTERED
        )
        
    elif not Hash.verify(user_data.encrypted_password, request.password):
        logger.error("Error: Password veification failed")
        raise HTTPException(
            status_code=401,
            detail=messages.INCORRECT_PASSWORD
        )
    else:
        user_dict = {
        "id": user_data.id,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "email": user_data.email,
        "organization": user_data.organization
    }
        github_authorized = utils.check_github_auth(db, user_data.id)
        jira_authorized = utils.check_jira_auth(db, user_data.id)
        linkage_status = utils.get_linkage_status(db, user_data.id)
        jwt_token = utils.create_token(user_dict)
        token_obj = utils.create_token_object(jwt_token, github_authorized, jira_authorized, linkage_status)
        logger.info("Customer sign in successful. Sending jwt token")
        return token_obj


@router.post("/sign_up", response_model=schema.TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(request: schema.SignUpRequest, db: Session = Depends(get_db)):
   
    """Register a new user and generate an access token."""

    user_data = utils.get_user_details(db,request)
    if user_data:
        raise HTTPException(
            status_code=409,
            detail=messages.USER_ALREADY_REGISTERED
        )

    if not utils.is_valid_password(request.password):
        raise HTTPException(
            status_code=400,
            detail=messages.PASSWORD_VALIDATION_ERROR
        )

    request.password = Hash.encode_password(request.password)
    new_user = utils.save_user_details(db, request)
    new_user_dict = {
        "id": new_user.id,
        "first_name": new_user.first_name,
        "last_name": new_user.last_name,
        "email": new_user.email,
        "organization": new_user.organization
    }
    jwt_token = utils.create_token(new_user_dict)
    token_obj = utils.create_token_object(jwt_token)
    logger.info("Customer sign up successful. Sending jwt token")
    return token_obj


@router.get("/github/oauth_callback", response_model=schema.ResponseMessage, status_code=status.HTTP_200_OK)
def github_oauth_callback(access_code: str, jwt_payload=Depends(JWTBearer()), db: Session = Depends(get_db)):

    """Login using GITHUB and save user's OAuth Tokens in DB"""

    user_id = jwt_payload.get("id")
    access_token = utils.get_github_oauth_tokens(access_code)
    if access_token:
        logger.info("Successfully received access token")
        db_response = utils.save_token_in_db(db, user_id, access_token, "GITHUB", constant.GITHUB_ACCESS_TOKEN_EXPIRE_HOURS)
        if db_response:
            logger.info("Successfully saved OAuth information in DB")
            return schema.ResponseMessage(message="Github account successfully linked")

    raise HTTPException(
    status_code=400,
    detail=messages.GITHUB_LINKING_FAILED)


@router.get("/jira/oauth_callback", response_model=schema.ResponseMessage, status_code=status.HTTP_200_OK)
def jira_oauth_callback(access_code: str, jwt_payload=Depends(JWTBearer()), db: Session = Depends(get_db)):

    """Login using JIRA and save user's OAuth Tokens in DB"""

    user_id = jwt_payload.get("id")
    access_token, refresh_token, cloud_id, project_site = utils.get_jira_oauth_tokens(access_code)
    if access_token and refresh_token and cloud_id and project_site:
        logger.info("Successfully received access token, refresh token, cloud id and project site")
        db_response = utils.save_token_in_db(db, user_id, access_token, "JIRA", constant.JIRA_ACCESS_TOKEN_EXPIRE_HOURS, refresh_token, cloud_id, project_site)
        if db_response:
            logger.info("Successfully saved OAuth information in DB")
            return schema.ResponseMessage(message="JIRA account successfully linked")

    raise HTTPException(
    status_code=400,
    detail=messages.JIRA_LINKING_FAILED)


@router.get("/github/repositories", response_model=List[schema.GitHubRepository], status_code=status.HTTP_200_OK)
def list_github_repositories(jwt_payload=Depends(JWTBearer()), db: Session = Depends(get_db)):
    
    """Retrieve a list of GitHub repositories of a user"""

    user_id = jwt_payload.get("id")
    user_oauth_db_obj = utils.get_user_oauth_details_from_db(db, user_id, "GITHUB")
    if user_oauth_db_obj:
        logger.info("Successfully received oauth_details from db")
        user_oauth_db_obj = utils.check_github_token_validity(db, user_oauth_db_obj)
        github_repo_list = utils.get_github_repositories(user_oauth_db_obj.access_token)
        if github_repo_list:
            logger.info("Successfully received List of Github Repositories")
            return github_repo_list

    raise HTTPException(
    status_code=400,
    detail=messages.LIST_REPOSITORIES_ERROR)


@router.get("/jira/projects", response_model=List[schema.JiraProject], status_code=status.HTTP_200_OK)
def list_jira_projects(jwt_payload=Depends(JWTBearer()), db: Session = Depends(get_db)):
    
    """Retrieve a list of Jira projects of a user"""

    user_id = jwt_payload.get("id")
    user_oauth_db_obj = utils.get_user_oauth_details_from_db(db, user_id, "JIRA")
    if user_oauth_db_obj:
        logger.info("Successfully received oauth_details from db")
        user_oauth_db_obj = check_jira_token_validity(db, user_oauth_db_obj)
        if user_oauth_db_obj:
            jira_project_list = utils.get_jira_projects(user_oauth_db_obj.access_token, user_oauth_db_obj.cloud_id)
            if jira_project_list:
                logger.info("Successfully received List of JIRA projects")
                return jira_project_list

    raise HTTPException(
    status_code=400,
    detail=messages.LIST_PROJECTS_ERROR)


@router.get("/github/{owner_name}/{repo_name}/branches", response_model=schema.GitHubBranchResponse, status_code=status.HTTP_200_OK)
def list_github_branches(owner_name: str, repo_name: str, jwt_payload=Depends(JWTBearer()), db: Session = Depends(get_db)):
 
    """Retrieve a list of branches for a specific GitHub repository."""

    user_id = jwt_payload.get("id")
    user_oauth_db_obj = utils.get_user_oauth_details_from_db(db, user_id, "GITHUB")
    if user_oauth_db_obj:
        logger.info("Successfully received oauth_details from db")
        user_oauth_db_obj = utils.check_github_token_validity(db, user_oauth_db_obj)
        github_branch_list = utils.get_github_branches(owner_name, repo_name, user_oauth_db_obj.access_token)
        if github_branch_list:
            logger.info("Successfully received list of branches for the Github Repository")
            return github_branch_list
        
    raise HTTPException(
    status_code=400,
    detail=messages.LIST_GITHUB_BRANCHES_ERROR)


@router.post("/github/repository", response_model=schema.SelectGithubRepositoryResponse, status_code=status.HTTP_200_OK)
def save_github_repository(request: schema.SelectGitHubRepositoryRequest, jwt_payload=Depends(JWTBearer()), db: Session = Depends(get_db)):

    """Save the details of github repository selected by the user."""

    user_id = jwt_payload.get("id")
    user_oauth_db_obj = utils.get_user_oauth_details_from_db(db, user_id, "GITHUB")
    if user_oauth_db_obj:
        logger.info("Successfully received oauth details from db")
        db_response = utils.save_repo_details_in_db(db, request, user_oauth_db_obj.id)
        if db_response:
                logger.info("Successfully saved Github repository information in DB")
                return schema.SelectGithubRepositoryResponse(github_authorized = True, message="Github repository information saved successfully")
    
    raise HTTPException(
    status_code=400,
    detail=messages.GITHUB_REPO_SAVE_ERROR)


@router.post("/jira/project", response_model=schema.SelectJiraProjectResponse, status_code=status.HTTP_200_OK)
def save_jira_project(request: schema.SelectJiraProjectRequest, jwt_payload=Depends(JWTBearer()), db: Session = Depends(get_db)):
    
    """Save the details of Jira project selected by the user."""

    user_id = jwt_payload.get("id")
    user_oauth_db_obj = utils.get_user_oauth_details_from_db(db, user_id, "JIRA")
    if user_oauth_db_obj:
        logger.info("Successfully received oauth details from db")
        db_response = utils.save_project_details_in_db(db, request, user_oauth_db_obj.id)
        if db_response:
            logger.info("Successfully saved JIRA Project information in DB")
            return schema.SelectJiraProjectResponse(jira_authorized = True, message="JIRA Project information saved successfully")
        
    raise HTTPException(
    status_code=400,
    detail=messages.JIRA_PROJECT_SAVE_ERROR)


@router.get("/user/connections", response_model=schema.UserConnectionResponse, status_code=status.HTTP_200_OK)
def get_user_connections(jwt_payload=Depends(JWTBearer()), db: Session = Depends(get_db)):
    
    """Retrieve the connections detail of a user"""

    user_id = jwt_payload.get("id")
    user_connection_info = utils.fetch_user_connection_detail(db, user_id)
    if user_connection_info:
        return user_connection_info

    raise HTTPException(
    status_code=400,
    detail=messages.USER_CONNECTIONS_ERROR)

@router.get("/user/data", response_model=schema.UserDataResponse, status_code=status.HTTP_200_OK)
def get_user_data(jwt_payload=Depends(JWTBearer()), db: Session = Depends(get_db)):
    
    """Retrieve the user details for profile"""

    user_data = utils.fetch_user_data(db, jwt_payload)
    if user_data:
        return user_data

    raise HTTPException(
    status_code=400,
    detail=messages.USER_DATA_ERROR)