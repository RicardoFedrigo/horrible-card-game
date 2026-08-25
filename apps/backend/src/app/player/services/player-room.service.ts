import { RoomManager } from '../../room/models/room-manager';
import { RoomPresenterService } from '../../room/services/room-presenter.service';
import { PlayerView } from '../../room/types/room-view.type';
import { PlayerStatus } from '../types/player-status.type';

export class PlayerRoomService {
  constructor(
    private readonly roomManager: RoomManager,
    private readonly roomPresenter: RoomPresenterService,
  ) {}

  updatePlayerStatus(
    roomCode: string,
    playerId: string,
    playerStatus: PlayerStatus,
  ): { players: PlayerView[]; roomId: string } {
    const room = this.roomManager.getRoom(roomCode);

    if (playerStatus === 'ready') {
      room.setPlayerReady(playerId);
    } else {
      room.playerUnready(playerId);
    }

    return {
      players: this.roomPresenter.mapPlayers(room.getPlayers()),
      roomId: room.getCodeRoom(),
    };
  }

  togglePlayerReady(
    roomCode: string,
    playerId: string,
  ): { players: PlayerView[]; roomId: string; isReady: boolean } {
    const room = this.roomManager.getRoom(roomCode);
    const isReady = room.togglePlayerReady(playerId);

    return {
      players: this.roomPresenter.mapPlayers(room.getPlayers()),
      roomId: room.getCodeRoom(),
      isReady,
    };
  }

  disconnectPlayer(playerId: string): void {
    this.roomManager.removePlayerFromRoom(playerId);
  }
}
