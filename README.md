# Horrible Card Game

Cards Against Humanity clone, organized as a monorepo.

## Structure

```
apps/
  backend/   # Socket.io game server (Node.js + TypeScript + Bun)
  frontend/  # React web client (Vite + MUI + TypeScript)
```

## Requirements

- [Bun](https://bun.sh) (>= 1.x)

## Setup

From the repository root:

```sh
bun install
```

## Development

Run both the server and web client together:

```sh
bun run dev
```

Or run them separately in two terminals:

```sh
# Terminal 1 — game server (port 3000)
bun run dev:server

# Terminal 2 — web client (Vite dev server)
bun run dev:web
```

The web client connects to the server at `localhost:3000` (configurable via
`VITE_SOCKET_URL` in `apps/frontend/.env`).

## Build

```sh
bun run build
```

## Scripts

| Script | Description |
| --- | --- |
| `bun run dev` | Run backend + frontend together |
| `bun run dev:server` | Run the backend in watch mode |
| `bun run dev:web` | Run the frontend dev server |
| `bun run build:server` | Build the backend (`tsup`) |
| `bun run build:web` | Build the frontend (`vite`) |
| `bun run lint` | Lint the frontend |
