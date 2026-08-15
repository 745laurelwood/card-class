/** Stacking order for everything the package renders. A game that adds its
 *  own floating element should pick a number from this scale rather than
 *  inventing one, so layering stays predictable across the org. */
export const Z_CARD_SELECTED = 20;
export const Z_HUD = 40;
export const Z_ACTION_BAR = 45;
export const Z_TURN_BADGE = 50;
export const Z_OVERLAY = 60;
export const Z_MODAL = 100;

/** Two-team presentation. Games with more than two sides supply their own. */
export const TEAM_LABELS: Record<0 | 1, string> = { 0: 'A', 1: 'B' };

export const TEAM_TEXT_COLORS: Record<0 | 1, string> = {
  0: 'text-cyan-300',
  1: 'text-rose-300',
};

export const TEAM_BADGE_CLASSES: Record<0 | 1, string> = {
  0: 'bg-cyan-500/25 text-cyan-200 ring-1 ring-cyan-400/40',
  1: 'bg-rose-500/25 text-rose-200 ring-1 ring-rose-400/40',
};

/** Log and chat limits. Both cap state that would otherwise grow forever. */
export const MAX_LOG_ENTRIES = 50;
export const CHAT_MAX_LEN = 200;
export const CHAT_MAX_HISTORY = 100;

export const PEER_ID_DISPLAY_LENGTH = 6;
export const EMPTY_SLOT_NAME = 'Waiting...';

export const BOT_NAMES = [
  'CardShark', 'VelvetFox', 'MidnightOwl', 'RiverBandit', 'LuckyLoaf',
  'SilverTongue', 'CloverKnight', 'PepperPaws', 'BananaBaron', 'MapleMaverick',
  'GingerGhost', 'TangoTiger', 'WaffleWizard', 'CosmicOtter', 'MochiMonarch',
  'NeonBadger', 'PeachPhantom', 'BiscuitBandit', 'SunnyScholar', 'JollyJester',
];

/** Draws `count` distinct bot names, skipping any already at the table. */
export function pickBotNames(count: number, exclude: Iterable<string> = []): string[] {
  const taken = new Set<string>(exclude);
  const pool = BOT_NAMES.filter(n => !taken.has(n));
  const picked: string[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}
