import { isPortuguese } from './language';

const MESSAGES_EN: string[] = [
  '{name} wins! The very Adolf Hitler — but somehow worse than Stalin.',
  '{name} is the winner. Proof that humanity is doomed.',
  '{name} takes the crown. The bar has never been lower.',
  '{name} is the champion. Even their own mother is ashamed.',
  '{name} wins. A genuine disgrace to the species.',
  '{name} is the winner. Somewhere, Darwin is crying.',
  '{name} wins. You should all be deeply, deeply disappointed.',
  '{name} is the winner. History will forget you, but the smell will remain.',
  '{name} wins. The sewer you crawled out of is proud.',
  '{name} is the champion. Bad taste has a new king.',
];

const MESSAGES_PT_BR: string[] = [
  '{name} venceu! O próprio Adolf Hitler — mas pior que Stalin.',
  '{name} é o vencedor. A prova de que a humanidade está perdida.',
  '{name} levou a coroa. A barra nunca esteve tão baixa.',
  '{name} é o campeão. Nem a própria mãe tem orgulho.',
  '{name} venceu. Uma verdadeira vergonha para a espécie.',
  '{name} é o ganhador. Em algum lugar, Darwin está chorando.',
  '{name} venceu. Vocês deveriam estar profundamente envergonhados.',
  '{name} é o vencedor. A história vai te esquecer, mas o cheiro fica.',
  '{name} venceu. O esgoto de onde você saiu está orgulhoso.',
  '{name} é o campeão. O mau gosto tem um novo rei.',
];

export class WinnerMessages {
  static getAll(language: string = 'en'): string[] {
    return isPortuguese(language) ? MESSAGES_PT_BR : MESSAGES_EN;
  }

  static getRandom(language: string = 'en', winnerName: string): string {
    const messages = WinnerMessages.getAll(language);
    const template =
      messages[Math.floor(Math.random() * messages.length)] ?? messages[0];
    return template.replace('{name}', winnerName);
  }
}
