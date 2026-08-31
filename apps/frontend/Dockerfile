FROM node:24-alpine AS build
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

FROM node:24-alpine
WORKDIR /app

COPY --from=build /app/apps/frontend/dist ./dist
COPY apps/frontend/serve.mjs ./serve.mjs

EXPOSE 80

CMD ["node", "serve.mjs"]
