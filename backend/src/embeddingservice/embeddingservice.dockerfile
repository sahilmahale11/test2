FROM python:3.9
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app/
RUN apt-get update && apt-get install curl nano iputils-ping libpq-dev awscli -y
COPY embeddingservice/ /app
RUN pip install -r requirements.txt
COPY common/ /app/app/common
ENV PYTHONPATH=/app
EXPOSE 80
RUN chmod -R 777 /app/app/common
#  ENTRYPOINT ["tail", "-f", "/dev/null"]