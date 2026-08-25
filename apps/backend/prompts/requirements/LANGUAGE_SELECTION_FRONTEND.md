# Frontend Prompt: Language / Idioma Selection

## Goal

Let the room admin pick the game language (English or Português). The selected language determines which deck of black/white cards the backend deals during the game.

## Backend Contract (already implemented)

- `language` is a new optional field on room configuration.
- It can be sent on **either** of these events (it is stored in `room.configGame`):
  - `create-room`: `{ codeRoom, adminName, numberOfrounds?, maxPlayers?, password?, language? }`
  - `configure-room`: `{ roomCode, numberOfrounds?, maxPlayers?, password?, language? }`
- Accepted values: `"en"` (default) and `"pt-br"` (also accepts `"pt"`, `"pt_BR"`, `"ptbr"`).
- The backend picks the deck at `startGame` using `room.configGame.language`, so the language must be chosen **before** starting the game.
- `RoomView.configGame` now includes `language`, so the client can read the current language from any `room`/`roomUpdated` payload.

## Requirements

### 1. Type definitions

- Add `language?: 'en' | 'pt-br'` (or `string`) to the `create-room` and `configure-room` payload types.
- Add `language?: string` to the `ConfigRoom`/`configGame` type used by `RoomView`.

### 2. Lobby UI

- Add a language selector (segmented control, select, or two buttons: "EN" / "PT-BR") in the room lobby, visible only to the admin.
- Default selection is English.
- The selector must be disabled once the game has started (`room.started === true` or `gamePhase !== 'waiting'`).

### 3. Wiring the events

- When creating a room: include `language` in the `create-room` payload.
- When the admin changes the language in the lobby: emit `configure-room` with the room code and the new `language`.
- Do **not** emit `configure-room` while the game is running.

### 4. Rendering the current language

- On `room` / `roomUpdated`, read `room.configGame.language` and reflect it in the selector (so it stays in sync after a re-render or reconnect).
- Show the selected language label near the room code/options so all players see which deck will be used.

### 5. Error handling

- If `configure-room` fails (e.g. game already started), the backend emits `error` `{ message }`; show an inline toast/banner and revert the selector to the last known `room.configGame.language`.

## Acceptance Criteria

- The admin can choose EN or PT-BR before starting the game.
- The chosen language is persisted in `room.configGame.language` and reflected in all `roomUpdated` payloads.
- Cards dealt after `startGame` are in the chosen language.
- The selector is locked (disabled) after the game starts.
- Non-admin players see the current language but cannot change it.
