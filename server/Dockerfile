# Use an official Node runtime as a parent image
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose port 8080
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV LOANDISK_API_KEY=$LOANDISK_API_KEY
ENV LOANDISK_API_ENDPOINT=$LOANDISK_API_ENDPOINT

# Start the backend server
CMD ["npm", "start"]
