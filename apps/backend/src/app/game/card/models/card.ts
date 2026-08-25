import { CardType } from "../types/card-type.type";
import { randomUUID } from "node:crypto";

export class Card {
    id: string;
    cardType: CardType;
    text: string;
    pick: number;

    constructor(cardType: CardType, text: string, pick: number = 1) {
        this.id = randomUUID();
        this.cardType = cardType;
        this.text = text;
        this.pick = pick;
    }
}
