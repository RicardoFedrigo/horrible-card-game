import { Card } from '../../card/models/card';
import { CardRound } from '../../card/types/card-round.type';

export class Round {
  private cardsSelected: Map<string, CardRound>;
  private askCard: Card;

  constructor(askCard: Card) {
    this.cardsSelected = new Map<string, CardRound>();
    this.askCard = askCard;
  }

  selectedCard(playerId: string, card: CardRound): void {
    this.cardsSelected.set(playerId, card);
  }

  addPointTocard(playerId: string): void {
    const card = this.cardsSelected.get(playerId);
    if (!card) {
      throw new Error('Player has not selected a card');
    }

    card.points += 1;
  }

  getCardsOptions(): CardRound[] {
    return Array.from(this.cardsSelected.values());
  }

  endRound(): string[] {
    const playerWinners: string[] = [];
    const maxPoints = Math.max(
      ...Array.from(this.cardsSelected.values()).map((card) => card.points),
    );

    this.cardsSelected.forEach((card, playerId) => {
      if (card.points === maxPoints) {
        playerWinners.push(playerId);
      }
    });

    return playerWinners;
  }
  getAskCard(): Card {
    return this.askCard;
  }
}
