# Missing Features & Gaps

## Socket Events Not Fully Handled

### `playerJoined`
Listed in `SocketEvents` and `frontend-doc.md` but no listener exists in `socketClient.ts`. New players joining mid-game won't trigger any UI update beyond the `roomUpdated` event.

### `cardsSubmitted`
Listener exists in `socketClient.ts` but the body is empty. The `hasSubmitted` state in `Game.tsx` is set optimistically on submit click, but never reset by the server event. If the server rejects a submission, the UI stays in "submitted" state.

---

## Route Inconsistency

`Home.tsx` navigates to `/lobby/$code` after creating/joining a room. But inside `Game.tsx` the new round effect navigates to `/game/$code`. Both routes exist and point to `GamePage`, so it works, but the URL changes mid-game. Pick one convention.

---

## No Card Count Management

The deck count is faked:
```ts
const deckCount = room ? Math.max(10, 50 - submissions.length * 3) : 50;
```
The actual remaining cards in the deck are never synced from the server. The `RoomView` has no `deckCount` field.

---

## Hand Refill Not Visible

The doc says hands are refilled to 7 cards each round, but there's no UI feedback when this happens. Cards just appear in the hand.

---

## Vote Tracking Not Visible in UI

The `votes` array is stored but never displayed beyond a count. During results there's no breakdown of who voted for whom.

---

## Player List Czar Indicator

The `cardCzarId` is still shown in the player list even though voting is now open to all players. The Czar role may still be relevant for round-robin tracking.

---

## No Loading / Transition States

Phase transitions (playing → judging → results → next round) happen instantly with no animation or loading indicator. Cards appear/disappear without transitions.

---

## Reconnection & State Recovery

The socket has basic reconnection logic (`reconnectionAttempts: 5`) but the game state is not recovered on reconnect. If a player disconnects and reconnects, their hand, phase, and timer state are lost.

---

## Error Handling Gaps

- `error` from the server is displayed in an Alert but never auto-dismissed
- No distinction between fatal errors (can't join room) and transient errors (submission rejected)
- Room-level errors (e.g. "game already started") aren't styled differently from validation errors

---

## No Game History

Previous rounds, scores by round, and the winning cards from each round are not tracked or displayed.

---

## Timer Display

The progress bar uses `phaseDuration` as the denominator which is read from `room.configGame`. If the server sends a `timerTick` with a value larger than `phaseDuration`, the progress bar overflows.
