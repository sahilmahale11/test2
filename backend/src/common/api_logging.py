from pathlib import Path
from starlette.requests import Request
from app.common.custom_logging import CustomizeLogger


def create_log(log_type: str):
    config_path = Path(__file__).with_name("logging_conf.json")
    custom_logger = CustomizeLogger.make_logger(config_path, log_type)
    return custom_logger


log = create_log("logger")
logger = log.bind(logname="api")


async def logging_dependency(request: Request):
    logger.debug(f"{request.method} {request.url}")
    logger.debug("Params:")
    for name, value in request.path_params.items():
        logger.debug(f"{name}: {value}")
    logger.debug("Headers:")
    for name, value in request.headers.items():
        logger.debug(f"\t{name}: {value}")
