FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .


FROM node:20-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080

ENV NODE_ENV=production
ENV LOANDISK_API_KEY=$LOANDISK_API_KEY
ENV LOANDISK_API_ENDPOINT=$LOANDISK_API_ENDPOINT

# Start the backend server
CMD ["node", "index.js"]
