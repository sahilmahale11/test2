# ************************************************************
# (C) Copyright 2023 , Inc. All rights reserved.
#
# ************************************************************

from fastapi import APIRouter
from app.api.api_v1.endpoints.taskmanagerservice import router as taskmanagerservice_router

router = APIRouter()
router.include_router(taskmanagerservice_router)
