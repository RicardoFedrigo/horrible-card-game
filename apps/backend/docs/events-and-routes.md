# Events and Routes Documentation

This document describes the Socket.IO events and HTTP routes in the Cards Against Humanity game server.

## Table of Contents

1. [Socket.IO Events](#socketio-events)
   - [Client → Server Events](#client--server-events)
   - [Server → Client Events](#server--client-events)
   - [TypeScript Interfaces](#typescript-interfaces)
2. [HTTP Routes](#http-routes)
3. [Room State & Events](#room-state--events)
4. [Game Flow](#game-flow)

---

## Socket.IO Events

### TypeScript Interfaces

Defined in `src/events/events.ts`:

```typescript
export interface ClientToServerEvents {
  'room:create': (payload: { name: string }) => void;
  'room:join': (payload: { roomId: string; name: string }) => void;
  'game:start': () => void;
}

export interface ServerToClientEvents {
  'room:created': (payload: { roomId: string }) => void;
  'room:updated': (payload: unknown) => void;
  error: (message: string) => void;
}
```

---

### Client → Server Events (Socket Handlers in `src/server.ts`)

| Event | Payload | Description | Handler Location |
|-------|---------|-------------|------------------|
| `create-room` | `{ codeRoom, adminName, numberOfrounds, maxPlayers, password? }` | Create a new game room | `server.ts:36` |
| `join-room` | `{ codeRoom, name, playerId?, password? }` | Join an existing room | `server.ts:62` |
| `configure-room` | `{ roomCode, numberOfrounds, maxPlayers, password? }` | Configure room settings (admin only) | `server.ts:94` |
| `playerReady` | `roomCode: string` | Toggle player ready status | `server.ts:121` |
| `startGame` | `roomCode: string` | Start the game (admin only) | `server.ts:141` |
| `submitCards` | `roomCode: string, cardIds: string[]` | Submit white cards for current round | `server.ts:162` |
| `selectWinner` | `roomCode: string, winnerPlayerId: string` | Card Czar selects winning submission | `server.ts:186` |
| `leaveRoom` | `roomCode: string` | Leave the current room | `server.ts:251` |
| `error` | `error: Error` | Socket error handling | `server.ts:269` |
| `disconnect` | - | Handle player disconnect | `server.ts:274` |

---

### Server → Client Events (Emitted from Server)

| Event | Payload | Description | Emitted From |
|-------|---------|-------------|--------------|
| `room-created` | `{ room: RoomView, playerId: string }` | Room created successfully | `server.ts:44` |
| `roomJoined` | `{ room: RoomView, playerId: string }` | Player joined room | `server.ts:78` |
| `room` | `{ room: RoomView, playerId: string }` | Room state sync | `server.ts:49, 74` |
| `roomUpdated` | `RoomView` | Full room state update | `server.ts:84, 111, 131, 151, 172, 202, 236, 262, 284` |
| `playerReadyChanged` | `playerId: string, isReady: boolean` | Player ready status changed | `server.ts:130` |
| `gameStarted` | `RoomView` | Game started successfully | `server.ts:150` |
| `newRound` | `{ room: RoomView }` | New round started | `server.ts:152, 234` |
| `allCardsSubmitted` | `SubmittedCard[]` | All players submitted cards | `server.ts:175` |
| `cardsSubmitted` | `playerId: string` | Player submitted cards | `server.ts:171` |
| `voteSubmitted` | `{ voterPlayerId, votedForPlayerId }` | Vote cast | `server.ts:198` |
| `winnerSelected` | `winnerIds[], winningCards[][]` | Card Czar selected winner | `server.ts:209` |
| `gameEnded` | `{ id, name, status, score, cardsInHand, isAdmin }` | Game ended with winner | `server.ts:223` |
| `playerLeft` | `playerId: string` | Player left room | `server.ts:259, 281` |
| `error` | `{ message: string }` | Error notification | Various error handlers |

---

### Required Socket Events (from `prompts/requirements/REQUIRED_SOCKET_EVENTS.md`)

#### Client → Server (Expected by Frontend)
- `create-room`: `{ codeRoom, adminName, numberOfrounds, maxPlayers, password? }`
- `join-room`: `{ codeRoom, name, playerId?, password? }`
- `configure-room`: `{ roomCode, numberOfrounds, maxPlayers, password? }`
- `playerReady`: `roomCode`
- `startGame`: `roomCode`
- `submitCards`: `roomCode, cardIds[]`
- `selectWinner`: `roomCode, winnerPlayerId`
- `leaveRoom`: `roomCode`

#### Server → Client (Expected by Frontend)
- `room`: `{ room, playerId? }` - after create/join or initial sync
- `room-created`: `{ room, playerId? }` - after room creation
- `roomJoined`: `{ room, playerId? }` - after joining
- `roomUpdated`: `room` - state changes
- `playerLeft`: `playerId`
- `playerReadyChanged`: `playerId, isReady`
- `gameStarted`: `room`
- `newRound`: `{ room }` or `{ blackCard, cardCzarId, hand, round }`
- `allCardsSubmitted`: `{ playerId, cards[] }[]`
- `winnerSelected`: `winnerIds[], winningCards[][]`
- `gameEnded`: `winner`
- `error`: `message`

#### Required Room Shape
```typescript
{
  codeRoom: string;
  players: PlayerView[];
  started: boolean;
  gamePhase: 'waiting' | 'playing' | 'judging' | 'results' | 'ended';
  currentRound: number;
  currentBlackCard: Card | null;
  cardCzarId: string | null;
  submittedCards: { playerId: string; cards: Card[] }[];
  configGame: ConfigRoom;
}
```

---

## HTTP Routes

Currently, the server only exposes Socket.IO connections. No REST API routes are defined in `src/server.ts`. The server runs on port 3000 with:
- Express with CORS enabled
- JSON body parsing
- Socket.IO server with CORS origin `*`

---

## Room State & Events

### Room State (`src/app/room/models/room.ts`)

```typescript
interface RoomState {
  codeRoom: string;
  players: Player[];
  started: boolean;
  password?: string;
  configGame: ConfigRoom;
  
  // Game state (matches REQUIRED_SOCKET_EVENTS.md)
  gamePhase: 'waiting' | 'playing' | 'judging' | 'results' | 'ended';
  currentRound: number;
  currentBlackCard: Card | null;
  cardCzarId: string | null;
  submittedCards: { playerId: string; cards: Card[] }[];
  votes: { voterPlayerId: string; votedForPlayerId: string }[];
  winningPlayerId: string | null;
}
```

### Room Presenter Output (`src/app/room/services/room-presenter.service.ts`)

```typescript
interface RoomView {
  codeRoom: string;
  players: PlayerView[];
  started: boolean;
  gamePhase: string;
  currentRound: number;
  currentBlackCard: Card | null;
  cardCzarId: string | null;
  submittedCards: { playerId: string; cards: Card[] }[];
  votes: { voterPlayerId: string; votedForPlayerId: string }[];
  winningPlayerId: string | null;
  configGame: ConfigRoom;
}

interface PlayerView {
  id: string;
  name: string;
  status: string;
  score: number;
  cardsInHand: Card[];
  isAdmin: boolean;
  isReady: boolean;
}
```

---

## Game Flow

### Phase Transitions

```
WAITING (lobby) 
    │
    ├─ create-room → roomCreated, room
    ├─ join-room → roomJoined, room
    ├─ configure-room → roomUpdated
    ├─ playerReady → playerReadyChanged, roomUpdated
    └─ startGame (admin, all ready) → gameStarted, newRound, roomUpdated
                    │
                    ▼
PLAYING (submitting cards)
    │
    ├─ submitCards → cardsSubmitted, roomUpdated
    │   └─ All submitted → allCardsSubmitted
    │
    ▼
JUDGING (Card Czar selects winner)
    │
    ├─ selectWinner → voteSubmitted, roomUpdated
    │   └─ All voted → winnerSelected
    │
    ▼
RESULTS (show winner)
    │
    ├─ Auto-advance after ROUND_TIME_MS (5s) → nextRound or gameEnded
    │
    ▼
ENDED (game over)
    │
    └─ gameEnded
```

### Round Timeout
- Configurable via `ROUND_TIME_SECONDS` env var (default: 60 seconds)
- Auto-advances from `playing` → `judging` phase on timeout

### Card Czar Rotation
- First round: random player
- Subsequent rounds: `(currentRound - 1) % players.length` rotation

### Card Dealing
- 7 white cards dealt to each player at game start
- Hands refilled to 7 cards at start of each new round

---

## Socket.IO Connection Flow

```
Client Connection
       │
       ▼
io.on('connection', (socket) => { ... })
       │
       ├─► socket.on('create-room', ...)
       ├─► socket.on('join-room', ...)
       ├─► socket.on('configure-room', ...)
       ├─► socket.on('playerReady', ...)
       ├─► socket.on('startGame', ...)
       ├─► socket.on('submitCards', ...)
       ├─► socket.on('selectWinner', ...)
       ├─► socket.on('leaveRoom', ...)
       ├─► socket.on('error', ...)
       └─► socket.on('disconnect', ...)
```

### Room Management
- Rooms managed by `RoomManager` (singleton)
- Room state persisted in-memory in `Room` class
- Room view presented via `RoomPresenterService`

### Services
| Service | File | Responsibility |
|---------|------|----------------|
| `RoomManager` | `src/app/room/models/room-manager.ts` | Room registry |
| `RoomService` | `src/app/room/services/room.service.ts` | Room CRUD operations |
| `RoomPresenterService` | `src/app/room/services/room-presenter.service.ts` | Room → View transformation |
| `PlayerRoomService` | `src/app/player/services/player-room.service.ts` | Player-room interactions |
| `Room` | `src/app/room/models/room.ts` | Core room logic & game state |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ROUND_TIME_SECONDS` | `60` | Seconds per round before auto-advance |
| `PORT` | `3000` | Server port (hardcoded in server.ts) |

---

## Socket Event Type Safety

TypeScript interfaces in `src/events/events.ts` define the expected event signatures. The server implementation in `src/server.ts` uses loose typing (`any`, `unknown`) in handlers but emits typed payloads via `RoomPresenterService.mapRoom()`.

### TypeScript Event Registration (Recommended)

```typescript
// In server.ts - add proper typing
import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './events/events';

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, { ... });

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  // socket.on() and socket.emit() now fully typed
});
```

---

## Error Handling

All socket handlers wrap logic in try-catch and emit `error` events:

```typescript
socket.emit('error', {
  message: error instanceof Error ? error.message : 'Unknown error',
});
```

Client should listen for `error` event to display user-friendly messages.