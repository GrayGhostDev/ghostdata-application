# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production  # Install production dependencies only

COPY . .
RUN npm run build

# Stage 2: Serve the built application
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
# Copy your nginx config (if you have one) to the container.
# For example:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
