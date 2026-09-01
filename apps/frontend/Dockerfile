FROM node:24.16.0-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/backend/package.json apps/backend/package.json

RUN npm ci --workspace @horrible-card-game/web --include-workspace-root=false

COPY apps/frontend apps/frontend

ARG VITE_SOCKET_URL
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

RUN npm run build --workspace @horrible-card-game/web

FROM node:24.16.0-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build --chown=node:node /app/apps/frontend/dist ./dist
COPY --chown=node:node apps/frontend/serve.mjs ./serve.mjs

USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/').then(() => process.exit(0)).catch(() => process.exit(1))"

CMD ["node", "serve.mjs"]
