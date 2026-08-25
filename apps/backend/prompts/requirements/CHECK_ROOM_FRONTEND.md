# Frontend Prompt: Room Existence Check

## Goal

Implement the client-side UI and socket logic that asks the backend whether a room code exists before a player joins, and shows an error when the room does not exist.

## Backend Contract (already implemented)

- Client → Server: `check-room` with payload `roomCode: string`
- Server → Client on success: `roomChecked` with payload `{ exists: boolean; roomId: string }`
- Server → Client on failure: `error` with payload `{ message: string }`

## Requirements

### 1. Socket client wiring

- Listen for `roomChecked` and `error` on the socket client.
- Add a typed method/hook `checkRoomExists(roomCode: string)` that emits `check-room` with the room code (uppercased client-side or handled by server).

### 2. Join screen UX

- In the join-room screen, add a "Check Room" / validation flow:
  - User enters a room code.
  - On blur or button click, call `checkRoomExists`.
  - While waiting, show a loading state and disable the join button.
  - On `roomChecked` with `exists: true`: allow joining (show "Room found" / enable join button).
  - On `roomChecked` with `exists: false` OR `error`: show an inline error banner, e.g. `Room "X" not found.`, keep the join button disabled.

### 3. Error handling & reset

- Clear the error when the user edits the room code.
- Handle socket disconnection/timeout: show a generic error and re-enable the join button.

### 4. Accessibility

- Use proper roles/labels (`role="alert"` or `aria-live="polite"`) for the error message so screen readers announce it.

## Acceptance Criteria

- A valid room code enables joining and navigates to the room.
- An invalid/nonexistent room code shows an error and blocks joining.
- No error shows while editing after a failed check (cleared on change).
- Loading state prevents double-submission.