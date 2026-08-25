import { Player } from '../../player/models/player';

export type Room = {
  id: string;
  players: Player[];
  started: boolean;
};
