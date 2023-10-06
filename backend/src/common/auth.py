import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import bcrypt
import requests
from sqlalchemy.orm import Session
from app.common.api_logging import logger
from app.common import constant

class Hash:

    def encode_password(password: str):
        password_bytes = password.encode("utf-8")
        password_salt = bcrypt.gensalt()
        encoded_password = bcrypt.hashpw(password_bytes, password_salt)
        return encoded_password.decode("utf-8")

    def verify(hashed_password, plain_password):
        passbytes = plain_password.encode("utf-8")
        encoded_password = hashed_password.encode("utf-8")
        return bcrypt.checkpw(passbytes, encoded_password)

# JWT Token Details
JWT_SECRET_KEY = constant.JWT_SECRET_KEY
API_ALGORITHM = constant.API_ALGORITHM
API_ACCESS_TOKEN_EXPIRE_MINUTES = constant.API_ACCESS_TOKEN_EXPIRE_MINUTES


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=401, detail="Invalid authentication scheme.")
            payload = self.decode_jwt(credentials.credentials)
            return payload

    def decode_jwt(self, jwtoken: str) -> dict:
        try:
            payload = jwt.decode(jwtoken, JWT_SECRET_KEY, algorithms=[API_ALGORITHM])
            if not all(
                item in list(payload.keys()) for item in ["id", "first_name", "last_name", "email"]
            ):
                raise HTTPException(status_code=401, detail="Invalid token or expired token.")
        except (jwt.InvalidTokenError, jwt.ExpiredSignatureError, jwt.DecodeError) as exc:
            logger.error(f"TokenError: {str(exc)}")
            raise HTTPException(status_code=401, detail="Invalid token or expired token.")

        return payload

def create_token(user_data, minutes=API_ACCESS_TOKEN_EXPIRE_MINUTES):
    """
    This function takes user_data as an argument and creates a JWT token using it
    and returns the generated JWT token
    """
    access_token_expires = timedelta(minutes=minutes)
    access_token = create_access_token(payload=user_data, expires_delta=access_token_expires)
    return access_token


def create_access_token(payload: dict, expires_delta: timedelta = None):
    """
    This function creates jwt token for the given payload
    """
    to_encode = payload.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=API_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=API_ALGORITHM)
    return encoded_jwt


JIRA_CLIENT_ID = constant.JIRA_CLIENT_ID
JIRA_CLIENT_SECRET = constant.JIRA_CLIENT_SECRET
JIRA_REDIRECT_URI = constant.JIRA_REDIRECT_URI

def check_github_token_validity(db: Session, user_oauth_db_obj):

    if datetime.utcnow() > user_oauth_db_obj.access_token_expiry:
        raise Exception(constant.GITHUB_TOKEN_EXPIRED)
    return user_oauth_db_obj

def update_access_token(db: Session, user_oauth_db_obj, user_oauth_data):
        user_oauth_db_obj.access_token = user_oauth_data["access_token"]
        user_oauth_db_obj.refresh_token = user_oauth_data["refresh_token"]
        user_oauth_db_obj.access_token_expiry = user_oauth_data["access_token_expiry"]            
        db.commit()
        db.refresh(user_oauth_db_obj)
        
        return user_oauth_db_obj


def check_jira_token_validity(db, user_oauth_db_obj):

    if datetime.utcnow() > user_oauth_db_obj.access_token_expiry:

        token_url = constant.JIRA_ACCESS_TOKEN_URL
        data = {
        "grant_type": "refresh_token",
        "refresh_token": user_oauth_db_obj.refresh_token,
        "client_id": JIRA_CLIENT_ID,
        "client_secret": JIRA_CLIENT_SECRET,
        "redirect_uri": JIRA_REDIRECT_URI
        }


        response = requests.post(token_url, data=data)
        if response.status_code == 200:
            expire_hours = constant.JIRA_ACCESS_TOKEN_EXPIRE_HOURS
            access_token = response.json().get("access_token")
            refresh_token = response.json().get("refresh_token")
            user_oauth_dict = {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "access_token_expiry": datetime.utcnow() + timedelta(hours=expire_hours)
            }
            user_oauth_db_obj = update_access_token(db, user_oauth_db_obj, user_oauth_dict)

        elif response.status_code == 400:
            raise HTTPException(
            status_code=400,
            detail=constant.JIRA_REFRESH_TOKEN_EXPIRED
        )

        else:
            logger.error(f"Error: Failed to refresh token. Status Code:: {response.status_code} and message: {response.text}")
            return None


    return user_oauth_db_obj