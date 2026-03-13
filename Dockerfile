ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

USER root

EXPOSE 3000

CMD ["npm","run","dev"]



