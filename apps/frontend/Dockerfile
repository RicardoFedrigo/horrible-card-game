FROM node:26-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/backend/package.json apps/backend/package.json

RUN npm ci --workspace @horrible-card-game/web --include-workspace-root=false

COPY apps/frontend apps/frontend

ARG VITE_SOCKET_URL
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

RUN npm run build --workspace @horrible-card-game/web

FROM node:26-alpine
WORKDIR /app

COPY --from=build /app/apps/frontend/dist ./dist
COPY apps/frontend/serve.mjs ./serve.mjs

EXPOSE 80

CMD ["node", "serve.mjs"]
