export type ConfigRoom = {
  numberOfrounds: number;
  maxPlayers: number;
  password?: string;
  codeRoom: string;
  adminName: string;
  playerId?: string;
  roundTime?: number;
  playingTime: number;
  judgingTime: number;
  resultsTime: number;
  language?: string;
};
