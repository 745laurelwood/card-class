import { Suit } from './types.js';

/**
 * Rank labels. Both ace conventions are covered: 1 for games that deal it
 * low (29, Seep) and 14 for games that deal it high (350).
 */
export const CARD_RANK_LABELS: Record<number, string> = {
  1: 'A',
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
  7: '7', 8: '8', 9: '9', 10: '10',
  11: 'J', 12: 'Q', 13: 'K',
  14: 'A',
};

export const getRankLabel = (rank: number): string => CARD_RANK_LABELS[rank] ?? '?';

export const SUIT_SYMBOLS: Record<Suit, string> = {
  [Suit.Spades]: '♠',
  [Suit.Hearts]: '♥',
  [Suit.Clubs]: '♣',
  [Suit.Diamonds]: '♦',
};

/** Tailwind text colours. Red suits read red, black suits read black. */
export const SUIT_COLORS: Record<Suit, string> = {
  [Suit.Spades]: 'text-black',
  [Suit.Hearts]: 'text-red-600',
  [Suit.Clubs]: 'text-black',
  [Suit.Diamonds]: 'text-red-600',
};

/** Left-to-right order used when laying out a hand grouped by suit. */
export const HAND_SUIT_ORDER: Record<Suit, number> = {
  [Suit.Spades]: 0,
  [Suit.Hearts]: 1,
  [Suit.Clubs]: 2,
  [Suit.Diamonds]: 3,
};

export const compareSuitForHand = (a: Suit, b: Suit): number =>
  HAND_SUIT_ORDER[a] - HAND_SUIT_ORDER[b];
