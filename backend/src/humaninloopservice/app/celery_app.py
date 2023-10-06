from celery import Celery
from app.common.env_config import settings

app = Celery("humaninloopservice", broker=settings.REDIS_URL+"/4", 
                     backend=settings.REDIS_URL_RESULT+"/5",
                     broker_connection_retry_on_startup=True,
                     include=['app.task'])