#!/bin/sh

export APP_CONTAINER_NAME="sumitomotool-front-node"
export COMPOSE_FILE="docker-compose.live.yml"
export SHOULD_BUILD=true

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
sh "$SCRIPT_DIR/../common/pull.sh"
sh "$SCRIPT_DIR/../common/deploy.sh"

