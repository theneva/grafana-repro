FROM node:alpine

COPY package.json yarn.lock index.js doge.png ./

RUN yarn install

EXPOSE 8081

CMD ["node", "index.js"]
