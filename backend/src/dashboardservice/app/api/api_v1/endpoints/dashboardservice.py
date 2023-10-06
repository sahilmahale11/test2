from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, responses, status
from app.common.api_logging import logger

router = APIRouter()

@router.get( "/")
def test_api_dashboardservice():
    logger.info("dashboardservice endpoint")
    return {"message": "dashboardservice"}