FROM python:3.9
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app/app
COPY datamodeler/ /app/app
RUN pip install --upgrade pip && pip install -r requirements.txt
ENV PYTHONPATH=/app
COPY common/ /app/app/common