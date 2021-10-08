FROM node:lts-alpine
RUN apk add dumb-init
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm install 
USER node
CMD ["dumb-init", "npm", "start"]