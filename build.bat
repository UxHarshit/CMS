@echo off
setlocal enabledelayedexpansion

:: Load environment variables from .env file
for /f "tokens=1,* delims==" %%A in (.env) do (
    if not "%%A"=="" (
        set "%%A=%%B"
    )
)

:: Build the Docker image with build args
docker build ^
    --build-arg REACT_APP_BASE_URL=%REACT_APP_BASE_URL% ^
    --build-arg IPINFO_TOKEN=%IPINFO_TOKEN% ^
    -t cms_frontend .
