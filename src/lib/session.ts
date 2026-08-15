/**
 * Reconnect memory in localStorage. A host keeps the whole game state so it
 * can rebuild the room; a client keeps only its peer id.
 *
 * The two things that differ per game are the storage key and what counts as
 * a valid saved state, so both are arguments:
 *
 *   export const { save, load, clear } = createSessionStore<GameState>({
 *     key: 'nine_session_v1',
 *     isValidState: s => Array.isArray(s.players) && !!s.gamePhase,
 *   });
 */

type Timestamped<T> = T & { savedAt: number };

export type HostSession<S> = { role: 'host'; roomId: string; playerName: string; state: S };
export type ClientSession = { role: 'client'; roomId: string; playerName: string; myPeerId: string };
export type SavedSession<S> = Timestamped<HostSession<S>> | Timestamped<ClientSession>;

export interface SessionStoreOptions {
  /** localStorage key. Namespace it per game so two games can't collide. */
  key: string;
  /** Guards against a state saved by an older, incompatible build. */
  isValidState: (state: any) => boolean;
  /** How long a saved session stays good. Defaults to 24 hours. */
  maxAgeMs?: number;
}

export interface SessionStore<S> {
  save: (session: HostSession<S> | ClientSession) => void;
  load: () => SavedSession<S> | null;
  clear: () => void;
}

const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function createSessionStore<S>(opts: SessionStoreOptions): SessionStore<S> {
  const { key, isValidState, maxAgeMs = DEFAULT_MAX_AGE_MS } = opts;

  const isValid = (s: any): s is SavedSession<S> => {
    if (!s || typeof s !== 'object') return false;
    if (typeof s.savedAt !== 'number' || typeof s.roomId !== 'string' || typeof s.playerName !== 'string') return false;
    if (s.role === 'host') return !!s.state && typeof s.state === 'object' && isValidState(s.state);
    if (s.role === 'client') return typeof s.myPeerId === 'string';
    return false;
  };

  const clear = () => {
    try { localStorage.removeItem(key); } catch {}
  };

  return {
    save: (session) => {
      try {
        localStorage.setItem(key, JSON.stringify({ ...session, savedAt: Date.now() }));
      } catch {}
    },

    load: () => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!isValid(parsed) || Date.now() - parsed.savedAt > maxAgeMs) {
          clear();
          return null;
        }
        return parsed;
      } catch {
        clear();
        return null;
      }
    },

    clear,
  };
}
