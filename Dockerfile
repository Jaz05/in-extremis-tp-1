FROM node:lts-alpine

WORKDIR /usr/app

COPY /app/package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "app/app.js" ]