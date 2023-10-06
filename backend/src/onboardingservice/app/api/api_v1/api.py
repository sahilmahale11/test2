# ************************************************************
# (C) Copyright 2023 , Inc. All rights reserved.
#
# ************************************************************

from fastapi import APIRouter
from app.api.api_v1.endpoints.onboardingservice import router as onboardingservice_router

router = APIRouter()
router.include_router(onboardingservice_router)
