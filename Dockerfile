FROM node:16 as builder

WORKDIR /home/node/app
COPY . .
RUN npm ci
RUN npm run build
WORKDIR /home/node/app/common
RUN npm prune --production
WORKDIR /home/node/app/client
RUN rm -rf node_modules

FROM node:16
WORKDIR /home/node/app/
COPY --from=builder /home/node/app/ .

USER node
WORKDIR /home/node/app/server
#Node doesn't respond to signals like ctrl-C normally, but sh works better.
#Perhaps someday we can use tini instead.
CMD ["/bin/sh", "-c", "node src/index.js"]

EXPOSE 8080
