FROM node:22-bullseye-slim AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apt-get update && apt-get install -y libc6 libc6-dev
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ARG USER_ID=1000
ARG GROUP_ID=1000
ARG APP_USER=www-data
ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN set -eux; \
    EXISTING_USER=$(getent passwd "$USER_ID" | cut -d: -f1 || true); \
    EXISTING_GROUP=$(getent group "$GROUP_ID" | cut -d: -f1 || true); \
    if [ -n "$EXISTING_USER" ]; then \
        echo "User with UID $USER_ID already exists: $EXISTING_USER. Renaming to $APP_USER."; \
        usermod -l "$APP_USER" "$EXISTING_USER" || true; \
    else \
        if [ -z "$EXISTING_GROUP" ]; then \
            groupadd -g "$GROUP_ID" "$APP_USER"; \
        fi; \
        useradd -m -u "$USER_ID" -g "$GROUP_ID" -s /bin/bash "$APP_USER"; \
    fi; \
    mkdir -p /home/"$APP_USER" /app; \
    chown -R "$APP_USER:$GROUP_ID" /home/"$APP_USER" /app

RUN apt-get update  \
    && apt-get upgrade -y  \
    && apt-get install -y --no-install-recommends \
        xdg-utils git zip unzip nano curl ca-certificates \
    && npm update -g \
    && rm -rf /var/lib/apt/lists/*


COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=$USER_ID:$GROUP_ID /app/.next/standalone ./
COPY --from=builder --chown=$USER_ID:$GROUP_ID /app/.next/static ./.next/static

USER ${APP_USER}

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
