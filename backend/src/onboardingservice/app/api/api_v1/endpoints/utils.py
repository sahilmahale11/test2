from fastapi import HTTPException
from typing import List
import jwt
from datetime import datetime, timedelta
import requests
import re
from app import schema, messages
from app.crud import crud_user, crud_user_oauth, crud_user_repo_info, crud_user_project_info, crud_user_resource_linkage
from app.common import constant
from app.common.api_logging import logger

JWT_SECRET_KEY = constant.JWT_SECRET_KEY
API_ALGORITHM = constant.API_ALGORITHM
API_ACCESS_TOKEN_EXPIRE_MINUTES = constant.API_ACCESS_TOKEN_EXPIRE_MINUTES

# Github Keys
GITHUB_CLIENT_ID = constant.GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET = constant.GITHUB_CLIENT_SECRET
GITHUB_REDIRECT_URI = constant.GITHUB_REDIRECT_URI

# Jira Keys
JIRA_CLIENT_ID = constant.JIRA_CLIENT_ID
JIRA_CLIENT_SECRET = constant.JIRA_CLIENT_SECRET
JIRA_REDIRECT_URI = constant.JIRA_REDIRECT_URI


def is_valid_password(password):
    # code for checking if password has 8 characters, 1 uppercase, 1 lower case and a special character
    reg = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$"
    match = re.search(reg, password)
    return match


def create_token(user_data):
    """
    This function takes user_data as an argument and creates a JWT token using it
    and returns the generated JWT token
    """
    access_token_expires = timedelta(minutes=API_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(payload=user_data, expires_delta=access_token_expires)
    return access_token


def create_access_token(*, payload: dict, expires_delta: timedelta = None):
    """
    This function creates jwt token for the given payload
    """
    to_encode = payload.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=API_ALGORITHM)
    return encoded_jwt


def create_token_object(user_jwt_token, github_authorized = False, jira_authorized = False, linkage_status = schema.LinkageStatus.NOT_STARTED.value):
    """
    This function takes JWT token as an argument and returns a token object
    """
    token_obj = schema.TokenResponse()
    token_obj.token = user_jwt_token
    token_obj.token_type = "Bearer"
    token_obj.github_authorized = bool(github_authorized)
    token_obj.jira_authorized = bool(jira_authorized)
    token_obj.linkage_status = linkage_status
    return token_obj


def get_user_details(db, user_data):
    """
    This function takes user data and fetches the data from username
    """
    user = crud_user.get_user_by_email(db, user_data.email)
    return user


def save_user_details(db, user_details):
    """
    This function will take the user details while signing up and save them in database
    """
    user = crud_user.create_user(db, user_details)
    return user


def get_github_oauth_tokens(access_code):
    token_url = constant.GITHUB_ACCESS_TOKEN_URL
    payload = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": access_code,
        # "redirect_uri": GITHUB_REDIRECT_URI
    }
    headers = {
        "Accept": "application/json"
    }
    response = requests.post(token_url, data=payload, headers=headers)
    if response.status_code == 200:
        access_token = response.json().get("access_token")
        return access_token
    else:
        logger.error(f"Error: Failed to get access token from Github with status Code: {response.status_code} and message: {response.text}")
        return None


