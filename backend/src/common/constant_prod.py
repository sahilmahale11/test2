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
GITHUB_CLIENT_ID = "71bdc0d0b108c7aec0e8"
GITHUB_CLIENT_SECRET = "dd0777863fc8b56d7bd79e28f1d01dcfa765ae2f"
GITHUB_REDIRECT_URI = "https://theoversight.ai/oauth"
GITHUB_ACCESS_TOKEN_EXPIRE_HOURS = 8

#      JIRA_APP_KEYS
JIRA_CLIENT_ID = "YPlL2PoorJQinc1dIuYNZWqSQ2JS7Wql"
JIRA_CLIENT_SECRET = "ATOA_jQn9lL6dCBg9zjUNk76JuVXQ86YgZ7btBvhUS2MXG728VcjjO4FUkJDgo6DfaKLC6779C00"
JIRA_REDIRECT_URI = "https://theoversight.ai/auth"
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
QDRANT_CLOUD_API_KEY = "KGqj_uKEQmakhnHeahjNiRDV5Wlt5vwDXZaI0lFByR9yK6aOT6IK3A"
QDRANT_CLOUD_PATH = "https://cb6d5363-6243-4456-8bae-6667e0a7e31a.us-east-1-0.aws.cloud.qdrant.io:6333"

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