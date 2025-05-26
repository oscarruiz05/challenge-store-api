FROM node:lts-alpine3.21

WORKDIR /app
RUN apk update && apk add bash nano curl htop
COPY ./package*.json ./

RUN npm install
COPY . .
COPY ./example.env ./.env
RUN npm run build

RUN rm /app/Dockerfile /app/docker-compose.yml /app/.dockerignore
EXPOSE 3000
CMD npm run start:prod
