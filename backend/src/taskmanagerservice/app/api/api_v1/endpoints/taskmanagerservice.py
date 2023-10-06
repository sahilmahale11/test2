from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.common.auth import JWTBearer
from app.common.api_logging import logger
from app.common.database import get_db
from app.crud import CRUDManager
from app import schema, messages

router = APIRouter()
crud_manager = CRUDManager()

@router.post("/tasks", response_model=schema.CeleryTaskDetailsResponse, status_code=status.HTTP_200_OK)
def create_task(
    task_data: schema.CeleryTaskDetailsRequest,
    jwt_payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """Create a new Celery task."""

    try:
        user_id = jwt_payload.get("id")
        # Check if task_id is already in the database
        existing_task_id = crud_manager.get_task_by_task_id(db=db, user_id=user_id, task_id=task_data.task_id)
        if existing_task_id:
            raise HTTPException(status_code=400, detail=messages.TASK_ID_ALREADY_EXISTS)
        task = crud_manager.create_task(db=db, user_id=user_id, task_data=task_data)
        return task
    
    except HTTPException as http_exception:
        raise http_exception
    
    except Exception as e:
        logger.error(f"Error creating task: {e}")
        raise HTTPException(status_code=400, detail=messages.ERROR_CREATE_TASK)

@router.get("/tasks/{task_id}", response_model=schema.CeleryTaskDetailsResponse)
def read_task(
    task_id: str,
    jwt_payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """Read details of a Celery task by its ID."""

    user_id = jwt_payload.get("id")
    task = crud_manager.get_task_by_task_id(db=db, user_id=user_id, task_id=task_id)
    if task is None:
        logger.error(f"Task with ID {task_id} not found")
        raise HTTPException(status_code=404, detail=messages.TASK_ID_NOT_FOUND)
    return task

@router.patch("/tasks/{task_id}", response_model=schema.CeleryTaskDetailsResponse)
def update_task(
    task_id: str,
    task_data: schema.CeleryTaskUpdateRequest,
    jwt_payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """Update the status of an existing Celery task."""

    user_id = jwt_payload.get("id")
    task = crud_manager.update_task_status(db=db, user_id=user_id, task_id=task_id, new_status=task_data.task_status.value)
    if task is None:
        logger.error(f"Task with ID {task_id} not found")
        raise HTTPException(status_code=404, detail=messages.TASK_ID_NOT_FOUND)
    return task

@router.get("/tasks", response_model=List[schema.CeleryTaskDetailsResponse])
def list_tasks(jwt_payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """List all Celery tasks."""

    logger.info("Listing all Celery tasks")
    user_id = jwt_payload.get("id")
    return crud_manager.list_all_tasks(db=db, user_id=user_id)