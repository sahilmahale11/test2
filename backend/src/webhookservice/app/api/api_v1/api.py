# ************************************************************
# (C) Copyright 2023 , Inc. All rights reserved.
#
# ************************************************************

from fastapi import APIRouter
from app.api.api_v1.endpoints.webhookservice import router as webhookservice_router

router = APIRouter()
router.include_router(webhookservice_router)
