import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.common.env_config import settings
from app.api.api_v1.api import router as notificationmanagerservice_api_router
from app.common import api_logging

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notificationmanagerservice_api_router, prefix="/api/v1/notificationmanagerservice", dependencies=[Depends(api_logging.logging_dependency)])


if __name__ == "__main__":
    uvicorn.run(app, port=3006)
