#!/bin/bash

set -e

# Define colors
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
CYAN="\033[1;36m"
RESET="\033[0m"

# Container and Image Details
FRONTEND_IMAGE="cms_frontend"
FRONTEND_CONTAINER="cms_frontend_container"
FRONTEND_PORT="4321"

BACKEND_IMAGE="cms_backend"
BACKEND_CONTAINER="cms_backend_container"
BACKEND_PORT="5000"

# Function to print a colored message
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${RESET}"
}

# Function to update a Docker service
update_service() {
    local image_name=$1
    local container_name=$2
    local port=$3

    print_message $CYAN "Updating service: $container_name"

    # Stop and remove the existing container if running
    if docker ps -a | grep -q $container_name; then
        print_message $YELLOW "Stopping container: $container_name"
        docker stop $container_name || true

        print_message $YELLOW "Removing container: $container_name"
        docker rm $container_name || true
    fi

    # Build the Docker image
    print_message $CYAN "Building image: $image_name"
    docker build -t $image_name .

    # Start the updated container
    print_message $GREEN "Starting new container: $container_name"
    docker run -d --name $container_name -p $port:$port $image_name

    print_message $GREEN "$container_name updated successfully!"
}

# Main script execution
print_message $CYAN "Starting the update process..."

# Update Frontend Service
print_message $CYAN "Updating frontend..."
(cd ./ && update_service $FRONTEND_IMAGE $FRONTEND_CONTAINER $FRONTEND_PORT)

# Run the specific frontend container with the given name and port
print_message $GREEN "Running frontend container with specified parameters..."
docker run -d -p 4321:4321 --name cms_frontend cms_frontend

# Update Backend Service
print_message $CYAN "Updating backend..."
(cd ./backend && update_service $BACKEND_IMAGE $BACKEND_CONTAINER $BACKEND_PORT)

# Run the specific backend container with the given name and port
print_message $GREEN "Running backend container with specified parameters..."
docker run -d -p 5000:5000 --name cms_backend cms_backend

print_message $GREEN "All services updated successfully!"
