import { Card } from '../../card/models/card';
import { Round } from './round';
import { Asks } from '../../../../db/static-db/asks';
import { randomUUID } from 'node:crypto';
import { Player } from '../../../player/models/player';

export class Game {
  private askCards: Card[];
  private rounds: Round[];
  private currentRoundIndex: number;
  private gameStarted: boolean;

  constructor(
    private numberOfRounds: number = 3,
    private players: Player[],
    private language: string = 'en',
  ) {
    this.askCards = new Asks().getAll(this.language).map((ask) => ({
      id: randomUUID(),
      cardType: 'ask',
      text: ask.text,
      pick: ask.pick,
    }));

    this.rounds = this.createAskCardForRounds();
    this.currentRoundIndex = 0;
    this.gameStarted = false;
  }

  startGame() {
    this.currentRoundIndex += 1;
    this.gameStarted = true;
  }

  nextRound(): Round {
    if (!this.gameStarted) {
      throw new Error('Game not started');
    }
    this.currentRoundIndex += 1;
    return this.getActualRound();
  }

  endRound(): void {
    if (this.currentRoundIndex === this.numberOfRounds) {
      this.endGame();
      return;
    }

    const round = this.getActualRound();

    const winners = round.endRound();

    winners.forEach((playerId) => {
      const player = this.players.find((p) => p.getId() === playerId);
      if (player) {
        player.addPoints();
      }
    });

    this.nextRound();
  }

  getActualRound(): Round {
    if (!this.gameStarted) {
      throw new Error('Game not started');
    }
    return this.rounds[this.currentRoundIndex - 1];
  }

  endGame(): Player[] {
    if (!this.gameStarted) {
      throw new Error('Game not started');
    }
    this.gameStarted = false;
    const maxPoints = Math.max(...this.players.map((p) => p.getPoints()));
    return this.players.filter((p) => p.getPoints() === maxPoints);
  }

  selectRandomAsk(askcads: Card[]): Card {
    const randomIndex = Math.floor(Math.random() * askcads.length);

    const askCardSelected = askcads[randomIndex];

    this.askCards = askcads.filter((card) => card.id !== askCardSelected.id);

    return askCardSelected;
  }

  private createAskCardForRounds(): Round[] {
    const rounds: Round[] = [];

    for (let i = 0; i < this.numberOfRounds; i++) {
      const askCard = this.selectRandomAsk(this.askCards);
      rounds.push(new Round(askCard));
    }
    return rounds;
  }
}
