from celery import Celery
from app.common.env_config import settings

app = Celery("notificationmanagerservice", broker=settings.REDIS_URL+"/8", 
                     backend=settings.REDIS_URL_RESULT+"/9",
                     broker_connection_retry_on_startup=True,
                     include=['app.task'])