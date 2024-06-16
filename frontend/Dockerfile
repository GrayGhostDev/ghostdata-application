# Use an official Node.js runtime as a parent image
FROM node:22-slim

# Set the working directory in the container
WORKDIR /app

# Install Python and build-essential, then remove cache
RUN apt-get update && \
    apt-get install -y python3 g++ make && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Command to run the application
CMD ["npm", "start"]
