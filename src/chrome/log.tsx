import React, { useState } from 'react';
import { Z_HUD } from '../lib/ui.js';

/**
 * Walks a log string and wraps ♥/♦ glyphs in a red span so card mentions
 * read as cards. Everything else passes through verbatim.
 */
export function colorizeSuits(text: string): React.ReactNode {
  if (!text) return text;
  const out: React.ReactNode[] = [];
  let buf = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '♥' || ch === '♦') {
      if (buf) { out.push(buf); buf = ''; }
      out.push(<span key={i} style={{ color: 'var(--red)' }}>{ch}</span>);
    } else {
      buf += ch;
    }
  }
  if (buf) out.push(buf);
  return out;
}

/**
 * Shared shell for anything pinned to the bottom edge of the felt. The
 * banner and any game-specific prompt that replaces it sit in the same
 * slot, so they can't fight over the space.
 */
export function FeltFooterSlot({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="last-move-banner-wrap absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 max-w-[92vw]"
      style={{ zIndex: Z_HUD + 5 }}
    >
      {children}
    </div>
  );
}

/** "Last move" banner, pinned to the bottom edge of the table felt. */
export function LastMoveBanner({ message }: { message: string }) {
  return (
    <FeltFooterSlot>
      <div
        className="last-move-banner pill-chip rounded-full px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2 whitespace-nowrap overflow-hidden"
        style={{ background: 'var(--bg-2)' }}
      >
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.14em] font-bold shrink-0" style={{ color: 'var(--accent)' }}>Last</span>
        <span className="text-xs sm:text-sm truncate" style={{ color: 'var(--fg-soft)' }}>{colorizeSuits(message)}</span>
      </div>
    </FeltFooterSlot>
  );
}

const Chevron = ({ up = false }: { up?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={up ? 'h-4 w-4' : 'h-3.5 w-3.5 shrink-0 opacity-60'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={up ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
  </svg>
);

/** Collapsed pill showing the latest entry; expands into a scrollable panel. */
export function GameLog({ entries, logEndRef }: {
  entries: string[];
  logEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const latest = entries[entries.length - 1] ?? '';

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        title="Show game log"
        className="pill-chip pl-3 pr-2 py-1.5 flex items-center gap-2 hover:bg-[color:var(--bg-2)] transition-colors max-w-[min(55vw,320px)]"
        style={{ zIndex: Z_HUD, color: 'var(--fg-soft)' }}
      >
        <span className="text-[10px] uppercase tracking-[0.14em] shrink-0 font-bold" style={{ color: 'var(--accent)' }}>Log</span>
        <span className="text-xs truncate">{colorizeSuits(latest)}</span>
        <Chevron />
      </button>
    );
  }

  return (
    <div
      className="glass-panel rounded-2xl flex flex-col w-[min(90vw,380px)]"
      style={{ zIndex: Z_HUD, color: 'var(--fg)' }}
    >
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="text-xs uppercase tracking-[0.14em] font-semibold" style={{ color: 'var(--accent)' }}>Game Log</span>
        <button
          onClick={() => setIsExpanded(false)}
          title="Collapse"
          className="transition-colors p-1 -mr-1 rounded hover:bg-[color:var(--bg-2)]"
          style={{ color: 'var(--dim)' }}
        >
          <Chevron up />
        </button>
      </div>
      <div
        className="px-4 py-2 max-h-72 overflow-y-auto flex flex-col"
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%)' }}
      >
        <div className="mt-auto flex flex-col pt-6">
          {entries.map((log, i) => {
            const isLatest = i === entries.length - 1;
            return (
              <div
                key={i}
                className="py-2 leading-snug animate-fade-in text-[13px]"
                style={{
                  color: isLatest ? 'var(--fg)' : 'var(--fg-soft)',
                  borderBottom: i < entries.length - 1 ? '1px solid var(--line-soft)' : 'none',
                }}
              >
                {colorizeSuits(log)}
              </div>
            );
          })}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
