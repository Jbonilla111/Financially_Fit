FROM alpine:3.20

# Install latest Node.js and npm directly from Alpine repositories to avoid vulnerable official node images
RUN apk update && apk upgrade && apk add --no-cache nodejs npm

# Set working directory
WORKDIR /app

# Use Node environment variable
ENV NODE_ENV=development

# Create node user/group since plain alpine base doesn't have it
RUN addgroup -S node && adduser -S node -G node

# Copy package files layer first
COPY package*.json ./

# Install dependencies and clean cache
RUN npm install && npm cache clean --force

# Copy application source
COPY . .

# Change ownership
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose port and start
EXPOSE 3000
CMD ["npm", "start"]
