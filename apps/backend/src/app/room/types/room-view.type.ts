import { PlayerStatus } from '../../player/types/player-status.type';
import { ConfigRoom } from './config-room.types';
import { Card } from '../../game/card/models/card';

export type PlayerView = {
  id: string;
  name: string;
  status: PlayerStatus;
  score: number;
  cardsInHand: Card[];
  isAdmin: boolean;
  isReady: boolean;
};

export type SubmittedCardsView = {
  playerId: string;
  cards: Card[];
};

export type RoomView = {
  codeRoom: string;
  players: PlayerView[];
  started: boolean;
  gamePhase: 'waiting' | 'playing' | 'judging' | 'results' | 'ended';
  currentRound: number;
  currentBlackCard: Card | null;
  cardCzarId: string | null;
  submittedCards: SubmittedCardsView[];
  votes: { voterPlayerId: string; votedForPlayerId: string }[];
  winningPlayerId?: string | null;
  winningPlayerIds: string[];
  tiebreakActive: boolean;
  phaseStartedAt?: number | null;
  deckCount: number;
  configGame: Omit<ConfigRoom, 'adminName' | 'password'>;
};
