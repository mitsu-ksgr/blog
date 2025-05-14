FROM node:23-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn run make-catalogs

#USER node
EXPOSE 3000
CMD ["/bin/bash", "./docker-entrypoint.sh"]

