FROM node:22-bullseye-slim

USER root

ARG USER_ID=1000
ARG GROUP_ID=1000
ARG APP_USER=www-data

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

RUN export EDITOR="/usr/bin/nano"

USER ${APP_USER}

EXPOSE 3000

WORKDIR /app

ENTRYPOINT ["tail", "-f", "/dev/null"]
