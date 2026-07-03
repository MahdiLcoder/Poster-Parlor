#!/bin/bash

# Script to generate production.env file from environment variables
# This script is intended to be run during the Render build process

ENV_DIR="libs/config/src/env"
ENV_FILE="$ENV_DIR/production.env"

# Create the directory if it doesn't exist
mkdir -p "$ENV_DIR"

# Generate the production.env file
cat > "$ENV_FILE" << EOF
NODE_ENV=${NODE_ENV:-production}
PORT=${PORT:-3000}
ALLOWED_ORIGINS=${ALLOWED_ORIGINS:-}

# Database configuration
DB_NAME=${DB_NAME:-}
DB_URL=${DB_URL:-}
POOL_SIZE=${POOL_SIZE:-10}

# Google OAuth configuration
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID:-}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET:-}
GOOGLE_CALLBACK_URL=${GOOGLE_CALLBACK_URL:-}

# JWT configuration
JWT_ACCESS_TOKEN_SECRET=${JWT_ACCESS_TOKEN_SECRET:-}
JWT_ACCESS_TOKEN_EXPIRES_IN=${JWT_ACCESS_TOKEN_EXPIRES_IN:-}
JWT_REFRESH_TOKEN_SECRET=${JWT_REFRESH_TOKEN_SECRET:-}
JWT_REFRESH_TOKEN_EXPIRES_IN=${JWT_REFRESH_TOKEN_EXPIRES_IN:-}

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME:-}
CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY:-}
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET:-}

# Razorpay configuration
RAZORPAY_API_KEY=${RAZORPAY_API_KEY:-}
RAZORPAY_API_SECRET=${RAZORPAY_API_SECRET:-}
EOF

echo "✅ Generated $ENV_FILE successfully"
