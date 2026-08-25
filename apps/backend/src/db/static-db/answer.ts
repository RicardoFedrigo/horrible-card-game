import { ANSWERS_PT_BR } from './pt-br/answers-pt-br';
import { isPortuguese } from './language';

const ANSWERS_EN: string[] = [
  'A bag of magic beans.',
  'A balanced breakfast.',
  'A big black dick.',
  'A windmill full of corpses.',
  'Being on fire.',
  'Vigilante justice.',
  'A mime having a stroke.',
  'Teenage pregnancy.',
  'A micropig wearing a tiny raincoat.',
  'Science.',
  'Praying the gay away.',
  'Flying robots that kill people.',
  'Soup that is too hot.',
  'A disappointing birthday party.',
  'The inevitable heat death of the universe.',
  'A really cool hat.',
  'Dropping a chandelier on your enemies.',
  'The profoundly handicapped.',
  'Agriculture.',
  'A falcon with a cap on its head.',
  'The void.',
  'Gloryholes.',
  'Mutually assured destruction.',
  'An honest cop with nothing left to lose.',
  'Spontaneous human combustion.',
  'Yeast.',
  'The Pope.',
];

export class Answer {
  static getAll(language: string = 'en'): string[] {
    return isPortuguese(language) ? ANSWERS_PT_BR : ANSWERS_EN;
  }
}
