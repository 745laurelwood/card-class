/**
 * @laurelwood/card-class — the shared skin behind the Laurelwood card games.
 *
 * Styles are not imported here on purpose: a bare `import` of this module
 * should never have a side effect on the page. Pull the CSS in yourself:
 *
 *   import '@laurelwood/card-class/styles.css';
 */

// Vocabulary
export { Suit } from './lib/types.js';
export type { Card, ChatMessage } from './lib/types.js';

// Deck presentation
export {
  CARD_RANK_LABELS, getRankLabel,
  SUIT_SYMBOLS, SUIT_COLORS,
  HAND_SUIT_ORDER, compareSuitForHand,
} from './lib/deck.js';

// UI constants
export {
  Z_CARD_SELECTED, Z_HUD, Z_ACTION_BAR, Z_TURN_BADGE, Z_OVERLAY, Z_MODAL,
  TEAM_LABELS, TEAM_TEXT_COLORS, TEAM_BADGE_CLASSES,
  MAX_LOG_ENTRIES, CHAT_MAX_LEN, CHAT_MAX_HISTORY,
  PEER_ID_DISPLAY_LENGTH, EMPTY_SLOT_NAME,
  BOT_NAMES, pickBotNames,
} from './lib/ui.js';

// Cards
export { CardComponent } from './cards/CardComponent.js';
export type { CardComponentProps, SelectionTone } from './cards/CardComponent.js';
export { FaceArt } from './cards/FaceArt.js';

// Chrome
export { GameLog, LastMoveBanner, FeltFooterSlot, colorizeSuits } from './chrome/log.js';
export { ChatRoom } from './chrome/ChatRoom.js';
export type { ChatRoomProps } from './chrome/ChatRoom.js';
export {
  LobbyShell, LobbyPanel, LobbyNotice, ResumeSessionCard, SeatRow, TeamToggle,
  lobbyInputClass, lobbyInputStyle,
} from './chrome/lobby.js';

// Layout
export { TableGrid, Felt } from './layout/TableGrid.js';
export {
  PhoneFrame, PhoneHud, PhoneHudButton, PhoneScoreCell, PhoneScoreDivider,
} from './layout/PhoneFrame.js';

// Behaviour
export { flipTransition } from './lib/flip.js';
export { sounds, seq, playTone, setMuted, isMuted } from './lib/sound.js';
export type { Tone } from './lib/sound.js';
export { createSessionStore } from './lib/session.js';
export type {
  SessionStore, SessionStoreOptions, SavedSession, HostSession, ClientSession,
} from './lib/session.js';
