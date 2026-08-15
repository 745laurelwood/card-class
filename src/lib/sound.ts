/**
 * Tiny Web Audio cue engine. No samples, no assets: every sound is a couple
 * of oscillator tones, so it costs nothing to ship and never 404s.
 *
 * The package owns the engine and the cues every card game needs. A game
 * with its own moments composes on top:
 *
 *   import { sounds as base, seq } from '@laurelwood/card-class';
 *   export const sounds = {
 *     ...base,
 *     royals: () => seq([{ freq: 523, dur: 0.12 }, { freq: 659, dur: 0.12, delay: 0.1 }]),
 *   };
 */

export type Tone = {
  freq: number;
  dur: number;
  type?: OscillatorType;
  delay?: number;
  gain?: number;
};

let ctx: AudioContext | null = null;
let muted = false;

const ensureCtx = (): AudioContext | null => {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
};

/** Plays one tone. Silently does nothing when muted or unsupported. */
export const playTone = (t: Tone) => {
  if (muted) return;
  const c = ensureCtx();
  if (!c) return;
  try {
    const start = c.currentTime + (t.delay || 0);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = t.type || 'sine';
    osc.frequency.setValueAtTime(t.freq, start);
    const peak = t.gain ?? 0.08;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + t.dur);
    osc.connect(gain).connect(c.destination);
    osc.start(start);
    osc.stop(start + t.dur + 0.02);
  } catch {}
};

/** Plays a run of tones. Use `delay` on each to space them out. */
export const seq = (tones: Tone[]) => tones.forEach(playTone);

/** The cues every card game at this table needs. */
export const sounds = {
  // Soft low thud — card dropped to the table
  throwCard: () => seq([{ freq: 196, dur: 0.09, type: 'triangle', gain: 0.08 }]),

  // Bright two-note ping — cards swept to a winner
  capture: () => seq([
    { freq: 523, dur: 0.08, type: 'sine', gain: 0.09 },
    { freq: 784, dur: 0.14, type: 'sine', gain: 0.09, delay: 0.07 },
  ]),

  // Clean bell — a bid or other commitment locked in
  bid: () => seq([{ freq: 880, dur: 0.22, type: 'sine', gain: 0.08 }]),

  // Rising triangle dyad — something hidden became known
  reveal: () => seq([
    { freq: 392, dur: 0.10, type: 'triangle', gain: 0.08 },
    { freq: 587, dur: 0.14, type: 'triangle', gain: 0.08, delay: 0.08 },
  ]),

  // Ascending triad — a big scoring event
  fanfare: () => seq([
    { freq: 523, dur: 0.12, type: 'sine', gain: 0.1 },
    { freq: 659, dur: 0.12, type: 'sine', gain: 0.1, delay: 0.10 },
    { freq: 784, dur: 0.24, type: 'sine', gain: 0.1, delay: 0.20 },
  ]),

  // Tiny tick — card dealt
  deal: () => seq([{ freq: 1400, dur: 0.025, type: 'square', gain: 0.04 }]),

  // Soft two-note chime — chat message received
  chat: () => seq([
    { freq: 660, dur: 0.08, type: 'sine', gain: 0.06 },
    { freq: 990, dur: 0.12, type: 'sine', gain: 0.06, delay: 0.07 },
  ]),
};

export const setMuted = (m: boolean) => { muted = m; };
export const isMuted = () => muted;
