from celery import Celery
from app.common.env_config import settings

app = Celery("webhookservice", broker=settings.REDIS_URL+"/14", 
                     backend=settings.REDIS_URL_RESULT+"/15",
                     broker_connection_retry_on_startup=True,
                     include=['app.task'])