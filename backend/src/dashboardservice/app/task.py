from time import sleep
from app.celery_app import app

@app.task
def taskdashboardservice():
    sleep(5)
    return "Test successful - dashboardservice"