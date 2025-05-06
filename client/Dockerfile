FROM node:20-alpine AS build

# Set absolute WORKDIR path
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Vite port
EXPOSE 5173

# Run Vite with host flag to allow access from outside
CMD ["npm", "run", "dev", "--", "--host"]
