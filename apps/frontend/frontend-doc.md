# Frontend Documentation

This document describes how the frontend should interact with the backend socket events and render the game state.

---

## Connection

```js
const socket = io('http://localhost:3000');
```

---

## Client → Server Events

### `create-room`
Create a new room and become the admin.

```ts
socket.emit('create-room', {
  codeRoom: string;
  adminName: string;
  numberOfrounds?: number;   // default 5
  maxPlayers?: number;       // default 10
  password?: string;
  playingTime?: number;      // default 60 (seconds)
  judgingTime?: number;      // default 60 (seconds)
  resultsTime?: number;      // default 30 (seconds)
});
```

### `join-room`
Join an existing room.

```ts
socket.emit('join-room', {
  codeRoom: string;
  name: string;
  playerId?: string;
  password?: string;
});
```

### `configure-room`
Update room configuration (admin only).

```ts
socket.emit('configure-room', {
  roomCode: string;
  numberOfrounds?: number;
  maxPlayers?: number;
  password?: string;
  playingTime?: number;
  judgingTime?: number;
  resultsTime?: number;
});
```

### `playerReady`
Mark yourself as ready.

```ts
socket.emit('playerReady', roomCode: string);
```

### `startGame`
Start the game (admin only, all players must be ready).

```ts
socket.emit('startGame', roomCode: string);
```

### `submitCards`
Submit your selected white cards for the current black card.

```ts
socket.emit('submitCards', roomCode: string, cardIds: string[]);
```

### `selectWinner`
Card Czar votes for the winning submission.

```ts
socket.emit('selectWinner', roomCode: string, winnerPlayerId: string);
```

### `leaveRoom`
Leave the room.

```ts
socket.emit('leaveRoom', roomCode: string);
```

---

## Server → Client Events

### `room`
Sent after creating or joining a room with the full initial state.

```ts
{
  room: RoomView;
  playerId?: string;
}
```

### `room-created`
Sent after successfully creating a room.

```ts
{
  room: RoomView;
  playerId?: string;
}
```

### `roomJoined`
Sent after successfully joining a room.

```ts
{
  room: RoomView;
  playerId?: string;
}
```

### `roomUpdated`
Sent whenever any room state changes.

```ts
// RoomView (see below)
```

### `playerJoined`
A player joined the room.

```ts
{
  playerId: string;
  name: string;
  players: PlayerView[];
}
```

### `playerReadyChanged`
A player toggled their ready status.

```ts
(playerId: string, isReady: boolean)
```

### `playerLeft`
A player left the room.

```ts
(playerId: string)
```

### `gameStarted`
Game has started.

```ts
// RoomView
```

### `newRound`
A new round has begun.

```ts
{ room: RoomView }
```

### `cardsSubmitted`
A player submitted their cards.

```ts
(playerId: string)
```

### `allCardsSubmitted`
All players have submitted their cards and the judging phase has started (also triggered by timer timeout).

```ts
// Array of { playerId: string; cards: Card[] }
```

### `voteSubmitted`
A player cast their vote.

```ts
{
  voterPlayerId: string;
  votedForPlayerId: string;
}
```

### `winnerSelected`
A winner has been determined for the round (also triggered by timer timeout).

```ts
(winnerPlayerId: string | null, winningCards: Card[])
```

### `gameEnded`
The game is over.

```ts
{
  id: string;
  name: string;
  status: string;
  score: number;
  cardsInHand: Card[];
  isAdmin: boolean;
}
```

### `timerTick`
Sent every second during active phases with the remaining time.

```ts
{
  phase: 'playing' | 'judging' | 'results';
  remaining: number; // seconds left
}
```

### `error`
Any validation or room error.

```ts
{ message: string }
```

---

## RoomView Shape

