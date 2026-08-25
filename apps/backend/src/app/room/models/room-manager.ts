import { Room } from './room';
import { JoinRoom } from '../types/join-room.type';
import { Player } from '../../player/models/player';
import { ConfigRoom } from '../types/config-room.types';

export class RoomManager {
  private rooms = new Map<string, Room>();

  create(roomId: string, password?: string, onPhaseChange?: (room: Room, previousPhase: string) => void): Room {
    const roomIdTrated = roomId.trim().toUpperCase();

    if (this.rooms.has(roomIdTrated)) {
      throw new Error('Room already exists');
    }

    const room = new Room(roomIdTrated, password, onPhaseChange);

    this.rooms.set(roomIdTrated, room);
    return room;
  }

  findRoomByPlayerId(playerId: string) {
    for (const [_roomId, room] of this.rooms.entries()) {
      const player = room.getPlayers().find((p) => p.getId() === playerId);
      if (player) {
        return room;
      }
    }
    throw new Error('Room not found for player');
  }

  removePlayerFromRoom(playerId: string) {
    const room = this.findRoomByPlayerId(playerId);
    const playerIndex = room
      .getPlayers()
      .findIndex((p) => p.getId() === playerId);
    if (playerIndex !== -1) {
      room.getPlayers().splice(playerIndex, 1);
    } else {
      throw new Error('Player not found in room');
    }
  }

  remove(roomId: string) {
    const roomIdTrated = roomId.trim().toUpperCase();
    this.rooms.delete(roomIdTrated);
  }

  updateConfigGame(
    roomId: string,
    configGame: Omit<ConfigRoom, 'adminName' | 'codeRoom'>,
  ) {
    const room = this.getRoom(roomId);
    room.updateConfigGame(configGame);
  }

  getRoom(roomId: string): Room {
    const roomIdTrated = roomId.trim().toUpperCase();
    const room = this.rooms.get(roomIdTrated);
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}
