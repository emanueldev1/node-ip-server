# Utiliza una imagen base oficial de Node.js
FROM node:14

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Instala OpenSSL para generar certificados
RUN apt-get update && apt-get install -y openssl

# Genera certificados SSL auto-firmados
ARG HOST
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem -subj "/CN=$HOST"

# Expon el puerto que la aplicación utilizará
EXPOSE 3122

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]
