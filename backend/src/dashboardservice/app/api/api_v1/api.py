# ************************************************************
# (C) Copyright 2023 , Inc. All rights reserved.
#
# ************************************************************

from fastapi import APIRouter
from app.api.api_v1.endpoints.dashboardservice import router as dashboardservice_router

router = APIRouter()
router.include_router(dashboardservice_router)
