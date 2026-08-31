FROM node:24-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json

RUN npm install -g bun
RUN bun install --frozen-lockfile --filter @horrible-card-game/server

COPY apps/backend apps/backend

RUN cd apps/backend && bun run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/server.js"]
