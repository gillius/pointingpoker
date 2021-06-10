FROM node:16

WORKDIR /home/node/app
COPY . .
RUN npm ci
RUN npm run build

USER node
WORKDIR /home/node/app/server
CMD ["node", "src/index.js"]

EXPOSE 8080

