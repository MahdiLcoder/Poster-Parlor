#!/bin/sh
set -e

# Generate production.env from container environment variables if present
if [ -f "./scripts/generate-env.sh" ]; then
  sh ./scripts/generate-env.sh
fi

exec "$@"