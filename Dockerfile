# Etapa 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir con nginx
FROM nginx:stable-alpine

# Copiamos el build generado al directorio por defecto de nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiamos una configuración básica de nginx (opcional pero recomendable)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Variables en tiempo de ejecución: al arrancar se genera env-config.js con las
# REACT_APP_* del `docker run --env-file ...` (como el .env del backend).
COPY docker/40-env-config.sh /docker-entrypoint.d/40-env-config.sh
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-env-config.sh \
    && chmod +x /docker-entrypoint.d/40-env-config.sh

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
