FROM node:22-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/backend/package.json apps/backend/package.json

RUN npm install -g bun
RUN bun install --frozen-lockfile --filter @horrible-card-game/web

COPY apps/frontend apps/frontend

ARG VITE_SOCKET_URL
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

RUN cd apps/frontend && bun run build

FROM nginx:alpine

COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
