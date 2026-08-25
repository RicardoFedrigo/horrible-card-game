# Frontend Timer Implementation Guide

To implement the countdown timer, you have two options:

## Option 1: `timerTick` Event (Recommended)
The server broadcasts a `timerTick` event to all clients in a room every second during active phases.

- **Event Name**: `timerTick`
- **Data**: `{ phase: string, remaining: number }`

**Usage**:
Listen for this event and update your UI timer display directly with the `remaining` value.

```javascript
socket.on('timerTick', (data) => {
  // data = { phase: 'playing', remaining: 45 }
  updateTimerUI(data.remaining);
});
```

## Option 2: Calculation (Fallback)
If you prefer not to listen to ticks, you can calculate the remaining time based on `phaseStartedAt`.

1.  **Get Configuration**: Use the durations defined in `configGame` based on the current `gamePhase`.
    *   `playing`: `configGame.playingTime`
    *   `judging`: `configGame.judgingTime`
    *   `results`: `configGame.resultsTime`
2.  **Calculate Elapsed**: `elapsed = (Date.now() - room.phaseStartedAt) / 1000` (in seconds).
3.  **Calculate Remaining**: `remaining = duration - elapsed`.
