from app.common import env_config
if env_config.settings.ENVIRONMENT == "Production":
    from app.common import constant_prod as constant
if env_config.settings.ENVIRONMENT == "Staging":
    from app.common import constant_stage as constant
elif env_config.settings.ENVIRONMENT == "Development":
    from app.common import constant_dev as constant