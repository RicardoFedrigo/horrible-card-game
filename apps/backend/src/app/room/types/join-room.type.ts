import { Player } from '../../player/models/player';
import { ConfigRoom } from './config-room.types';

export type JoinRoom = Pick<ConfigRoom, 'codeRoom' | 'password'> & {
  name: string;
  playerId: string;
};
