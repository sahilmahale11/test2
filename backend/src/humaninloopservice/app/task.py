from time import sleep
from app.celery_app import app

@app.task
def taskhumaninloopservice():
    sleep(5)
    return "Test successful - humaninloopservice"