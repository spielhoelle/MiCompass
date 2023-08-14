FROM node:14.15.0-alpine

WORKDIR /home/app/client

ENV PATH /home/app/client/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000