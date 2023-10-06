from celery import Celery
from app.common.env_config import settings

app = Celery("embeddingservice", broker=settings.REDIS_URL+"/0", 
                     backend=settings.REDIS_URL_RESULT+"/1",
                     broker_connection_retry_on_startup=True,
                     include=['app.task'])