# Pulling and Running a Docker Image

## Prerequisites
- Docker installed on your machine
- Docker Hub account

## Steps to Pull and Run a Docker Image

docker buildx build --platform linux/amd64,linux/arm64 -t khoituanphan/aris_platform:1.3 --push .

docker buildx build --platform linux/amd64 -t khoituanphan/aris_platform:1.5 --push .
### 1. Pull the Docker Image

To pull a specific version of a Docker image from Docker Hub, use the following command:

```sh
docker pull your_dockerhub_username/your_image_name:tag
```
#### example 
```sh
docker pull khoituanphan/aris_platform:1.2
```
### 2. Choose the Version to Pull
If the Docker image supports multiple architectures (e.g., amd64 and arm64), you can specify the platform when pulling the image:
```sh
docker pull --platform amd64 khoituanphan/aris_platform:1.5
```

### 3. Run the Docker Container
To run the Docker container from the pulled image, use the following command:
```sh
docker run -d -p 3000:3000 --name aris_platform khoituanphan/aris_platform:[Version]
```
### 4. Verify the Container is Running
To verify that the container is running, use the following command:

```sh
docker ps
```
You should see the container listed with the name aris_platform.

### 5. Access the Application
If your application is running on port 3000 inside the container, you can access it via http://localhost:3000 in your web browser.
docker buildx build --platform linux/amd64,linux/arm64 -t khoituanphan/aris_platform:1.2 --push .

### 6. Stop and Remove the Container
To stop the running container, use the following command:

```sh
docker stop aris_platform
```
To remove the container, use the following command:

```sh
docker rm aris_platform
```
### Document 2: Installing, Verifying Buildx, Building Multi-Platform Images, and Uploading to Docker Hub
