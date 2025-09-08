SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
APP_DIR="$(realpath "$SCRIPT_DIR/../..")"
APP_CONTAINER_NAME="${APP_CONTAINER_NAME:-sumitomotool-front-node}"
NGINX_CONTAINER_NAME="${NGINX_CONTAINER_NAME:-sumitomotool-front-nginx}"
SHOULD_BUILD="${SHOULD_BUILD:-}"

if [ -z "$COMPOSE_FILE" ]; then
  echo "❌ ERROR: COMPOSE_FILE variable is not set."
  exit 1
fi

cd $APP_DIR

#echo "📥 Pulling latest code from Git..."
#git pull

if [ "$SHOULD_BUILD" = "true" ]; then
  echo "🚀 Build $APP_CONTAINER_NAME using docker-compose..."
  docker compose -f $COMPOSE_FILE build $APP_CONTAINER_NAME || {
      echo "❌ ERROR: Build failed"
      exit 1;
  }
  docker compose -f $COMPOSE_FILE up -d $APP_CONTAINER_NAME || {
      echo "❌ ERROR: Start failed"
      exit 1;
  }
else
  echo "🚀 Starting $APP_CONTAINER_NAME using docker-compose..."
  docker compose -f $COMPOSE_FILE up -d $APP_CONTAINER_NAME || {
      echo "❌ ERROR: Start failed"
      exit 1;
  }
fi

echo "✅ Deployment successful!"

check_services() {
  local name="$1"
  if ! docker ps --format '{{.Names}}' | grep -q "^$name$"; then
    echo "ℹ️  $name is not running. Starting it..."
    docker compose up -d "$name"
  else
    echo "✅ $name is already running."
  fi
}

check_services $NGINX_CONTAINER_NAME
