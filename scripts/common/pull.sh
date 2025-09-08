SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
APP_DIR="$(realpath "$SCRIPT_DIR/../..")"

cd $APP_DIR

echo "📥 Pulling latest code from Git..."
git pull
