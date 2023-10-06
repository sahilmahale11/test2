from app.celery_app import app
from app.common.api_logging import logger
from app.common import database
from app.common.celery_client import handle_task_creation, handle_task_update
from app.api.api_v1.endpoints.utils import repo_project_connection, repo_metadata_embedding, project_metadata_embedding


@app.task()
def task_begin_ai_analysis(jwt_token, user_id, user_repo_info_id, user_project_info_id):
    response=""
    try:
        db = database.get_db()
        handle_task_creation(jwt_token, task_begin_ai_analysis.request.id, "task_begin_ai_analysis")
        response = repo_project_connection(db, user_id, user_repo_info_id, user_project_info_id)
    except Exception as e:
        logger.error(f"Error: {e}")
        handle_task_update(jwt_token, task_begin_ai_analysis.request.id, "FAILED")
        response = "Error- task_begin_ai_analysis"
    else:
        handle_task_update(jwt_token, task_begin_ai_analysis.request.id, "SUCCESS")
    return response

@app.task()
def task_repo_metadata_embedding(jwt_token, user_id, user_repo_info_id):
    response=""
    try:
        db = database.get_db()
        handle_task_creation(jwt_token, task_repo_metadata_embedding.request.id, "task_repo_metadata_embedding")
        response = repo_metadata_embedding(db, user_id, user_repo_info_id)
    except Exception as e:
        logger.error(f"Error: {e}")
        handle_task_update(jwt_token, task_repo_metadata_embedding.request.id, "FAILED")
        response = "Error- task_repo_metadata_embedding"
    else:
        handle_task_update(jwt_token, task_repo_metadata_embedding.request.id, "SUCCESS")
    return response

@app.task()
def task_project_metadata_embedding(jwt_token, user_id, user_project_info_id):
    response=""
    try:
        db = database.get_db()
        handle_task_creation(jwt_token, task_project_metadata_embedding.request.id, "task_project_metadata_embedding")
        response = project_metadata_embedding(db, user_id, user_project_info_id)
    except Exception as e:
        logger.error(f"Error: {e}")
        handle_task_update(jwt_token, task_project_metadata_embedding.request.id, "FAILED")
        response = "Error- task_project_metadata_embedding"
    else:
        handle_task_update(jwt_token, task_project_metadata_embedding.request.id, "SUCCESS")
    return response