# Required Socket Events

This frontend expects the backend to own room state and game logic. The client only renders lobby/game state and emits player actions.

## Client To Server

- `create-room`: `{ codeRoom, adminName, numberOfrounds, maxPlayers, password?, language? }`
- `join-room`: `{ codeRoom, name, playerId?, password? }`
- `configure-room`: `{ roomCode, numberOfrounds, maxPlayers, password?, language? }`
- `playerReady`: `roomCode`
- `startGame`: `roomCode`
- `submitCards`: `roomCode, cardIds[]`
- `selectWinner`: `roomCode, winnerPlayerId`
- `leaveRoom`: `roomCode`

## Server To Client

- `room`: `{ room, playerId? }` after create/join or initial room sync.
- `room-created`: `{ room, playerId? }` after a room is created.
- `roomJoined`: `{ room, playerId? }` after a player joins.
- `roomUpdated`: `room` whenever lobby config, players, phase, round, submissions, or scores change.
- `playerLeft`: `playerId` when a player leaves.
- `playerReadyChanged`: `playerId, isReady` when a player toggles readiness.
- `gameStarted`: `room` after all requirements pass and the game starts.
- `newRound`: `{ room }` preferred, or `{ blackCard, cardCzarId, hand, round }` for partial round updates.
- `allCardsSubmitted`: `{ playerId, cards[] }[]` when the round moves to judging.
- `winnerSelected`: `winnerIds[], winningCards[][]` when voting resolves a winner (parallel arrays; empty `winnerIds` when no votes were cast).
- `gameEnded`: `winner` when the configured round count is complete.
- `error`: `message` for validation and room errors.

## Required Room Shape

`room` must include `codeRoom`, `players`, `started`, `gamePhase`, `currentRound`, `currentBlackCard`, `cardCzarId`, `submittedCards`, and `configGame`.
