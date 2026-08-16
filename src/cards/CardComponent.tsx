import React from 'react';
import { Card } from '../lib/types.js';
import { SUIT_COLORS, SUIT_SYMBOLS, getRankLabel } from '../lib/deck.js';
import { Z_CARD_SELECTED } from '../lib/ui.js';
import { FaceArt } from './FaceArt.js';

/** Colour a game can pull the selection ring towards. */
export type SelectionTone = 'accent' | 'red' | 'gold';

const SELECTION_TONES: Record<SelectionTone, { ring: string; glow: string; wash: string }> = {
  accent: { ring: 'var(--accent)', glow: 'rgba(111,176,255,0.45)', wash: 'rgba(111,176,255,0.12)' },
  red:    { ring: 'var(--red)',    glow: 'rgba(232,146,154,0.90)', wash: 'rgba(232,146,154,0.12)' },
  gold:   { ring: 'var(--gold)',   glow: 'rgba(216,176,97,0.55)',  wash: 'rgba(216,176,97,0.12)' },
};

export interface CardComponentProps {
  card: Card;
  onClick?: (e: React.MouseEvent) => void;
  /** Lifts and rings the card. */
  isSelected?: boolean;
  /** Adds the hover lift that marks a card as legal to play. */
  isPlayable?: boolean;
  /** Greys the card out without hiding it — an illegal move, not a hidden one. */
  isDimmed?: boolean;
  /** Which colour the selection ring pulls towards. Defaults to the accent. */
  selectionTone?: SelectionTone;
  /**
   * Extra ring/border classes for game-specific framing, such as marking a
   * card as part of a built pile. Applied on top of the base ring.
   */
  frameClassName?: string;
  className?: string;
  faceDown?: boolean;
  small?: boolean;
  /**
   * Overrides the FLIP handle. Defaults to the card id, which is what you
   * want unless the same card is rendered in two places at once.
   */
  flipId?: string;
}

/**
 * A single playing card, face-up or face-down.
 *
 * Every card carries a `data-card-id`, which is what `flipTransition` keys
 * off to animate a card from one place on the table to another.
 */
export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  onClick,
  isSelected = false,
  isPlayable = false,
  isDimmed = false,
  selectionTone = 'accent',
  frameClassName = '',
  className = '',
  faceDown = false,
  small = false,
  flipId,
}) => {
  const label = getRankLabel(card.rank);
  const colorClass = SUIT_COLORS[card.suit];
  const symbol = SUIT_SYMBOLS[card.suit];
  const sizeClass = small
    ? 'w-10 h-14 text-xs'
    : 'w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28 lg:w-24 lg:h-36';
  const flipAttr = flipId ?? card.id;
  const tone = SELECTION_TONES[selectionTone];

  if (faceDown) {
    return (
      <div
        data-card-id={flipAttr}
        className={`
          relative rounded-lg card-shadow card-transition
          ${sizeClass} flex items-center justify-center overflow-hidden
          ${frameClassName}
          ${className}
        `}
        style={{
          background: 'linear-gradient(155deg, #182335 0%, #0c121c 60%, #131a26 100%)',
          border: '1px solid rgba(111,176,255,0.18)',
        }}
      >
        <div className="absolute inset-1 rounded" style={{ border: '1px solid rgba(111,176,255,0.08)' }} />
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-scales.png')" }}
        />
        <div className="absolute text-3xl font-display" style={{ color: 'rgba(111,176,255,0.22)' }}>♠</div>
      </div>
    );
  }

  // Tailwind can't build a ring colour out of a runtime value, so the
  // selection tone rides in through the ring custom property instead.
  const faceStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, #faf9f5 0%, #ece8de 100%)',
    ...(isDimmed ? { filter: 'grayscale(1) brightness(0.55)' } : {}),
    ...(isSelected ? {
      zIndex: Z_CARD_SELECTED,
      boxShadow: `0 6px 14px ${tone.glow}`,
      ['--tw-ring-color' as any]: tone.ring,
    } : {}),
  };

  return (
    <div
      onClick={onClick}
      data-card-id={flipAttr}
      style={faceStyle}
      className={`
        relative rounded-lg card-shadow select-none card-transition
        ${sizeClass}
        ${onClick ? 'cursor-pointer' : ''}
        ${isSelected ? 'ring-2 card-selected' : 'ring-1 ring-black/10'}
        ${isPlayable && !isSelected ? 'card-playable' : ''}
        ${frameClassName}
        flex flex-col justify-between p-1 sm:p-1.5
        ${className}
      `}
    >
      <div className={`${small ? 'text-xs' : 'text-[13px] sm:text-base'} ${colorClass} leading-none font-display`}>
        {label}<br />{symbol}
      </div>

      {!small && (
        <div className={`absolute inset-0 flex items-center justify-center ${colorClass} pointer-events-none`}>
          {card.rank >= 11 && card.rank <= 13 ? (
            <FaceArt rank={card.rank} className="h-[68%] w-auto" />
          ) : (
            <span className="text-2xl sm:text-3xl md:text-4xl">{symbol}</span>
          )}
        </div>
      )}

      <div className={`${small ? 'text-xs' : 'text-[13px] sm:text-base'} ${colorClass} leading-none self-end rotate-180 font-display`}>
        {label}<br />{symbol}
      </div>

      {isSelected && (
        <div className="absolute inset-0 rounded-lg pointer-events-none" style={{ background: tone.wash }} />
      )}
    </div>
  );
};
