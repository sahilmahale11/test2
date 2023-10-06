from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from app.common.models.onboarding import User, UserOAuth, UserRepoInfo , UserProjectInfo , UserResourceLinkage
from app.schema import SignUpRequest, SelectGitHubRepositoryRequest, SelectJiraProjectRequest

class CRUDUser:
    def create_user(self, db: Session, user_data: SignUpRequest):
        new_user = User(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=user_data.email,
            encrypted_password=user_data.password,
            organization=user_data.organization,
            trial=False,
            created_at=datetime.now()
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    def get_user_by_email(self, db: Session, email: str):
        return db.query(User).filter(User.email == email).first()


crud_user = CRUDUser()


class CRUDUserOAuth:
    def create_user_oauth(self, db: Session, user_oauth_data):

        new_user_oauth = UserOAuth(
            user_id = user_oauth_data["user_id"],
            access_token = user_oauth_data["access_token"],
            refresh_token = user_oauth_data["refresh_token"],
            oauth_provider = user_oauth_data["oauth_provider"],
            cloud_id = user_oauth_data["cloud_id"],
            access_token_expiry = user_oauth_data["access_token_expiry"],
            project_site = user_oauth_data["project_site"]
        )
        db.add(new_user_oauth)
        db.commit()
        db.refresh(new_user_oauth)
        return new_user_oauth
    

    def get_user_by_oauth_id(self, db: Session, oauth_id: str):
        return db.query(UserOAuth).filter(UserOAuth.id == oauth_id).first()


    def get_user_by_id_and_provider(self, db: Session, user_id:int, oauth_provider:str):
        return db.query(UserOAuth).filter(UserOAuth.user_id == user_id, UserOAuth.oauth_provider == oauth_provider).first()
    
    
    def update_access_token(self, db: Session, user_oauth_db_obj, user_oauth_data):
        user_oauth_db_obj.access_token = user_oauth_data["access_token"]
        user_oauth_db_obj.refresh_token = user_oauth_data["refresh_token"]
        user_oauth_db_obj.access_token_expiry = user_oauth_data["access_token_expiry"]            
        db.commit()
        db.refresh(user_oauth_db_obj)
        
        return user_oauth_db_obj


    def get_user_by_id_and_cloud_id(self, db: Session, user_id: int, cloud_id: str):
        return db.query(UserOAuth).filter(UserOAuth.user_id == user_id, UserOAuth.cloud_id == cloud_id).first()


crud_user_oauth = CRUDUserOAuth()


class CRUDUserRepoInfo:
    def create_user_repo(self, db: Session, repo_data: SelectGitHubRepositoryRequest, user_oauth_id):
        new_user_repo = UserRepoInfo(
            user_oauth_id = user_oauth_id,
            repo_id = repo_data.repo_id,
            repo_name = repo_data.repo_name,
            owner_name = repo_data.owner_name, 
            branch = repo_data.branch_name,
            setup_status = False
        )
        db.add(new_user_repo)
        db.commit()
        db.refresh(new_user_repo)
        return new_user_repo
        

    def get_user_by_id(self, db: Session, user_id:int):
        return db.query(UserRepoInfo).filter(UserRepoInfo.user_oauth.has(UserOAuth.user_id == user_id)).first()


crud_user_repo_info = CRUDUserRepoInfo()


class CRUDUserProjectInfo:
    def create_user_project(self, db: Session, project_data: SelectJiraProjectRequest, user_oauth_id):
        new_user_project = UserProjectInfo(
            user_oauth_id = user_oauth_id,
            project_id = project_data.project_id,
            project_name = project_data.project_name,
            project_key = project_data.project_key,
            setup_status = False
        )
        db.add(new_user_project)
        db.commit()
        db.refresh(new_user_project)
        return new_user_project
    

    def get_user_by_id(self, db: Session, user_id:int):
        return db.query(UserProjectInfo).filter(UserProjectInfo.user_oauth.has(UserOAuth.user_id == user_id)).first()


crud_user_project_info = CRUDUserProjectInfo()


class CRUDUserResourceLinkage:
    def get_user_by_id(self, db: Session, user_id:int):
        return db.query(UserResourceLinkage).filter(UserResourceLinkage.user_id == user_id).first()


crud_user_resource_linkage = CRUDUserResourceLinkage()