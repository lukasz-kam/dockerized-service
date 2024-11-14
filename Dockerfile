FROM node:20.18.0-alpine3.19

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY node-app/package*.json ./

RUN chown -R node:node ./package*.json

USER node

RUN npm install

COPY --chown=node:node node-app/ .

EXPOSE 8080

CMD [ "node", "server.js" ]