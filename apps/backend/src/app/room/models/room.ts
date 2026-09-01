import { Game } from '../../game/game/models/game';
import { Round } from '../../game/game/models/round';
import { Player } from '../../player/models/player';
import { ConfigRoom } from '../types/config-room.types';
import { Card } from '../../game/card/models/card';
import { Answer } from '../../../db/static-db/answer';
import { Asks } from '../../../db/static-db/asks';

export class Room {
  private MIN_PLAYERS = 2;

  private codeRoom: string;
  private players: Player[];
  private started: boolean;
  private password?: string;
  private game: Game | null;
  private configGame: Omit<ConfigRoom, 'adminName'>;
  private phaseStartedAt: number | null = null;
  private onPhaseChange?: (room: Room, previousPhase: string) => void;

  // Real-time game state fields matching frontend REQUIRED_SOCKET_EVENTS.md
  private gamePhase: 'waiting' | 'playing' | 'judging' | 'results' | 'ended';
  private currentRound: number;
  private currentBlackCard: Card | null;
  private cardCzarId: string | null;
  private submittedCards: { playerId: string; cards: Card[] }[];
  private votes: { voterPlayerId: string; votedForPlayerId: string }[];
  private winningPlayerId: string | null;
  private winningPlayerIds: string[];
  private tiebreakActive: boolean;

  private phaseTimer: NodeJS.Timeout | null = null;

  // Deck states
  private whiteCardDeck: Card[];
  private blackCardDeck: Card[];

  constructor(codeRoom: string, password?: string, onPhaseChange?: (room: Room, previousPhase: string) => void) {
    this.codeRoom = codeRoom;
    this.players = [];
    this.started = false;
    this.password = password;
    this.onPhaseChange = onPhaseChange;
    this.configGame = {
      numberOfrounds: 5, // Default to 5 rounds
      maxPlayers: 10,
      codeRoom: codeRoom,
      password: password,
      roundTime: Number(process.env.ROUND_TIME) || 60,
      playingTime: 60,
      judgingTime: 60,
      resultsTime: 30,
      language: 'en',
    };
    this.game = null;

    this.gamePhase = 'waiting';
    this.currentRound = 0;
    this.currentBlackCard = null;
    this.cardCzarId = null;
    this.submittedCards = [];
    this.votes = [];
    this.winningPlayerId = null;
    this.winningPlayerIds = [];
    this.tiebreakActive = false;

    this.whiteCardDeck = [];
    this.blackCardDeck = [];
  }

  // Getters
  getPhaseStartedAt(): number | null {
    return this.phaseStartedAt;
  }

  getStarted(): boolean {
    return this.started;
  }

  getGamePhase(): 'waiting' | 'playing' | 'judging' | 'results' | 'ended' {
    return this.gamePhase;
  }

  getCurrentRound(): number {
    return this.currentRound;
  }

  getCurrentBlackCard(): Card | null {
    return this.currentBlackCard;
  }

  getCardCzarId(): string | null {
    return this.cardCzarId;
  }

  getSubmittedCards(): { playerId: string; cards: Card[] }[] {
    return this.submittedCards;
  }

  getWinningPlayerId(): string | null {
    return this.winningPlayerId;
  }

  getWinningPlayerIds(): string[] {
    return this.winningPlayerIds;
  }

  getTiebreakActive(): boolean {
    return this.tiebreakActive;
  }

  getVotes(): { voterPlayerId: string; votedForPlayerId: string }[] {
    return this.votes;
  }

  getDeckCount(): number {
    return this.whiteCardDeck.length;
  }

  setAdmin(playerId: string) {
    if (this.alreadyHasAdmin()) {
      throw new Error('Room already has an admin');
    }

    const player = this.getPlayerById(playerId);
    if (player) {
      player.setAdmin();
    }
  }

  alreadyHasAdmin(): boolean {
    return this.players.some((p) => p.getIsAdmin());
  }

