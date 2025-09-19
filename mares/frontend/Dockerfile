
# Stage 1: Build the React application
# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application using Nginx
# Use a lightweight Nginx image
FROM nginx:stable-alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 to the outside world
# Cloud Run expects the container to listen on the port defined by the PORT environment variable.
# Nginx's default port is 80, but we'll configure it to listen on 8080 as is common practice.
EXPOSE 8080

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
