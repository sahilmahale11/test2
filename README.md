# EnviateApp Guide

This guide provides instructions for setting up and using EnviateApp with Docker and Make.

## Prerequisites

1. Install `make`:

   ```bash
      sudo apt install make -y
    ```
2. Install Docker and Docker Compose:
   ```bash
      Docker version: 24.0.2
      Docker Compose version: 1.29.2
    ```
3. Clone the EnviateApp repository from GitHub.

## Running Docker Commands
To interact with EnviateApp using Docker, use the following commands:

## Development
For development, run the following commands:

1. Build development Docker images:
    ```bash
       make dev-build
    ```

2. Run development containers using Docker Compose with the build command:
    ```bash
       make dev-up
    ```
    
3. Stop development containers:
    ```bash
       make dev-down
    ```

4. Restart development containers:
    ```bash
       make dev-restart
    ```
## Staging
For Staging, run the following commands:

1. Build Staging Docker images:
    ```bash
       make stage-build
    ```

2. Run Staging containers using Docker Compose with the build command:
    ```bash
       make stage-up
    ```
    
3. Stop Staging containers:
    ```bash
       make stage-down
    ```

4. Restart Staging containers:
    ```bash
       make stage-restart
    ```

## Production
For production, execute the following commands:
    
1. Build production Docker images:
   ```bash
      make prod-build
   ```

2. Run production containers using Docker Compose with the build command:
   ```bash
      make prod-up
   ```

3. Stop production containers:
   ```bash
      make prod-down
   ```

4. Restart production containers:
   ```bash
      make prod-restart
   ```

## Common
These are common commands you can use:

1. Clean command to remove unused Docker system resources:

   ```bash
      make clean
   ```
2. Deep clean command to remove all unused Docker system resources:
   ```bash
      make deep-clean
   ```
3. View running containers:
   ```bash
      make ps
   ```