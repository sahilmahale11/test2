from sqlalchemy.orm import Session
from app.common.models.human_inloop import TopLinkScore
from app.common.models.code_processing import RepoCodeMetadata
from app.common.models.requirement_processing import ProjectRequirementMetadata
from app.common.models.onboarding import UserOAuth, UserResourceLinkage
from collections import OrderedDict 
from app.schema import LinkageStatusEnum


class TopLinkScoreCRUD:
    def read_by_user_id(self, db: Session, user_id: int):
        try:
            top_link_scores = (
                db.query(
                    TopLinkScore.id,
                    TopLinkScore.score,
                    ProjectRequirementMetadata.task_id,
                    ProjectRequirementMetadata.url_path,
                    RepoCodeMetadata.name,
                    RepoCodeMetadata.code_type,
                    RepoCodeMetadata.url_path,
                    TopLinkScore.human_verification
                ).join(
                    ProjectRequirementMetadata,
                    ProjectRequirementMetadata.embed_uuid == TopLinkScore.project_requirement_metadata_uuid
                ).join(
                    RepoCodeMetadata,
                    RepoCodeMetadata.embed_uuid == TopLinkScore.repo_code_metadata_uuid
                )
                .filter(TopLinkScore.user_id == user_id)
                .order_by(TopLinkScore.score.desc())
                .all()
            )
            top_link_scores_dict_list = [
                 OrderedDict({
                            "top_link_id": score[0],
                            "score": score[1],
                            "code_info": {
                                "file_uri": score[6],
                                "type":  score[5],
                                "name": score[4]},
                            "requirement_info": {
                                "name": score[2],
                                "url_path": score[3]},
                            "human_verification": score[7]
                            })
                for score in top_link_scores
            ]
            return top_link_scores_dict_list
        except Exception as e:
            raise e


    def update_human_verification(self, db: Session, update_statements):
        try:
            db.bulk_update_mappings(TopLinkScore, update_statements)
            db.commit() 
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


class CRUDUserResourceLinkage:
    def update_user_resource(self, db: Session, user_id, support_status, reason = None):
        try:
            user_resource_linkage_db_obj = db.query(UserResourceLinkage).filter(UserResourceLinkage.user_id == user_id).first()
            if user_resource_linkage_db_obj:
                current_status = user_resource_linkage_db_obj.linkage_status.value
                
                if support_status == LinkageStatusEnum.COMPLETED.value:
                    if current_status in (LinkageStatusEnum.SUPPORTED.value, LinkageStatusEnum.UNSUPPORTED.value):
                        user_resource_linkage_db_obj.linkage_status = support_status
                        db.commit()
                        db.refresh(user_resource_linkage_db_obj)
                    else:
                        raise Exception("Invalid linkage status")
                elif support_status in (LinkageStatusEnum.SUPPORTED.value, LinkageStatusEnum.UNSUPPORTED.value):
                    if current_status == LinkageStatusEnum.AWAITING_VALIDATION.value:
                        user_resource_linkage_db_obj.linkage_status = support_status
                        user_resource_linkage_db_obj.reason = reason
                        db.commit()
                        db.refresh(user_resource_linkage_db_obj)
                    else:
                        raise Exception("Invalid linkage status")
                else:
                    raise Exception("Invalid support status")
            else:
                raise Exception("User resource linkage not found")
        except Exception as e:
            raise e   