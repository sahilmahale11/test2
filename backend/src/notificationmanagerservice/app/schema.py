# generated by datamodel-codegen:
#   filename:  notification.yaml
#   timestamp: 2023-08-11T11:32:40+00:00

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class EmailNotificationRequest(BaseModel):
    email: Optional[EmailStr] = Field(
        None, description='Email address of the recipient.'
    )
    notification_text: Optional[str] = Field(
        None, description='The text content of the email notification.'
    )


class ResponseMessage(BaseModel):
    message: Optional[str] = Field(None, description='ResponseMessage')
