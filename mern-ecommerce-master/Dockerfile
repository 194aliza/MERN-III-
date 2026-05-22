FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install backend dependencies
RUN npm install

# Build frontend
RUN npm run build

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

USER nodejs

# Expose backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Proper signal handling
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Start server
CMD ["npm", "start"]