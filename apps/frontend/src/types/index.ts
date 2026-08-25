export type CardType = "black" | "white";

export interface Card {
  id: string;
  cardType: CardType;
  text: string;
  pick?: number;
}

export type PlayerStatus = "waiting" | "ready" | "playing";

export interface Player {
  id: string;
  name: string;
  status: PlayerStatus;
  score: number;
  cardsInHand: Card[];
  isAdmin: boolean;
  isReady: boolean;
}

export interface SubmittedCards {
  playerId: string;
  cards: Card[];
}

export interface Vote {
  voterPlayerId: string;
  votedForPlayerId: string;
}

export interface Room {
  codeRoom: string;
  players: Player[];
  started: boolean;
  gamePhase: GamePhase;
  currentRound: number;
  currentBlackCard: Card | null;
  cardCzarId: string | null;
  submittedCards: SubmittedCards[];
  votes: Vote[];
  winningPlayerId: string | null;
  winningPlayerIds?: string[];
  tiebreakActive?: boolean;
  phaseStartedAt: number | null;
  deckCount: number;
  password?: string;
  configGame: {
    numberOfrounds: number;
    maxPlayers: number;
    codeRoom: string;
    password?: string;
    playingTime: number;
    judgingTime: number;
    resultsTime: number;
    language?: string;
  };
}

export type GamePhase = "waiting" | "playing" | "judging" | "results" | "ended";

export interface SocketEvents {
  // Client -> Server
  createRoom: (payload: {
    codeRoom: string;
    adminName: string;
    numberOfrounds: number;
    maxPlayers: number;
    password?: string;
    playingTime?: number;
    judgingTime?: number;
    resultsTime?: number;
    language?: string;
  }) => void;
  joinRoom: (payload: {
    codeRoom: string;
    name: string;
    playerId?: string;
    password?: string;
  }) => void;
  configureRoom: (payload: {
    roomCode: string;
    numberOfrounds: number;
    maxPlayers: number;
    password?: string;
    playingTime?: number;
    judgingTime?: number;
    resultsTime?: number;
    language?: string;
  }) => void;
  playerReady: (roomCode: string) => void;
  startGame: (roomCode: string) => void;
  submitCards: (roomCode: string, cardIds: string[]) => void;
  selectWinner: (roomCode: string, winnerPlayerId: string) => void;
  leaveRoom: (roomCode: string) => void;

  // Server -> Client
  room: (payload: { room: Room; playerId?: string }) => void;
  roomCreated: (payload: { room: Room; playerId?: string }) => void;
  roomJoined: (payload: { room: Room; playerId?: string }) => void;
  roomUpdated: (room: Room) => void;
  playerJoined: (player: Player) => void;
  playerLeft: (playerId: string) => void;
  playerReadyChanged: (playerId: string, isReady: boolean) => void;
  gameStarted: (room: Room) => void;
  newRound: (payload: { room: Room }) => void;
  cardsSubmitted: (playerId: string) => void;
  allCardsSubmitted: (submissions: SubmittedCards[]) => void;
  voteSubmitted: (payload: {
    voterPlayerId: string;
    votedForPlayerId: string;
  }) => void;
  winnerSelected: (
    winningPlayerIds: string[],
    winningCards: Card[][],
  ) => void;
  gameEnded: (winner: Player) => void;
  error: (message: string) => void;
  timerTick: (data: { phase: string; remaining: number }) => void;
}
