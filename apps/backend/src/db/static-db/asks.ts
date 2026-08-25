import { ASKS_PT_BR } from './pt-br/asks-pt-br';
import { isPortuguese } from './language';

export type AskCardData = {
  text: string;
  pick: number;
};

const ASKS_EN: AskCardData[] = [
  { text: "What is Batman's guilty pleasure?", pick: 1 },
  { text: 'What ended my last relationship?', pick: 1 },
  { text: "What's the next Happy Meal toy?", pick: 1 },
  { text: "What's my secret talent?", pick: 1 },
  { text: 'What gives me uncontrollable gas?', pick: 1 },
  { text: "What's the most emo way to express my feelings?", pick: 1 },
  { text: 'What would grandma find disturbing, yet oddly charming?', pick: 1 },
  { text: 'What never fails to liven up the party?', pick: 1 },
  { text: "What's the gift that keeps on giving?", pick: 1 },
  { text: 'What did I bring back from Mexico?', pick: 1 },
  { text: "What's there a ton of in heaven?", pick: 1 },
  { text: 'What helps Obama unwind?', pick: 1 },
  {
    text: 'What will I bring back in time to convince people that I am a powerful wizard?',
    pick: 2,
  },
  { text: 'What is the most horrific way to die?', pick: 1 },
  { text: "What's the most controversial thing on my resume?", pick: 1 },
  { text: "What's a girl's best friend?", pick: 1 },
  { text: 'What are my parents hiding from me?', pick: 2 },
  { text: "What's the most useless superpower?", pick: 1 },
  { text: "What's my spirit animal?", pick: 1 },
  { text: "What's the worst thing to say during a job interview?", pick: 3 },
];

export class Asks {
  getAll(language: string = 'en'): AskCardData[] {
    return isPortuguese(language) ? ASKS_PT_BR : ASKS_EN;
  }
}
