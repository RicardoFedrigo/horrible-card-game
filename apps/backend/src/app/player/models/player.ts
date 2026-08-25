import { randomUUID } from 'node:crypto';
import { Card } from '../../game/card/models/card';
import { PlayerStatus } from '../types/player-status.type';

export class Player {
  private points: number = 0;
  private cards: Card[] = [];
  private status: PlayerStatus = 'waiting';

  constructor(
    private name: string,
    private id: string = randomUUID(),
    private isAdmin: boolean = false,
  ) {
    this.name = name;
    this.isAdmin = isAdmin;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPoints(): number {
    return this.points;
  }

  getCards(): Card[] {
    return this.cards;
  }

  getStatus(): PlayerStatus {
    return this.status;
  }

  setStatus(status: PlayerStatus): void {
    this.status = status;
  }

  setPlaying(): void {
    this.status = 'playing';
  }

  addCards(cards: Card[]): void {
    this.cards.push(...cards);
  }

  removeCards(cardIds: string[]): void {
    this.cards = this.cards.filter((card) => !cardIds.includes(card.id));
  }

  addPoints(points: number = 1): void {
    this.points += points;
  }

  resetPoints(): void {
    this.points = 0;
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }

  setAdmin(): void {
    this.isAdmin = true;
  }

  removeAdmin(): void {
    this.isAdmin = false;
  }
}
