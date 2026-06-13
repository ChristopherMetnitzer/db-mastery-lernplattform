#!/usr/bin/env bash
# DB Mastery - Starter für Linux / macOS
# Startet einen lokalen Webserver und öffnet die Lernplattform im Browser.
# (Nötig, weil die App ihre Inhalte per fetch() lädt - file:// wird vom Browser blockiert.)

set -e
cd "$(dirname "$0")"

PORT=8765
URL="http://localhost:$PORT/index.html"

# Python finden (python3 bevorzugt, sonst python)
if command -v python3 >/dev/null 2>&1; then
    PY=python3
elif command -v python >/dev/null 2>&1; then
    PY=python
else
    echo "FEHLER: Python ist nicht installiert. Bitte Python 3 installieren: https://www.python.org/downloads/"
    exit 1
fi

echo "Starte DB Mastery auf $URL"
echo "Zum Beenden: dieses Fenster schließen oder Strg+C drücken."

# Browser öffnen (im Hintergrund, kurz warten bis der Server läuft)
( sleep 1
  if command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL"
  elif command -v open >/dev/null 2>&1; then open "$URL"
  fi
) >/dev/null 2>&1 &

# Server im Vordergrund (blockiert, bis beendet)
exec "$PY" -m http.server "$PORT"
