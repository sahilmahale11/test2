# Prerequisites: pip install datamodel-code-generator==0.13.5
# Usage Example - ./scripts/generate-models.sh openapi/onboarding.yaml src/onboardingservice/app/schema.py
#                 ./scripts/generate-models.sh openapi/code_processing.yaml src/embeddingservice/app/schema.py
#                 ./scripts/generate-models.sh openapi/human_inloop.yaml src/humaninloopservice/app/schema.py
#                 ./scripts/generate-models.sh openapi/dashboard.yaml src/dashboardservice/app/schema.py
#                 ./scripts/generate-models.sh openapi/notification.yaml src/notificationmanagerservice/app/schema.py
#                 ./scripts/generate-models.sh openapi/webhook.yaml src/webhookservice/app/schema.py
#                 ./scripts/generate-models.sh openapi/task_manager.yaml src/taskmanagerservice/app/schema.py

datamodel-codegen --input-file-type openapi --input $1 --output $2
