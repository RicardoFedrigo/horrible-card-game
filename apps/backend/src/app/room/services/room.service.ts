import { Player } from '../../player/models/player';
import { RoomManager } from '../models/room-manager';
import { ConfigRoom } from '../types/config-room.types';
import { JoinRoom } from '../types/join-room.type';
import { PlayerView, RoomView } from '../types/room-view.type';
import { RoomPresenterService } from './room-presenter.service';

export class RoomService {
  constructor(
    private readonly roomManager: RoomManager,
    private readonly roomPresenter: RoomPresenterService,
  ) {}

  createRoom(
    config: ConfigRoom,
    playerId: string,
    onPhaseChange: (room: any, previousPhase: string) => void,
  ): { playerId: string; room: RoomView } {
    const room = this.roomManager.create(config.codeRoom, config.password, onPhaseChange);

    room.updateConfigGame({
      numberOfrounds: config.numberOfrounds ?? 5,
      maxPlayers: config.maxPlayers ?? 10,
      password: config.password,
      playingTime: config.playingTime ?? 60,
      judgingTime: config.judgingTime ?? 60,
      resultsTime: config.resultsTime ?? 10,
      language: config.language,
    });

    const adminPlayer = new Player(config.adminName, playerId, true);

    room.connectPlayer(adminPlayer, config.password);

    return {
      playerId: adminPlayer.getId(),
      room: this.roomPresenter.mapRoom(room),
    };
  }

  configureRoom(config: ConfigRoom): {
    roomId: string;
    configGame: Omit<ConfigRoom, 'adminName'>;
  } {
    const room = this.roomManager.getRoom(config.codeRoom);

    room.updateConfigGame(config);

    return {
      roomId: room.getCodeRoom(),
      configGame: room.getConfigGame(),
    };
  }

  roomExists(codeRoom: string): { exists: boolean; roomId: string } {
    try {
      const room = this.roomManager.getRoom(codeRoom);
      return { exists: true, roomId: room.getCodeRoom() };
    } catch {
      return { exists: false, roomId: '' };
    }
  }

  joinRoom(
    joinRoom: JoinRoom,
    playerId: string,
  ): { message: string; roomId: string; players: PlayerView[] } {
    const room = this.roomManager.getRoom(joinRoom.codeRoom);
    const player = new Player(joinRoom.name, playerId);

    room.connectPlayer(player, joinRoom.password);

    return {
      message: `The horrebly person ${joinRoom.name} has joined the room`,
      roomId: room.getCodeRoom(),
      players: this.roomPresenter.mapPlayers(room.getPlayers()),
    };
  }
}
