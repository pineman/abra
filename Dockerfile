FROM docker.io/node:16.3.0-slim AS builder
WORKDIR /abra
COPY package*.json ./
RUN npm ci
COPY client client
RUN npm run build

FROM docker.io/node:16.3.0-slim
EXPOSE 2272
WORKDIR /abra
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci
COPY main.js .
COPY server server
COPY --from=builder /abra/client/bundle client/bundle
CMD ["node", "main.js", "deploy"]
