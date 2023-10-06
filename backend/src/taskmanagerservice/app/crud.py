from datetime import datetime
from typing import List
from sqlalchemy.orm import Session
from app.common.models.task_manager import TaskManager, TaskStatus
from app.schema import *

class CRUDManager:

    def create_task(self, db: Session, user_id: int, task_data: CeleryTaskDetailsRequest) -> CeleryTaskDetailsResponse:
        task = TaskManager(user_id=user_id, task_status=TaskStatus.INPROGRESS, created_at=datetime.utcnow(), updated_at=datetime.utcnow(),**task_data.dict())
        db.add(task)
        db.commit()
        db.refresh(task)
        response_task_data = self.taskResponseGenerator(task)
        return response_task_data
    
    def get_task_by_task_id(self, db: Session, user_id: int, task_id: str) -> CeleryTaskDetailsResponse:
        task = db.query(TaskManager).filter(TaskManager.task_id == task_id, TaskManager.user_id == user_id).first()
        if task:
            response_task_data = self.taskResponseGenerator(task)
            return response_task_data
        else:
            return None 
        
    def get_task_by_task_name(self, db: Session, user_id: int, task_name: str) -> CeleryTaskDetailsResponse:
        task = db.query(TaskManager).filter(TaskManager.task_name == task_name, TaskManager.user_id == user_id).first()
        if task:
            response_task_data = self.taskResponseGenerator(task)
            return response_task_data
        else:
            return None 
        
    def update_task_status(self, db: Session, user_id: int, task_id: int, new_status: TaskStatus) -> CeleryTaskDetailsResponse:
        task = db.query(TaskManager).filter(TaskManager.task_id == task_id, TaskManager.user_id == user_id).first()
        if task:
            task.task_status = new_status
            task.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(task)
            response_task_data = self.taskResponseGenerator(task)
            return response_task_data
        return None

    def list_all_tasks(self, db: Session, user_id: int) -> List[CeleryTaskDetailsResponse]:
        tasks = db.query(TaskManager).filter(TaskManager.user_id == user_id).all()
        response_tasks = []
        for task in tasks:
            response_task_data = self.taskResponseGenerator(task)
            response_tasks.append(response_task_data)
        return response_tasks

    def taskResponseGenerator(Self, task) -> CeleryTaskDetailsResponse:
        return CeleryTaskDetailsResponse(
        task_id=task.task_id,
        task_name=task.task_name,
        task_status=task.task_status,
        creation_time=task.created_at,
        updation_time=task.updated_at)