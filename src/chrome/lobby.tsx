import React from 'react';
import { TEAM_LABELS, TEAM_TEXT_COLORS } from '../lib/ui';

/**
 * Lobby pieces, not a lobby. Every game's lobby wires up different state and
 * different callbacks, but they all draw the same panel, the same name field
 * and the same seat rows. Those are here; the flow stays in the game.
 */

export const lobbyInputClass =
  'w-full rounded-xl px-4 py-3 text-center focus:outline-none font-display font-semibold text-lg sm:text-xl transition-all';

export const lobbyInputStyle: React.CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line)',
  color: 'var(--fg)',
};

/** Full-page lobby frame: patterned background, contents centred. */
export function LobbyShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen min-h-dvh royal-bg flex items-center justify-center relative overflow-hidden px-4 py-6"
      style={{ color: 'var(--fg)' }}
    >
      {children}
    </div>
  );
}

/**
 * A glass panel inside the shell. `title` renders as the big accent heading
 * for a landing panel; a room panel that just needs a header passes `heading`
 * instead. `wide` is the roomier variant used once players are seated.
 */
export function LobbyPanel({ title, subtitle, heading, wide = false, children }: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  heading?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative z-10 glass-panel p-6 sm:p-8 rounded-2xl w-full ${wide ? 'max-w-xl' : 'max-w-md text-center'}`}>
      {title && (
        <h1 className="text-4xl sm:text-5xl font-display mb-1" style={{ color: 'var(--accent)' }}>{title}</h1>
      )}
      {subtitle && (
        <h2 className="text-xs sm:text-sm mb-7 tracking-[0.22em] uppercase" style={{ color: 'var(--dim)' }}>
          {subtitle}
        </h2>
      )}
      {heading && (
        <h2 className="text-2xl sm:text-3xl font-display text-center mb-5" style={{ color: 'var(--accent)' }}>{heading}</h2>
      )}
      {children}
    </div>
  );
}

/** Dismissible red notice, for join errors and the like. */
export function LobbyNotice({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div
      className="mb-5 p-3 rounded-xl text-left flex items-start gap-3"
      style={{ background: 'rgba(232,146,154,0.08)', border: '1px solid rgba(232,146,154,0.35)' }}
    >
      <p className="text-sm flex-1" style={{ color: 'var(--red)' }}>{message}</p>
      <button
        onClick={onDismiss}
        className="text-xs px-2 py-0.5 rounded-md transition-all"
        style={{ background: 'rgba(232,146,154,0.12)', color: 'var(--red)', border: '1px solid rgba(232,146,154,0.4)' }}
      >
        Dismiss
      </button>
    </div>
  );
}

/** Offers to pick a saved session back up, or throw it away. */
export function ResumeSessionCard({ role, roomId, playerName, onResume, onDiscard }: {
  role: 'host' | 'client';
  roomId: string;
  playerName: string;
  onResume: () => void;
  onDiscard: () => void;
}) {
  return (
    <div
      className="mb-5 p-4 rounded-xl text-left"
      style={{ background: 'rgba(111,176,255,0.06)', border: '1px solid var(--accent-soft)' }}
    >
      <p className="text-sm mb-1" style={{ color: 'var(--accent)' }}>Resume your previous session?</p>
      <p className="text-xs mb-3 font-mono" style={{ color: 'var(--fg-soft)' }}>
        {role === 'host' ? 'Host' : 'Player'} · Room {roomId} · {playerName}
      </p>
      <div className="flex gap-2">
        <button onClick={onResume} className="btn-accent flex-1 py-2 rounded-lg font-semibold text-sm">
          Resume
        </button>
        <button
          onClick={onDiscard}
          className="px-4 py-2 rounded-lg text-sm transition-all"
          style={{ background: 'var(--bg-2)', color: 'var(--fg-soft)', border: '1px solid var(--line)' }}
        >
          Discard
        </button>
      </div>
    </div>
  );
}

const TEAM_PILL_BG: Record<0 | 1, string> = {
  0: 'rgba(34, 211, 238, 0.18)',
  1: 'rgba(244, 63, 94, 0.18)',
};
const TEAM_PILL_RING: Record<0 | 1, string> = {
  0: 'rgba(34, 211, 238, 0.55)',
  1: 'rgba(244, 63, 94, 0.55)',
};

/** Two-team A/B toggle. Read-only unless `interactive`. */
export function TeamToggle({ team, interactive, onPick }: {
  team: 0 | 1;
  interactive: boolean;
  onPick: (team: 0 | 1) => void;
}) {
  return (
    <div
      className="flex items-stretch p-0.5 rounded-full shrink-0"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--line)' }}
    >
      {([0, 1] as const).map(t => {
        const active = team === t;
        return (
          <button
            key={t}
            type="button"
            disabled={!interactive || active}
            onClick={() => onPick(t)}
            aria-pressed={active}
            title={interactive ? `Switch to Team ${TEAM_LABELS[t]}` : `Team ${TEAM_LABELS[t]}`}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider transition-all ${active ? TEAM_TEXT_COLORS[t] : ''}`}
            style={{
              background: active ? TEAM_PILL_BG[t] : 'transparent',
              boxShadow: active ? `inset 0 0 0 1px ${TEAM_PILL_RING[t]}` : 'none',
              color: active ? undefined : 'var(--dim)',
              cursor: !interactive ? 'default' : (active ? 'default' : 'pointer'),
              opacity: !interactive && !active ? 0.55 : 1,
            }}
          >
            {TEAM_LABELS[t]}
          </button>
        );
      })}
    </div>
  );
}

/** One seat in the lobby list: number, name, bot tag, and whatever the game
 *  wants on the right (usually a TeamToggle). */
export function SeatRow({ seatNumber, name, isEmpty, isMe, isBot, children }: {
  seatNumber: number;
  name: string;
  isEmpty: boolean;
  isMe: boolean;
  isBot: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="p-3 rounded-xl flex items-center justify-between gap-2"
      style={{ background: 'var(--bg-1)', border: '1px solid var(--line)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center font-display text-sm shrink-0"
          style={{
            background: isEmpty ? 'var(--bg-2)' : 'var(--accent)',
            color: isEmpty ? 'var(--dim)' : '#06121f',
          }}
        >
          {seatNumber}
        </div>
        <div className="min-w-0">
          <div
            className="truncate text-sm"
            style={{ color: isEmpty ? 'var(--dim)' : 'var(--fg)', fontStyle: isEmpty ? 'italic' : 'normal' }}
          >
            {name}
            {isMe && !isEmpty && <span className="ml-1 text-[10px]" style={{ color: 'var(--dim)' }}>(you)</span>}
          </div>
          {isBot && !isEmpty && (
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--accent)' }}>Bot</div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
