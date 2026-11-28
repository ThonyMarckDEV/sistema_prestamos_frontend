#!/bin/sh
# Genera /usr/share/nginx/html/env-config.js con las variables REACT_APP_* que
# recibe el contenedor (docker run --env-file ...). Lo ejecuta automáticamente
# el entrypoint de nginx (/docker-entrypoint.d) antes de levantar el servidor.
set -e

OUT=/usr/share/nginx/html/env-config.js

{
  printf 'window._env_ = {\n'
  env | grep '^REACT_APP_' | while IFS='=' read -r key value; do
    # --env-file no quita comillas: se las quitamos y escapamos para JS
    value=$(printf '%s' "$value" | tr -d '\r' | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'\$//" -e 's/\\/\\\\/g' -e 's/"/\\"/g')
    printf '  "%s": "%s",\n' "$key" "$value"
  done
  printf '};\n'
} > "$OUT"

echo "env-config.js generado con: $(env | grep -c '^REACT_APP_') variable(s) REACT_APP_*"
