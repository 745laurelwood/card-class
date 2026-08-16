/** The card vocabulary every game in the org already shares verbatim. */

export enum Suit {
  Spades = 'S',
  Hearts = 'H',
  Clubs = 'C',
  Diamonds = 'D',
}

export interface Card {
  /** Which suit the card belongs to. */
  suit: Suit;
  /**
   * Rank as a number. Games disagree on the ace: 29 and Seep deal it as 1,
   * 350 deals it high as 14. Both are understood throughout the package.
   */
  rank: number;
  /** Stable identity, used as the React key and the FLIP animation handle. */
  id: string;
}

/** One line of table chat. */
export interface ChatMessage {
  id: string;
  playerIndex: number;
  name: string;
  /**
   * Sender's team, used to tint their name. Optional: 350 calls partners
   * mid-round rather than seating fixed teams, so its messages carry no
   * team and the name renders in the neutral accent.
   */
  team?: 0 | 1;
  text: string;
  ts: number;
}
