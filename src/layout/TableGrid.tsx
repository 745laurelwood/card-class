import React from 'react';

/**
 * Desktop table: five seats laid out around a felt centre.
 *
 * The grid areas and their sizing live in table.css, so a game retunes the
 * gutters by setting --grid-side / --grid-top / --grid-bottom rather than
 * reaching into this component.
 */
export function TableGrid({ top, left, right, bottom, children, className = '' }: {
  /** Opposite seat. For 5- and 6-player tables, wrap several in a `top-strip`. */
  top?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  /** The local player's own hand. */
  bottom?: React.ReactNode;
  /** The felt itself. */
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`game-grid royal-bg ${className}`}>
      <div className="game-area-top flex items-start justify-center pt-3 sm:pt-4">{top}</div>
      <div className="game-area-left flex items-center justify-center">{left}</div>
      <div className="game-area-center flex items-stretch justify-center px-2 sm:px-4 pt-2 sm:pt-3 pb-4 sm:pb-6 min-h-0 min-w-0">
        {children}
      </div>
      <div className="game-area-right flex items-center justify-center">{right}</div>
      <div className="game-area-bottom flex items-end justify-center pt-3 sm:pt-4 pb-4 sm:pb-6">{bottom}</div>
    </div>
  );
}

/**
 * The felt surface at the centre of the table. Anything absolutely
 * positioned inside it (badges, the last-move banner) anchors to this.
 */
export function Felt({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative w-full max-w-5xl h-full table-felt rounded-[1.25rem] sm:rounded-[2rem] flex items-center justify-center p-3 sm:p-6 min-h-0 ${className}`}
      style={{ border: '1px solid var(--line)', boxShadow: '0 18px 40px rgba(0,0,0,0.55), inset 0 0 40px rgba(0,0,0,0.45)' }}
    >
      <div
        className="absolute inset-2 rounded-[1rem] sm:rounded-[1.5rem] pointer-events-none"
        style={{ border: '1px solid rgba(111,176,255,0.05)' }}
      />
      {children}
    </div>
  );
}
