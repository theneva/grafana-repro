FROM node:alpine

COPY package.json yarn.lock index.js ./

RUN yarn install

EXPOSE 8080

CMD ["node", "index.js"]
