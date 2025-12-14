FROM alpine:latest AS base

RUN apk add --no-cache nodejs curl && apk add --no-cache npm && rm -rf /var/cache/apk/*

WORKDIR /app
COPY ./ ./






FROM base AS build

RUN npm ci --omit=dev
RUN npm i -D @types/node
RUN npm cache clean --force
RUN npm run build





FROM build AS production

RUN rm -rf dist/test
RUN rm -rf src test bin

CMD ["npm","start"]
