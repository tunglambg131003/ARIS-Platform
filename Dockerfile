FROM node:16


# Set working directory
WORKDIR /app

# Install necessary libraries for Canvas and other dependencies
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    build-essential \
    pkg-config

# Set environment variables
ENV YARN_VERSION=1.22.19
ENV NODE_OPTIONS=--max_old_space_size=64096
ENV PORT=3000
ENV NODE_ENV=production

# Copy package.json and yarn.lock into the correct directory
COPY package.json yarn.lock ./

# Check if Yarn is installed and skip installation if it is
RUN if ! which yarn; then npm install -g yarn; fi

# Set yarn network timeout (optional, based on your history)
RUN yarn config set network-timeout 36000000 -g


# Install dependencies
RUN yarn install -g

# Copy the entire application folder into the container
COPY . .

# Lint the project (optional, based on your history)
RUN yarn run lint

# Update browserslist database (optional, based on your history)
#RUN npx browserslist@latest --update-db

# Build the project
RUN yarn build

# Inform Docker that the container listens on port 3000
EXPOSE 3000

# Set the command to run the application
CMD ["yarn", "start"]