FROM node:14.17.6-alpine3.13@sha256:fd25bbf86ec9d4800b77d5a625a8d952e7fd928f71bedf10b9db001ac5857b2c
RUN apk add dumb-init
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm install 
USER node

CMD ["dumb-init", "npm", "start"]
