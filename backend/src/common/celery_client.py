import requests
from functools import wraps
from app.common.api_logging import logger
from app.common import constant


TASK_BASE_URL = constant.TASKMANAGERSERVICE

def create_task(base_url, jwt_token, task_data):
    """
    Creates a new task using the provided data.
    """

    headers = {"Authorization": f"Bearer {jwt_token}"}
    create_task_url = f"{base_url}/tasks"
    response = requests.post(create_task_url, json=task_data, headers=headers)
    return response

def update_task(base_url, jwt_token, task_id, task_data):
    """
    Updates the status of a task with the provided data.
    """

    headers = {"Authorization": f"Bearer {jwt_token}"}
    update_task_url = f"{base_url}/tasks/{task_id}"
    response = requests.patch(update_task_url, json=task_data, headers=headers)
    return response

def handle_task_creation(jwt_token: str, task_id: str, task_name: str):
    """
    Handles task creation logic and updates the task status to "INPROGRESS".
    """
    
    create_task_payload = {
        "task_id": task_id,
        "task_name": task_name
    }
    create_response = create_task(TASK_BASE_URL, jwt_token, task_data=create_task_payload)
    logger.info(f"Create Task Response: {create_response.json()}")

def handle_task_update(jwt_token: str, task_id: str, task_status: str):
    """
    Handles task update logic and updates the task status.
    """
    
    update_task_payload = {
        "task_status": task_status
    }
    update_response = update_task(TASK_BASE_URL, jwt_token, task_id, update_task_payload)
    logger.info(f"Update Task Status Code: {update_response.json()}")