def save_token_in_db(db, user_id, access_token, oauth_provider, expire_hours, refresh_token = None, cloud_id = None, project_site = None):
    """
    This function will take the user oauth details and save them in database
    """
    if oauth_provider == "GITHUB":
        user_oauth_db_obj = crud_user_oauth.get_user_by_id_and_provider(db, user_id, oauth_provider)
        if user_oauth_db_obj:
            user_oauth_dict = {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "access_token_expiry": datetime.utcnow() + timedelta(hours=expire_hours)
            }
            user_oauth = crud_user_oauth.update_access_token(db, user_oauth_db_obj, user_oauth_dict)
            return user_oauth

    if oauth_provider == "JIRA":
        jira_authorized = check_jira_auth(db, user_id)
        user_oauth_db_obj = crud_user_oauth.get_user_by_id_and_cloud_id(db, user_id, cloud_id)
        if jira_authorized and user_oauth_db_obj:
            raise HTTPException(
            status_code=409,
            detail=messages.JIRA_SITE_ALREADY_REGISTERED
        )

        if user_oauth_db_obj:
            user_oauth_dict = {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "access_token_expiry": datetime.utcnow() + timedelta(hours=expire_hours)
            }
            user_oauth = crud_user_oauth.update_access_token(db, user_oauth_db_obj, user_oauth_dict)
            return user_oauth

    
    user_oauth_dict = {
        "user_id": user_id,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "oauth_provider": oauth_provider,
        "cloud_id": cloud_id,
        "access_token_expiry": datetime.utcnow() + timedelta(hours=expire_hours),
        "project_site": project_site
    }
    user_oauth = crud_user_oauth.create_user_oauth(db, user_oauth_dict)
    if user_oauth:
        return user_oauth
    else:
        logger.error(f"Failed to save token for the user with user_id: {user_id} and oauth_provider: {oauth_provider}")
        return None     


def get_jira_oauth_tokens(access_code):
    token_url = constant.JIRA_ACCESS_TOKEN_URL
    data = {
    "grant_type": "authorization_code",
    "client_id": JIRA_CLIENT_ID,
    "client_secret": JIRA_CLIENT_SECRET,
    "code": access_code,
    "redirect_uri": JIRA_REDIRECT_URI
}

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(token_url, json=data, headers=headers)

    if response.status_code == 200:
        access_token = response.json().get("access_token")
        refresh_token = response.json().get("refresh_token")
        cloud_id, project_site = get_jira_site_details(access_token)
        return access_token, refresh_token, cloud_id, project_site
    else:
        logger.error(f"Error: Failed to get tokens from JIRA with status Code: {response.status_code} and message: {response.text}")
        return None, None, None, None


def get_jira_site_details(access_token):

    url = constant.JIRA_CLOUD_ID_URL
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        cloud_id = response.json()[0].get("id")
        project_site = response.json()[0].get("url")
        return cloud_id, project_site
    else:
        logger.error(f"Failed to fetch the cloud id from JIRA with status Code: {response.status_code} and message: {response.text}")
        return None


def get_user_oauth_details_from_db(db, user_id, oauth_provider):
    """
    This function takes user id with oauth_provider and fetches user_oauth object from db
    """
    user_oauth_db_obj = crud_user_oauth.get_user_by_id_and_provider(db, user_id, oauth_provider)
    if user_oauth_db_obj:
        return user_oauth_db_obj
    else:
        logger.error(f"Failed to get user_oauth object for the user with user_id: {user_id} and oauth_provider: {oauth_provider}")
        return None


def check_github_token_validity(db, user_oauth_db_obj):

    if datetime.utcnow() > user_oauth_db_obj.access_token_expiry:
         raise HTTPException(
            status_code=400,
            detail="Please authenticate again"
        )
    return user_oauth_db_obj
       

def get_github_repositories(access_token):
    url = constant.GITHUB_BASE_USER_URL+"repos"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {access_token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    user_repo_list = []
    page = 1
    while True:
        params = {
            "page": page,
            "per_page": 100
        }
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            repo_list = response.json()
            if not repo_list:
                break
            for repo in repo_list:
                user_repo_list.append(
                    schema.GitHubRepository(
                        repo_id = str(repo.get("id")),
                        owner_name = repo.get("owner").get("login"),
                        repo_name = repo.get("name")))
            page += 1
        else:
            logger.error(f"Error: Failed to get repositories from GitHub. Status Code: {response.status_code}, Message: {response.text}")
            return None
    return user_repo_list


def get_jira_projects(access_token, cloud_id):
    api_base_url = f"https://api.atlassian.com/ex/jira/{cloud_id}"
    project_url = f"https://api.atlassian.com/ex/jira/{cloud_id}/rest/api/3/project"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }
    response = requests.get(project_url, headers=headers)
    if response.status_code == 200:
        project_list = response.json()
        user_project_list = []
        for project in project_list:
            user_project_list.append(
                schema.JiraProject(
                project_id = str(project.get("id")),
                project_name = project.get("name"),
                project_key = project.get("key"))
            )
        return user_project_list
    else:
        logger.error(f"Error: Failed to get projects from Jira with status Code: {response.status_code} and message: {response.text}")
        return None


