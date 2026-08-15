import React from 'react';

/**
 * Mobile shell: HUD, opponents, felt and hand tray stacked into one viewport
 * with nothing but the hand able to scroll. The `m-` classes it relies on
 * are in mobile.css.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return <div className="m-phone">{children}</div>;
}

/** Top bar of the phone layout. Holds the score cells and icon buttons. */
export function PhoneHud({ children }: { children: React.ReactNode }) {
  return (
    <header className="m-hud">
      <div className="m-hud-bar">{children}</div>
    </header>
  );
}

/** One score cell in the phone HUD. `tone` picks the colour it reads in. */
export function PhoneScoreCell({ label, value, tone = 'a', active = false }: {
  label: React.ReactNode;
  value: React.ReactNode;
  tone?: 'a' | 'b' | 'gold' | 'dim';
  active?: boolean;
}) {
  const toneClass = tone === 'a' ? '' : tone;
  return (
    <div className={`m-hs-cell ${toneClass} ${active ? 'active' : ''}`.trim()}>
      <span className="label">{label}</span>
      <span className="v">{value}</span>
    </div>
  );
}

export function PhoneScoreDivider() {
  return <div className="m-hs-divider" />;
}

/** Icon button in the phone HUD (home, sound, log, chat). */
export function PhoneHudButton({ onClick, title, children, className = '' }: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button className={`m-hud-btn ${className}`.trim()} onClick={onClick} title={title} aria-label={title}>
      {children}
    </button>
  );
}
