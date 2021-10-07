FROM node:lts-alpine@sha256:96bbc87132d5d6b3d8b5cad758ebae5d30bd75bbd8cdc5cd756fb6b0d500f153
RUN apk add dumb-init
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm install 
USER node
CMD ["dumb-init", "node", "index.js"]