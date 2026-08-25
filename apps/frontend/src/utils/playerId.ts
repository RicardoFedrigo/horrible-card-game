const PLAYER_ID_KEY = "cah-player-id";

export const getPlayerId = (): string => {
  let id = sessionStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    sessionStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
};
