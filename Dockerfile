# Use a lightweight Node.js image for better performance
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy dependency files first (Leveraging Docker cache for faster builds)
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client (Using a dummy URL to bypass build-time environment checks)
RUN DATABASE_URL="postgresql://fake:fake@localhost:5432/fake" npx prisma generate

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]