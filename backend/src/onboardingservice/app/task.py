from time import sleep
from app.celery_app import app
from app.common.api_logging import logger
from app.common.celery_client import handle_task_creation, handle_task_update


@app.task(bind=True,max_retries=5,soft_time_limit=20)
def taskonboardingservice(self, jwt_token: str):
    response=""
    try:
        handle_task_creation(jwt_token, taskonboardingservice.request.id, taskonboardingservice.name)
        sleep(5)
        response = "Done response"
        handle_task_update(jwt_token, taskonboardingservice.request.id, "SUCCESS")
    except Exception:
        logger.error("Error")
        handle_task_update(jwt_token, taskonboardingservice.request.id, "FAILED")
        response = "bad response"
    return response