FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Accept build-time environment variable
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# Copy source code (after setting ENV)
COPY . .

# Build the application
RUN npm run build

# Install a simple static file server
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Serve the built files on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]