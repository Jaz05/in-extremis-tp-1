FROM bitnami/express:4.18.2
WORKDIR /app
COPY app.js package.json package-lock.json ./
ADD service/ service/
ADD constants/ constants/
RUN npm install
ENTRYPOINT [ "node", "app.js"]