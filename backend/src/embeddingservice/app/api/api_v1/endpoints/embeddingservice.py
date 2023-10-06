import concurrent.futures
from sqlalchemy.orm import Session
from app.common.database import get_db
from fastapi import APIRouter, Depends, status
from app.common.auth import JWTBearer, create_token
from fastapi import APIRouter, Depends, status
from app.common.api_logging import logger
from app.common import constant
from app import messages
from app.crud import UserResourceLinkageCRUD, UserCRUD
from app.task import task_begin_ai_analysis, task_repo_metadata_embedding, task_project_metadata_embedding
from app.schema import LinkageStatusEnum

router = APIRouter()
user_resource_linkage = UserResourceLinkageCRUD()
user_crud = UserCRUD()

@router.post("/begin-ai-analysis", status_code=status.HTTP_200_OK)
def begin_ai_analysis(user_repo_info_id: int, user_project_info_id: int, jwt_payload = Depends(JWTBearer()), db = Depends(get_db)):
    try:
        token = create_token(jwt_payload, 120)
        analysis_task = task_begin_ai_analysis.delay(token, jwt_payload['id'], user_repo_info_id, user_project_info_id)
        return {"analysis_task": analysis_task.id}
    except Exception as e:
        logger.error(e)
        return {"message": f"An error occurred: {str(e)}"}
    
@router.get("/begin-ai-analysis", status_code=status.HTTP_200_OK)
def get_begin_ai_analysis(jwt_payload = Depends(JWTBearer()), db = Depends(get_db)):
    try:
        link_status = user_resource_linkage.read(db, jwt_payload['id'])
        if link_status:
            return {"linkage_status": link_status.linkage_status.value, "reason": link_status.reason}
        else:
            return {"linkage_status": LinkageStatusEnum.NOT_STARTED.value, "reason": None}
        
    except Exception as e:
        logger.error(e)
        return {"message": f"An error occurred: {str(e)}"}
    

@router.post("/process-code-metadata", status_code=status.HTTP_200_OK, tags=["Admin Access API"])
def process_code_metadata(admin_access_key: str, user_id: str, user_repo_info_id: int, db = Depends(get_db)):
    try:
        if admin_access_key != constant.ADMIN_ACCESS_KEY:
            logger.error(messages.ADMIN_API_AUTHENTICATION_FAILED)
            raise Exception(messages.SOMETHING_WENT_WRONG)
        user_data = user_crud.get_user_by_id(db, user_id)
        if user_data:
            user_jwt_payload = {
                "id": user_data.id,
                "first_name": user_data.first_name,
                "last_name": user_data.last_name,
                "email": user_data.email,
                "organization": user_data.organization
            }
            token = create_token(user_jwt_payload, 120)
            analysis_task = task_repo_metadata_embedding.delay(token, user_data.id, user_repo_info_id)
            return {"analysis_task": analysis_task.id}
        else:
            raise Exception(messages.INCORRECT_USER_ID)
    except Exception as e:
        logger.error(e)
        return {"message": f"An error occurred: {str(e)}"}

@router.post("/process-project-metadata", status_code=status.HTTP_200_OK, tags=["Admin Access API"])
def process_project_metadata(admin_access_key: str, user_id: str, user_project_info_id: int, db = Depends(get_db)):
    try:
        if admin_access_key != constant.ADMIN_ACCESS_KEY:
            logger.error(messages.ADMIN_API_AUTHENTICATION_FAILED)
            raise Exception(messages.SOMETHING_WENT_WRONG)
        user_data = user_crud.get_user_by_id(db, user_id)
        if user_data:
            user_jwt_payload = {
                "id": user_data.id,
                "first_name": user_data.first_name,
                "last_name": user_data.last_name,
                "email": user_data.email,
                "organization": user_data.organization
            }
            token = create_token(user_jwt_payload, 120)
            analysis_task = task_project_metadata_embedding.delay(token, user_data.id, user_project_info_id)
            return {"analysis_task": analysis_task.id}
        else:
            raise Exception(messages.INCORRECT_USER_ID)
    except Exception as e:
        logger.error(e)
        return {"message": f"An error occurred: {str(e)}"}