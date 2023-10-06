from app.common.env_config import settings

ONBOARDINGSERVICE = "http://onboardingservice/api/v1/onboardingservice"
EMBEDDINGSERVICE = "http://embeddingservice/api/v1/embeddingservice"
HUMANINLOOPSERVICE = "http://humaninloopservice/api/v1/humaninloopservice"
DASHBOARDSERVICE = "http://dashboardservice/api/v1/dashboardservice"
NOTIFICATIONMANAGERSERVICE = "http://notificationmanagerservice/api/v1/notificationmanagerservice"
WEBHOOKSERVICE = "http://webhookservice/api/v1/webhookservice"
TASKMANAGERSERVICE = "http://taskmanagerservice/api/v1/taskmanagerservice"

#      JWT TOKEN
JWT_SECRET_KEY = "f3243e7a388b5589d242d7490e8f178d4ff8d6ca9b9dcf30cceb1f8067705394"
API_ALGORITHM = "HS256"
API_ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

#      GITHUB_APP_KEYS
GITHUB_CLIENT_ID = "60b1bda3790825235c9a"
GITHUB_CLIENT_SECRET = "7f24811df9bea172a5d96351370d3a8e37f149c5"
GITHUB_REDIRECT_URI = "https://staging.theoversight.ai/oauth"
GITHUB_ACCESS_TOKEN_EXPIRE_HOURS = 8

#      JIRA_APP_KEYS
JIRA_CLIENT_ID = "ynBK1K25l39hDduohCmOtkfbMmvKnoF8"
JIRA_CLIENT_SECRET = "ATOAisM6GOcBdusTwoZnI2N3ii1KDTwyYniX9tYcA4VyyKfxNRdxZvoQ1-mnf2RXVK7fC7A413A0"
JIRA_REDIRECT_URI = "https://staging.theoversight.ai/auth"
JIRA_ACCESS_TOKEN_EXPIRE_HOURS = 1

#      GITHUB_API_URL
GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_DETAILS_URL = "https://api.github.com/user"
GITHUB_BASE_USER_URL = "https://api.github.com/user/"
GITHUB_BASE_REPO_URL = "https://api.github.com/repos/"


#      JIRA_API_URL
JIRA_ACCESS_TOKEN_URL = "https://auth.atlassian.com/oauth/token"
JIRA_CLOUD_ID_URL = "https://api.atlassian.com/oauth/token/accessible-resources"
JIRA_CLOUD_API_URL = "https://api.atlassian.com/ex/jira"

#      QDRANT CLOUD
QDRANT_CLOUD_API_KEY = "aVNJlzDqRRTWgyIjqGRl9oye_GpFbD7saN7jeXIUIMu6F-6gi640zg"
QDRANT_CLOUD_PATH = "https://aa1c58ce-2878-4521-825b-df069182e0c9.us-east-1-0.aws.cloud.qdrant.io:6333"

#      AWS SAGEMAKER
SAGEMAKER_RUNTIME = "sagemaker-runtime"
SAGEMAKER_SENTENCE_TRANSFORMER_ENDPOINT_NAME = 'serverless-sentence-transformer-ep'
SAGEMAKER_LLM_ENDPOINT_NAME = 'llama-hub-endpoint'

#      MESSAGES
GITHUB_TOKEN_EXPIRED = "Github access token is expired. Please authenticate again"
JIRA_REFRESH_TOKEN_EXPIRED = "Refresh Token is expired. Please authenticate again"

#      CONFIG FILE
MODEL_CONFIG_FILE ="/app/app/model_config.json"

#      ADMIN ACCESS
ADMIN_ACCESS_KEY = "309f5170edf6b9d407fee5b44e688681"