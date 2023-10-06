from celery import Celery
from app.common.env_config import settings

app = Celery("dashboardservice", broker=settings.REDIS_URL+"/2", 
                     backend=settings.REDIS_URL_RESULT+"/3",
                     broker_connection_retry_on_startup=True,
                     include=['app.task'])