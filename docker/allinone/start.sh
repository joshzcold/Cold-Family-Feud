#!/usr/bin/env bash
set -o pipefail
set -e

FAMF_STORE=${FAMF_STORE:-memory}

cd /app

npm run build
./Cold-Friendly-Feud --game_store "$FAMF_STORE" &
nginx -g 'daemon off;' &
npm run start &

wait -n
