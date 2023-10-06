import json
import sys
from pathlib import Path
from loguru import logger
from app.common.env_config import settings


class CustomizeLogger:
    @classmethod
    def make_logger(cls, config_path: Path, log_type: str):
        config = cls.load_logging_config(config_path)
        logging_config = config.get(log_type)

        logger = cls.customize_logging(
            logging_config.get("api_access_path"),
            api_error_path=logging_config.get("api_error_path"),
            retention=int(logging_config.get("retention")),
            rotation=logging_config.get("rotation"),
            format=logging_config.get("format"),
            api_name=logging_config.get("api_name"),
            error_filter=logging_config.get("error_filter"),
        )
        return logger

    @classmethod
    def customize_logging(
        cls,
        api_access_path: Path,
        api_error_path: str,
        rotation: str,
        retention: int,
        format: str,
        api_name: str,
        error_filter: str,
    ):

        logger.remove()
        logger.add(sys.stdout, enqueue=True, backtrace=True, format=format)
        logger.add(
            str(api_access_path),
            rotation=rotation,
            retention=retention,
            enqueue=True,
            backtrace=True,
            format=format,
            filter=lambda record: record["extra"].get("logname") == api_name and record["level"].name in settings.LOG_LEVELS,
        )
        logger.add(
            str(api_error_path),
            rotation=rotation,
            retention=retention,
            enqueue=True,
            backtrace=True,
            format=format,
            filter=lambda record: record["level"].name == "ERROR" and record["extra"].get("logname") == api_name,
        )

        return logger.bind(method=None)

    @classmethod
    def load_logging_config(cls, config_path):
        config = None
        with open(config_path) as config_file:
            config = json.load(config_file)
        return config
