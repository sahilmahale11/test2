# ************************************************************
# (C) Copyright 2023 , Inc. All rights reserved.
#
# ************************************************************

from fastapi import APIRouter
from app.api.api_v1.endpoints.notificationmanagerservice import router as notificationmanagerservice_router

router = APIRouter()
router.include_router(notificationmanagerservice_router)
