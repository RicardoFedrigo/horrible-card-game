import { Player } from '../../player/models/player';
import { Room } from '../models/room';
import { PlayerView, RoomView } from '../types/room-view.type';

export class RoomPresenterService {
  mapRoom(room: Room): RoomView {
    return {
      codeRoom: room.getCodeRoom(),
      players: this.mapPlayers(room.getPlayers()),
      started: room.getStarted(),
      gamePhase: room.getGamePhase(),
      currentRound: room.getCurrentRound(),
      currentBlackCard: room.getCurrentBlackCard(),
      cardCzarId: room.getCardCzarId(),
      submittedCards: room.getSubmittedCards(),
      votes: room.getVotes(),
      winningPlayerId: room.getWinningPlayerId(),
      winningPlayerIds: room.getWinningPlayerIds(),
      tiebreakActive: room.getTiebreakActive(),
      phaseStartedAt: room.getPhaseStartedAt(),
      deckCount: room.getDeckCount(),
      configGame: room.getConfigGame(),
    };
  }

  mapPlayers(players: Player[]): PlayerView[] {
    return players.map((player) => ({
      id: player.getId(),
      name: player.getName(),
      status: player.getStatus(),
      score: player.getPoints(),
      cardsInHand: player.getCards(),
      isAdmin: player.getIsAdmin(),
      isReady: player.getStatus() === 'ready',
    }));
  }
}
