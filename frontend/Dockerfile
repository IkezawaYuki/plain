FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install a simple static file server
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Serve the built files on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]