```ts
{
  codeRoom: string;
  players: PlayerView[];
  started: boolean;
  gamePhase: 'waiting' | 'playing' | 'judging' | 'results' | 'ended';
  currentRound: number;
  currentBlackCard: Card | null;
  cardCzarId: string | null;
  submittedCards: { playerId: string; cards: Card[] }[];
  votes: { voterPlayerId: string; votedForPlayerId: string }[];
  winningPlayerId?: string | null;
  phaseStartedAt: number | null;   // Date.now() when current phase started
  deckCount: number;               // remaining white cards in deck
  configGame: {
    numberOfrounds: number;
    maxPlayers: number;
    password?: string;
    codeRoom: string;
    playingTime: number;           // seconds
    judgingTime: number;           // seconds
    resultsTime: number;           // seconds
  };
}
```

### PlayerView

```ts
{
  id: string;
  name: string;
  status: PlayerStatus;
  score: number;
  cardsInHand: Card[];
  isAdmin: boolean;
  isReady: boolean;
}
```

### Card

```ts
{
  id: string;
  cardType: 'black' | 'white';
  text: string;
}
```

### PlayerStatus

```ts
'waiting' | 'ready' | 'playing'
```

---

## Phase Flow

```
waiting ──(startGame)──> playing
                             │
                    (timer or all submit)
                             │
                             v
                          judging
                             │
                    (timer or all vote)
                             │
                             v
                          results
                             │
                    (timer expires)
                             │
                  ┌──────────┴──────────┐
                  v                     v
               playing (next round)   ended
```

### Phase Durations

Each phase duration is configurable via `configGame`:

| Phase     | Config Field      | Default |
|-----------|-------------------|---------|
| playing   | `playingTime`     | 60s     |
| judging   | `judgingTime`     | 60s     |
| results   | `resultsTime`     | 30s     |

---

## Timer UI Implementation

### Recommended: Listen to `timerTick`

The backend emits a `timerTick` event every second during active phases. The `remaining` value is capped to never exceed the phase duration.

```js
socket.on('timerTick', (data) => {
  // data = { phase: 'playing', remaining: 45 }
  updateTimerDisplay(data.remaining);
});
```

Only phases `playing`, `judging`, and `results` emit ticks. No tick is emitted for `waiting` or `ended`.

### Alternative: Calculate from `phaseStartedAt`

If `timerTick` is not available, calculate remaining time locally:

```js
function getRemainingTime(room) {
  if (!room.phaseStartedAt) return 0;

  const elapsed = (Date.now() - room.phaseStartedAt) / 1000;

  let duration = 0;
  switch (room.gamePhase) {
    case 'playing':  duration = room.configGame.playingTime;  break;
    case 'judging':  duration = room.configGame.judgingTime;  break;
    case 'results':  duration = room.configGame.resultsTime;  break;
    default:         return 0;
  }

  return Math.max(0, Math.floor(duration - elapsed));
}
```

---

## Key Game Rules for the Client

- **Admin** is the first player to join. Admin can configure the room and start the game.
- **Min 2 players** needed to start. All players must be `ready`.
- **Card Czar** is selected round-robin each round.
- **Submitted cards** are removed from the player's hand automatically.
- **Hands are refilled** to 7 cards at the start of each new round.
- **Timer timeouts** automatically advance the phase (no player action needed).
- If all **submissions** or **votes** arrive before the timer, the phase advances immediately.
- **Deck count** (`deckCount`) is synced from the server — no client-side estimation needed.
- **Phase transitions** are fully timer-driven: `playing` → `judging` → `results` → `playing`/`ended`. The results timer fires automatically after `resultsTime` seconds even if the frontend doesn't call `nextRound`.
- The **`timerTick` `remaining` value is clamped** between 0 and the phase duration — it will never overflow the progress bar.

---

## Loading / Transition Guidelines

- On **`roomUpdated`**, re-render the entire game state from the received `RoomView`.
- Use `room.gamePhase` to determine which UI to show (playing/judging/results).
- The `phaseStartedAt` timestamp can be used to detect stale state or drive enter/exit animations.
- On reconnect, re-fetch state from the latest `roomUpdated` emitted on join.
