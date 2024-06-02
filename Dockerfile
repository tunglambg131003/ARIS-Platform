FROM node:16

# Install necessary libraries for Canvas
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    build-essential \
    pkg-config

WORKDIR /app/app

# Copy package.json and yarn.lock into the correct directory
COPY package.json yarn.lock ./

# Check if Yarn is installed and skip installation if it is
RUN if ! which yarn; then npm install -g yarn; fi

# Use Yarn to install dependencies
RUN yarn install

# Copy the entire application folder into the container
COPY . .

# Set the localhost port for testing
ENV PORT=3000

# Inform Docker that the container listens on port 3000
EXPOSE 3000

CMD [ "yarn", "dev" ]