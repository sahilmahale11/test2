from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.common.database import get_db
from app.common.auth import JWTBearer
from fastapi import APIRouter, Depends, status
from app.common.api_logging import logger
from typing import List
from app import messages
from app.schema import TopLinkInfo, VerificationInfo, ValidateResponseMessage, LinkageResponseMessage,LinkageStatusEnum
from app.crud import TopLinkScoreCRUD, CRUDUserResourceLinkage
from app.api.api_v1.endpoints.utils import get_top_scores, get_toplink_score, update_toplink_score


router = APIRouter()
toplink_crud = TopLinkScoreCRUD()
resource_linkage_crud = CRUDUserResourceLinkage()

@router.get("/confirmation/scores",response_model = List[TopLinkInfo], status_code=status.HTTP_200_OK)
def fetch_top_link_score(jwt_payload = Depends(JWTBearer()), db: Session = Depends(get_db)):
    try:
        total_top_score = get_toplink_score(db, get_top_scores(jwt_payload, db, toplink_crud))
        if total_top_score:
            logger.info(f"Total top score: {total_top_score}")
            return total_top_score
        else:
            return []
    except Exception as e:
        logger.error(f"{messages.ERROR_RESPONSE_GET_TOP_LINK}:{str(e)}")
        return {"message": messages.ERROR_RESPONSE_GET_TOP_LINK}


@router.post("/confirmation/scores/validate", response_model=ValidateResponseMessage, status_code=status.HTTP_200_OK)
def verify_link_score(request: List[VerificationInfo], jwt_payload = Depends(JWTBearer()), db: Session = Depends(get_db)):
    try:
        user_id = jwt_payload["id"]
        support_status, reason = update_toplink_score(db, request, toplink_crud)
        resource_linkage_crud.update_user_resource(db, user_id, support_status, reason)
        return ValidateResponseMessage(message="Scores Verified Successfully", support_status=support_status, reason=reason)
    except Exception as e:
        logger.error(e)
        return {"message": f"An error occurred: {str(e)}"}


@router.post("/confirmation/status/complete", response_model=LinkageResponseMessage, status_code=status.HTTP_200_OK)
def set_linkage_status(jwt_payload = Depends(JWTBearer()), db: Session = Depends(get_db)):
    try:
        user_id = jwt_payload["id"]
        resource_linkage_crud.update_user_resource(db, user_id, LinkageStatusEnum.COMPLETED.value)
        return LinkageResponseMessage(message="Success",linkage_status=LinkageStatusEnum.COMPLETED.value)
    except Exception as e:
        logger.error(e)
        return {"message": f"An error occurred: {str(e)}"}