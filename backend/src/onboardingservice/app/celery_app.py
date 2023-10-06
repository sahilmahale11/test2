from celery import Celery
from app.common.env_config import settings

app = Celery("onboardingservice", broker=settings.REDIS_URL+"/10", 
                     backend=settings.REDIS_URL_RESULT+"/11",
                     broker_connection_retry_on_startup=True,
                     include=['app.task'])