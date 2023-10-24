FROM node:alpine
WORKDIR /usr/src/app
COPY app.js .
COPY .env .
COPY package*.json .
RUN npm install
CMD ["node", "app.js"]
