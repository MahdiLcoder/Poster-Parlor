# ----------------------------------------------------
# Stage 1: Build stage
# ----------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy full backend source so npm workspaces (apps/*, libs/*) are present
COPY . .

# Install all dependencies (with network retry resilience)
RUN npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

# Build the NestJS API application via Nx
ENV NODE_ENV=production
RUN npx nx build api

# Prune development dependencies to keep production footprint minimal
RUN npm prune --omit=dev && npm cache clean --force

# ----------------------------------------------------
# Stage 2: Production runtime stage
# ----------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy node_modules with production dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy compiled artifacts from builder stage
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copy scripts and env template directory required by ConfigModule
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/libs/config/src/env ./libs/config/src/env
COPY docker-entrypoint.sh ./

# Set execute permissions and ownership for node user
RUN chmod +x docker-entrypoint.sh ./scripts/generate-env.sh && \
    chown -R node:node /app

USER node

# Default backend port (mapped in docker-compose)
EXPOSE 5000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "apps/api/dist/main.js"]