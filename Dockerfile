# ETAPA 1: Construir la aplicación
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias e instalarlas
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Ejecutar el build de Vite
RUN npm run build

# ETAPA 2: Servir la aplicación
FROM node:18-alpine

WORKDIR /app

# Copiar solo las dependencias de producción
COPY package*.json ./
RUN npm install --omit=dev

# Copiar la carpeta 'dist' compilada desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Copiar nuestro servidor web
COPY server.js .

# Exponer el puerto que Cloud Run necesita
EXPOSE 8080

# El comando para iniciar el servidor
CMD [ "npm", "start" ]