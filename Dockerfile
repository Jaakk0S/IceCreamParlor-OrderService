FROM node:20.19.6-trixie-slim AS base
WORKDIR /app
COPY ./ ./






FROM base AS build

RUN npm ci --omit=dev
RUN npm i -D @types/node
RUN npm cache clean --force
RUN npm run build





FROM build AS production

# replace src and bin with those under dist
RUN rm -rf dist/test
RUN rm -rf src test bin
RUN mv dist/src ./src
RUN mv dist/bin ./bin

CMD ["npm","start"]
