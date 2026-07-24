#!/bin/bash
ROOT=$(cd "$(dirname "$0")/.." && pwd)
DEST="$ROOT/backups"
mkdir -p "$DEST"
cp "$ROOT/backend/data.sqlite" "$DEST/data-$(date +%F-%H%M).sqlite"
echo "Backup created in $DEST"