  getCodeRoom(): string {
    return this.codeRoom;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getConfigGame() {
    return this.configGame;
  }

  setPlayerReady(playerId: string) {
    const player = this.getPlayerById(playerId);
    if (player) {
      player.setStatus('ready');
    }
  }

  playerUnready(playerId: string) {
    const player = this.getPlayerById(playerId);
    if (player) {
      player.setStatus('waiting');
    }
  }

  togglePlayerReady(playerId: string): boolean {
    const player = this.getPlayerById(playerId);
    const isReady = player.getStatus() === 'ready';
    player.setStatus(isReady ? 'waiting' : 'ready');
    return !isReady;
  }

  updateConfigGame(configGame: Omit<ConfigRoom, 'adminName' | 'codeRoom'>) {
    const entries = Object.entries(configGame).filter(
      ([, value]) => value !== undefined,
    );
    this.configGame = Object.assign(
      this.configGame,
      Object.fromEntries(entries),
    );
  }

  // Helper to shuffle array
  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
    }
    return arr;
  }

  // Start the actual game flow
  startGame() {
    if (this.players.length < this.MIN_PLAYERS) {
      throw new Error(
        `At least ${this.MIN_PLAYERS} players are required to start the game`,
      );
    }

    if (this.players.some((p) => p.getStatus() !== 'ready')) {
      throw new Error('All players must be ready to start the game');
    }

    this.started = true;
    this.currentRound = 1;
    this.winningPlayerId = null;
    this.winningPlayerIds = [];
    this.submittedCards = [];
    this.votes = [];
    this.tiebreakActive = false;

    // Initialize & shuffle black cards (single-card answers only for now;
    // multi-pick questions will be a separate game mode).
    const language = this.configGame.language || 'en';
    const allAsks = new Asks().getAll(language).filter((ask) => ask.pick === 1);
    this.blackCardDeck = this.shuffle(
      allAsks.map((ask) => new Card('black', ask.text, 1)),
    );

    // Initialize & shuffle white cards
    const allAnswers = Answer.getAll(language);
    this.whiteCardDeck = this.shuffle(
      allAnswers.map((text) => new Card('white', text)),
    );

    // Pick first Card Czar
    this.cardCzarId =
      this.players[Math.floor(Math.random() * this.players.length)]?.getId() ??
      null;

    // Pick current black card
    this.currentBlackCard = this.blackCardDeck.pop() ?? null;

    // Reset player scores and deal 7 cards to everyone
    this.players.forEach((player) => {
      player.setStatus('playing');

      const cardsToDeal: Card[] = [];
      for (let i = 0; i < 7; i++) {
        const card = this.whiteCardDeck.pop();
        if (card) {
          cardsToDeal.push(card);
        }
      }

      console.info(`Dealing ${cardsToDeal.length} cards to player ${player.getName()}`);

      player.removeCards(player.getCards().map((c) => c.id)); // Clear hand first
      player.addCards(cardsToDeal);
    });

    // Create Game instance for legacy/backward compatibility if needed
    this.game = new Game(this.configGame.numberOfrounds, this.players, language);
    this.game.startGame();

    this.setGamePhase('playing');
  }

  private setGamePhase(phase: 'waiting' | 'playing' | 'judging' | 'results' | 'ended') {
    const previousPhase = this.gamePhase;
    this.gamePhase = phase;
    this.phaseStartedAt = Date.now();
    this.startPhaseTimer();
    if (this.onPhaseChange) {
      this.onPhaseChange(this, previousPhase);
    }
  }

  private startPhaseTimer() {
    if (this.phaseTimer) clearTimeout(this.phaseTimer);
    
    let duration = 60;
    switch (this.gamePhase) {
      case 'playing': duration = this.configGame.playingTime; break;
      case 'judging': duration = this.configGame.judgingTime; break;
      case 'results': duration = this.configGame.resultsTime; break;
      default: return;
    }

    this.phaseTimer = setTimeout(
      () => {
        this.handlePhaseTimeout();
      },
      duration * 1000,
    );
  }

  private handlePhaseTimeout() {
    switch (this.gamePhase) {
      case 'playing':
        this.setGamePhase('judging');
        break;
      case 'judging':
        // If timeout in judging, maybe no one voted or it just moves to results?
        // For now, let's just go to results
        this.resolveVotingResult(); 
        break;
      case 'results':
        if (this.currentRound >= this.configGame.numberOfrounds) {
          this.setGamePhase('ended');
        } else {
          this.proceedToNextRound();
        }
        break;
    }
  }

  submitCards(playerId: string, cardIds: string[]) {
    if (this.gamePhase !== 'playing') {
      throw new Error('Cannot submit cards in this phase');
    }

    const player = this.getPlayerById(playerId);

    // Validate the number of cards against the black card's pick count.
    const requiredPick = this.currentBlackCard?.pick ?? 1;
    if (cardIds.length !== requiredPick) {
      throw new Error(
        `You must submit exactly ${requiredPick} card(s) for this black card`,
      );
    }

    if (new Set(cardIds).size !== cardIds.length) {
      throw new Error('Duplicate cards in submission');
    }

    // Verify player actually has these cards
    const playerCards = player.getCards();
    
    const cardsToSubmit = playerCards.filter((c) => cardIds.includes(c.id));
  
    if (cardsToSubmit.length !== cardIds.length) {
      throw new Error('Some submitted cards were not in player hand');
    }

    // Check if player already submitted
    const alreadySubmitted = this.submittedCards.some(
      (sub) => sub.playerId === playerId,
    );

    if (!alreadySubmitted) {
      player.removeCards(cardIds);
      this.submittedCards.push({
        playerId,
        cards: cardsToSubmit,
      });
    }

    // Every player (including the Card Czar) must submit before judging.
    if (this.submittedCards.length >= this.players.length) {
      this.setGamePhase('judging');
      this.votes = [];
    }
  }

  private getPlayerById(playerId: string): Player  {
    const player = this.players.find((p) => p.getId() === playerId);

    if (!player) {
      throw new Error('Player not found');
    }
    return player;
  }

  submitVote(voterPlayerId: string, submissionPlayerId: string): boolean {
    if (this.gamePhase !== 'judging') {
      throw new Error('Cannot submit votes in this phase');
    }

    const voter = this.players.find((p) => p.getId() === voterPlayerId);
    if (!voter) {
      throw new Error('Player not found');
    }

    const submission = this.submittedCards.find(
      (item) => item.playerId === submissionPlayerId,
    );
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (this.thePlayerAlreadyVoted(voterPlayerId)) {
      return false;
    }

    this.votes.push({
      voterPlayerId,
      votedForPlayerId: submissionPlayerId,
    });

    return true;
  }

  private thePlayerAlreadyVoted(voterPlayerId: string): boolean {
    return this.votes.some((vote) => vote.voterPlayerId === voterPlayerId);
  }

  resolveVotingIfComplete(): void {
    if (this.gamePhase !== 'judging') {
      return;
    }

    // Everyone votes (including the Card Czar); resolve once all votes are in.
    if (this.votes.length >= this.players.length) {
      this.resolveVotingResult();
    }
  }

  private resolveVotingResult() {
    const voteCounts = this.submittedCards.reduce<Record<string, number>>(
      (acc, submission) => {
        acc[submission.playerId] = 0;
        return acc;
      },
      {},
    );

    this.votes.forEach((vote) => {
      if (voteCounts[vote.votedForPlayerId] !== undefined) {
        voteCounts[vote.votedForPlayerId] += 1;
      }
    });

    const highestVoteCount = Math.max(
      ...this.submittedCards.map(
        (submission) => voteCounts[submission.playerId] ?? 0,
      ),
    );

    if (highestVoteCount <= 0) {
      // No votes cast (e.g. judging timed out).
      if (this.tiebreakActive) {
        // Tiebreaker timed out: everyone still tied gets a point.
        this.awardTiedWinners();
        return;
      }
      this.winningPlayerIds = [];
      this.winningPlayerId = null;
      this.tiebreakActive = false;
      this.setGamePhase('results');
      return;
    }

    const winningSubmissions = this.submittedCards.filter(
      (submission) =>
        (voteCounts[submission.playerId] ?? 0) === highestVoteCount,
    );

    if (winningSubmissions.length > 1 && !this.tiebreakActive) {
      // Tie: keep only the tied submissions and re-run judging as a tiebreaker.
      const tiedIds = new Set(winningSubmissions.map((s) => s.playerId));
      this.submittedCards = this.submittedCards.filter((s) =>
        tiedIds.has(s.playerId),
      );
      this.votes = [];
      this.tiebreakActive = true;
      this.setGamePhase('judging');
      return;
    }

    // Single winner, or a tie that persists through the tiebreaker.
    const winningPlayers = this.players.filter((player) =>
      winningSubmissions.some(
        (submission) => submission.playerId === player.getId(),
      ),
    );

    winningPlayers.forEach((player) => player.addPoints(1));

    this.winningPlayerIds = winningPlayers.map((player) => player.getId());
    this.winningPlayerId = this.winningPlayerIds[0] ?? null;
    this.tiebreakActive = false;
    this.setGamePhase('results');
  }

  private awardTiedWinners(): void {
    const winningPlayers = this.players.filter((player) =>
      this.submittedCards.some(
        (submission) => submission.playerId === player.getId(),
      ),
    );

    winningPlayers.forEach((player) => player.addPoints(1));

    this.winningPlayerIds = winningPlayers.map((player) => player.getId());
    this.winningPlayerId = this.winningPlayerIds[0] ?? null;
    this.tiebreakActive = false;
    this.setGamePhase('results');
  }

  selectWinner(voterPlayerId: string, winnerPlayerId: string): boolean {
    return this.submitVote(voterPlayerId, winnerPlayerId);
  }

  nextRound() {
    if (this.gamePhase !== 'results') {
      throw new Error('Cannot move to next round yet');
    }
    if (this.currentRound >= this.configGame.numberOfrounds) {
      this.setGamePhase('ended');
      return;
    }
    this.proceedToNextRound();
  }

  private proceedToNextRound() {
    this.currentRound += 1;
    this.winningPlayerId = null;
    this.winningPlayerIds = [];
    this.submittedCards = [];
    this.votes = [];
    this.tiebreakActive = false;

    // Refill player hands to 7 white cards
    this.players.forEach((player) => {
      const currentHandSize = player.getCards().length;
      const cardsNeeded = 7 - currentHandSize;
      const cardsToDeal: Card[] = [];
      for (let i = 0; i < cardsNeeded; i++) {
        const card = this.whiteCardDeck.pop();
        if (card) {
          cardsToDeal.push(card);
        }
      }
      player.addCards(cardsToDeal);
    });

    // Select next Card Czar
    const czarIndex = (this.currentRound - 1) % this.players.length;
    this.cardCzarId = this.players[czarIndex]?.getId() ?? null;

    // Pick new black card
    this.currentBlackCard = this.blackCardDeck.pop() ?? null;

    // Emit the phase change only after all round state has been updated so
    // clients receive the fresh black card and refilled hands in one shot.
    this.setGamePhase('playing');
  }

  getGameRound(): Round {
    if (this.currentBlackCard) {
      return new Round(this.currentBlackCard);
    }
    if (!this.game) {
      throw new Error('Game not started');
    }
    return this.game.getActualRound();
  }

  setConfiguration(configGame: ConfigRoom) {
    this.configGame = configGame;
  }

  // Resets a finished game back to the lobby so players can start fresh rounds.
  resetToLobby(): void {
    this.started = false;
    this.game = null;
    this.currentRound = 0;
    this.currentBlackCard = null;
    this.cardCzarId = null;
    this.submittedCards = [];
    this.votes = [];
    this.winningPlayerId = null;
    this.winningPlayerIds = [];
    this.tiebreakActive = false;
    this.whiteCardDeck = [];
    this.blackCardDeck = [];

    this.players.forEach((player) => {
      player.removeCards(player.getCards().map((c) => c.id));
      player.resetPoints();
      player.setStatus(player.getIsAdmin() ? 'ready' : 'waiting');
    });

    this.setGamePhase('waiting');
  }

  connectPlayer(player: Player, password?: string) {
    if (this.started) {
      throw new Error('Game already started');
    }

    if (this.password && this.password !== password) {
      throw new Error('Invalid password');
    }

    if (this.players.length >= this.configGame.maxPlayers) {
      throw new Error('Room is full');
    }

    if (this.players.find((p) => p.getId() === player.getId())) {
      throw new Error('Player already in the room');
    }

    // Set first player as admin
    if (this.players.length === 0) {
      player.setAdmin();
      player.setStatus('ready');
    }

    this.players.push(player);
  }

  disconnectPlayer(playerId: string): number {
    const wasCzar = this.cardCzarId === playerId;
    const playerIndex = this.players.findIndex((p) => p.getId() === playerId);
    const wasAdmin =
      playerIndex !== -1 ? this.players[playerIndex]?.getIsAdmin() : false;

    this.players = this.players.filter((player) => player.getId() !== playerId);

    if (this.players.length === 0) {
      return 0;
    }

    // If game has started and player list drops below minimum, end game
    // through the normal phase flow so clients get roomUpdated/gameEnded.
    if (this.started && this.players.length < this.MIN_PLAYERS) {
      this.setGamePhase('ended');
      return this.players.length;
    }

    // If czar disconnected during an active round, choose next czar and reset
    // submissions/votes, restarting the round via the normal phase flow.
    if (
      this.started &&
      wasCzar &&
      (this.gamePhase === 'playing' || this.gamePhase === 'judging')
    ) {
      const czarIndex = (this.currentRound - 1) % this.players.length;
      this.cardCzarId = this.players[czarIndex]?.getId() ?? null;
      this.submittedCards = [];
      this.votes = [];
      this.setGamePhase('playing');
    }

    // Pass admin to another player if admin left
    if (wasAdmin) {
      this.players[0]?.setAdmin();
    }

    return this.players.length;
  }
}
