FROM node:24.16.0-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json

RUN npm ci --workspace @horrible-card-game/server --include-workspace-root=false

COPY apps/backend apps/backend

RUN npm run build --workspace @horrible-card-game/server

FROM node:24.16.0-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json

RUN npm ci --omit=dev --workspace @horrible-card-game/server --include-workspace-root=false \
  && npm cache clean --force

COPY --from=build --chown=node:node /app/apps/backend/dist ./dist

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(() => process.exit(0)).catch(() => process.exit(1))"

CMD ["node", "dist/server.js"]