def get_github_branches(owner_name, repo_name, access_token):
    url = constant.GITHUB_BASE_REPO_URL + f"{owner_name}/{repo_name}/branches"
    headers = {
        'Authorization': f'token {access_token}',
        'Accept': 'application/vnd.github+json'
    }
    branch_list = []
    page = 1

    while True:
        params = {'page': page}
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            branches = response.json()
            if not branches:
                break
            branch_list.extend([branch.get("name") for branch in branches])
            page += 1
        else:
            logger.error(f"Failed to retrieve branches. Status code: {response.status_code} and message: {response.text}")
            return None

    return schema.GitHubBranchResponse(
        owner_name=owner_name,
        repo_name=repo_name,
        branches=branch_list
    )

def save_repo_details_in_db(db, repo_data, user_oauth_id):
    """
    This function will take the user repo details and save them in database
    """
    user_repo = crud_user_repo_info.create_user_repo(db, repo_data, user_oauth_id)
    if user_repo:
        return user_repo
    else:
        logger.error(f"Failed to save repo_data for the user with oauth_id: {user_oauth_id} and oauth_provider: {oauth_provider}")
        return None


def save_project_details_in_db(db, project_data, user_oauth_id):
    """
    This function will take the user project details and save them in database
    """
    user_project = crud_user_project_info.create_user_project(db, project_data, user_oauth_id)
    if user_project:
        return user_project
    else:
        logger.error(f"Failed to save project_data for the user with oauth_id: {user_oauth_id} and oauth_provider: JIRA")
        return None


def check_github_auth(db, user_id):
    user_repo_db_obj = crud_user_repo_info.get_user_by_id(db, user_id)
    if user_repo_db_obj:
        return user_repo_db_obj
    return False


def check_jira_auth(db, user_id):
    user_project_db_obj = crud_user_project_info.get_user_by_id(db, user_id)
    if user_project_db_obj:
        return user_project_db_obj
    return False


def get_linkage_status(db, user_id):
    user_resource_linkage_obj = crud_user_resource_linkage.get_user_by_id(db, user_id)
    if user_resource_linkage_obj:
        return user_resource_linkage_obj.linkage_status

    return schema.LinkageStatus.NOT_STARTED.value


def fetch_user_connection_detail(db, user_id):
    user_github_obj = check_github_auth(db, user_id)
    user_jira_obj = check_jira_auth(db, user_id)
    user_repo_details = None
    if user_github_obj:
        user_repo_details = schema.UserRepoDetails(
            user_repo_info_id = str(user_github_obj.id),
            repo_id = user_github_obj.repo_id ,
            owner_name = user_github_obj.owner_name,
            repo_name = user_github_obj.repo_name
        )
    user_project_details = None
    if user_jira_obj:
        user_project_details = schema.UserProjectDetails(
            user_project_info_id = str(user_jira_obj.id),
            project_id = user_jira_obj.project_id,
            project_name = user_jira_obj.project_name,
            project_key = user_jira_obj.project_key
        )
    
    return schema.UserConnectionResponse(
        github_authorized = bool(user_github_obj),
        repo_details = user_repo_details,
        jira_authorized = bool(user_jira_obj),
        project_details = user_project_details
    )


def fetch_user_data(db, jwt_payload):
    user_id = jwt_payload.get("id")
    user_github_obj = check_github_auth(db, user_id)
    user_jira_obj = check_jira_auth(db, user_id)
    return schema.UserDataResponse(
        first_name = jwt_payload.get("first_name"),
        last_name = jwt_payload.get("last_name"),
        organization = jwt_payload.get("organization"),
        github_authorized = bool(user_github_obj),
        jira_authorized = bool(user_jira_obj)
    )