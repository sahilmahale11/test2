from sqlalchemy.orm import Session
import pandas as pd
from app.common.models.onboarding import User, UserRepoInfo, UserProjectInfo, UserResourceLinkage, UserOAuth
from app.common.models.code_processing import RepoCodeMetadata
from app.common.models.requirement_processing import ProjectRequirementMetadata
from app.common.models.human_inloop import TopLinkScore


class CodeMetadataCRUD:
    def create(self, db: Session, user_repo_info_id, code_metadata_data: dict):
        code_metadata = RepoCodeMetadata(user_repo_info_id=user_repo_info_id,**code_metadata_data)
        db.add(code_metadata)
        db.commit()
        db.refresh(code_metadata)
        return code_metadata
    
    def get_combined_repo_info(self, db: Session, user_repo_info_id: int):
        repo_information_db_obj = db.query(UserRepoInfo).get(user_repo_info_id)
        if repo_information_db_obj:
            repo_information_db = {
                "repo_id": repo_information_db_obj.repo_id,
                "owner_name": repo_information_db_obj.owner_name,
                "repo_name": repo_information_db_obj.repo_name,
                "branch_name": repo_information_db_obj.branch,
                "access_token": repo_information_db_obj.user_oauth.access_token,
                "first_name": repo_information_db_obj.user_oauth.user.first_name,
                "last_name": repo_information_db_obj.user_oauth.user.last_name
            }
            return repo_information_db
        return {}
    
    def update_user_repo_info_setup_status(self, db: Session, user_repo_info_id: int, new_setup_status: bool):
        try:
            user_repo_info = db.query(UserRepoInfo).filter(UserRepoInfo.id == user_repo_info_id).first()
            if user_repo_info:
                user_repo_info.setup_status = new_setup_status
                db.commit()
                db.refresh(user_repo_info)
                return True
            return False
        except Exception as e:
            db.rollback()
            raise e
    def delete_by_user_id(self, db: Session, user_repo_info_id: int):
        try:
            # Find and delete all records associated with the user_id
            db.query(RepoCodeMetadata).filter(RepoCodeMetadata.user_repo_info_id == user_repo_info_id).delete()
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise e
        
class RequirementMetadataCRUD:
    def create(self, db: Session, user_project_info_id, requirement_metadata_data: dict):
        requirement_metadata = ProjectRequirementMetadata(user_project_info_id=user_project_info_id, **requirement_metadata_data)
        db.add(requirement_metadata)
        db.commit()
        db.refresh(requirement_metadata)
        return requirement_metadata
    
    def get_combined_project_info(self, db: Session, user_project_info_id: int):
        repo_information_db_obj = db.query(UserProjectInfo).get(user_project_info_id)

        if repo_information_db_obj and repo_information_db_obj.user_oauth.oauth_provider=="JIRA":
            repo_information_db = {
                "project_id": repo_information_db_obj.project_id,
                "project_name": repo_information_db_obj.project_name,
                "project_key": repo_information_db_obj.project_key,
                "access_token": repo_information_db_obj.user_oauth.access_token,
                "cloud_id": repo_information_db_obj.user_oauth.cloud_id,
                "first_name": repo_information_db_obj.user_oauth.user.first_name,
                "last_name": repo_information_db_obj.user_oauth.user.last_name
            }
            return repo_information_db
        return {}

    def update_user_project_info_setup_status(self, db: Session, user_project_info_id: int, new_setup_status: bool):
        try:
            user_project_info = db.query(UserProjectInfo).filter(UserProjectInfo.id == user_project_info_id).first()
            if user_project_info:
                user_project_info.setup_status = new_setup_status
                db.commit()
                db.refresh(user_project_info)
                return True
            return False
        except Exception as e:
            db.rollback()
            raise e
    def delete_by_user_id(self, db: Session, user_project_info_id: int):
        try:
            # Find and delete all records associated with the user_id
            db.query(ProjectRequirementMetadata).filter(ProjectRequirementMetadata.user_project_info_id == user_project_info_id).delete()
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise e
        
class UserResourceLinkageCRUD:

    def create(self, db: Session, user_id, user_repo_info_id,user_project_info_id,linkage_status):
        new_linkage = UserResourceLinkage(
            user_id=user_id,
            user_repo_info_id=user_repo_info_id,
            user_project_info_id=user_project_info_id,
            linkage_status=linkage_status
        )
        db.add(new_linkage)
        db.commit()
        db.refresh(new_linkage)
        return new_linkage

    def read(self, db: Session, user_id: int):
            return (
                db.query(UserResourceLinkage)
                .filter(UserResourceLinkage.user_id == user_id)
                .first()
            )
    def update(self, db: Session, user_id: int, linkage_status, message = None):
        try:
            user_resource_linkage = self.read(db, user_id)
            if user_resource_linkage:
                user_resource_linkage.linkage_status = linkage_status
                user_resource_linkage.reason = message
                db.commit()
                db.refresh(user_resource_linkage)
                return user_resource_linkage
            return None
        except Exception as e:
            db.rollback()
            raise e


class TopLinkScoreCRUD:
    def load_dataframe_into_db(self, db: Session, dataframe: pd.DataFrame):
        """
        Load a DataFrame into the 'TopLinkScore' database table.
        """
        try:
            for _, row in dataframe.iterrows():
                top_link_score = TopLinkScore(
                    user_id=row['user_id'],
                    repo_code_metadata_uuid=row['repo_code_metadata_uuid'],
                    project_requirement_metadata_uuid=row['project_requirement_metadata_uuid'],
                    score=row['score'],
                    human_verification=row['human_verification']
                )
                db.add(top_link_score)

            db.commit()
        except Exception as e:
            db.rollback()
            raise e

    def delete_by_id(self, db: Session, user_id: int):
        try:
            db.query(TopLinkScore).filter(TopLinkScore.user_id == user_id).delete()
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise e


class UserOAuthCRUD:
    def read_by_user_id(self, db: Session, user_id: int, oauth_provider:str):
        try:
            user_oauth = (
                db.query(UserOAuth)
                .filter(UserOAuth.user_id == user_id, UserOAuth.oauth_provider == oauth_provider)
                .first()
            )
            return user_oauth
        except Exception as e:
            raise e
        
class UserCRUD:
    def get_user_by_id(self, db: Session, user_id: int):
        try:
            return db.query(User).filter(User.id == user_id).first()
        except Exception as e:
            raise e