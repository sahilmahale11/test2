# ************************************************************
# (C) Copyright 2023 , Inc. All rights reserved.
#
# ************************************************************

from fastapi import APIRouter
from app.api.api_v1.endpoints.humaninloopservice import router as humaninloopservice_router

router = APIRouter()
router.include_router(humaninloopservice_router)
