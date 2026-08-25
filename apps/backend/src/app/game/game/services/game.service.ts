import { RoomManager } from '../../../room/models/room-manager';
import { CardRound } from '../../card/types/card-round.type';

export class GameService {
  constructor(private readonly roomManager: RoomManager) {}

  getGameRound(roomCode: string) {
    const room = this.roomManager.getRoom(roomCode);
    const gameRound = room.getGameRound();

    return {
      askCard: gameRound.getAskCard().text,
      roundNumber: gameRound,
    };
  }

  selectCard(
    playerId: string,
    roomCode: string,
    cardSelected: CardRound,
  ): { playerId: string; cardText: string } {
    const room = this.roomManager.getRoom(roomCode);

    room.getGameRound().selectedCard(playerId, cardSelected);

    return {
      playerId,
      cardText: cardSelected.cardId,
    };
  }

  startGame(roomCode: string): { roomId: string; status: 'started' } {
    const room = this.roomManager.getRoom(roomCode);

    room.startGame();

    return {
      roomId: room.getCodeRoom(),
      status: 'started',
    };
  }
}
