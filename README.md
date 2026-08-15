# card-class

The shared skin behind the Laurelwood card games. Design tokens, card rendering, the table layout, and the chrome that sits around them.

Three games — [29](https://github.com/745laurelwood/29), [seep](https://github.com/745laurelwood/seep) and [350](https://github.com/745laurelwood/350) — grew from the same copy-pasted frontend and drifted apart in the usual way. The felt, the cards, the log, the chat and the lobby were the same in all three; a fix in one never reached the other two. This is that common half, kept in one place.

## Install

```bash
npm i github:745laurelwood/card-class#v0.1.0
```

Pin the tag. Each game upgrades when it wants to, and nothing moves under a game that isn't looking.

The package builds itself on install, so nothing extra is needed in CI. `npm ci` is enough.

## Setup

Two things have to be on the page, because the components lean on both. Tailwind supplies the utility classes, and the two fonts back `.font-display` and the body text:

```html
<script src="https://cdn.tailwindcss.com"></script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
```

Then pull the stylesheet in once, as early as you can:

```ts
import '@laurelwood/card-class/styles.css';
```

Importing the module itself never touches the page. The CSS import is the only side effect, and it is yours to make.

## What you get

**Styles.** `tokens.css` holds every colour, font and safe-area inset. `table.css` has the felt, the glass panels, the pill chips, the accent button, the hand scroller and the desktop grid. `mobile.css` has the whole phone layout. Take all three through `styles.css`, or import them separately.

**Cards.** `CardComponent` draws a card face-up or face-down, and `FaceArt` draws the J/Q/K line art. Both ace conventions are understood: rank 1 and rank 14 both label as `A`.

**Chrome.** `GameLog`, `ChatRoom`, `LastMoveBanner`, and the `colorizeSuits` helper that tints ♥/♦ mentions red.

**Layout.** `TableGrid` and `Felt` for desktop, `PhoneFrame` and its HUD parts for mobile.

**Lobby pieces.** `LobbyShell`, `LobbyNotice`, `ResumeSessionCard`, `SeatRow`, `TeamToggle`. Pieces rather than a whole lobby, because every game wires up different state behind the same panel.

**Behaviour.** `flipTransition` for FLIP card animation, `sounds` for the Web Audio cues, and `createSessionStore` for reconnect memory.

## Customising

Every colour is a custom property on `:root`, so a game recolours itself by redefining the ones it wants after the import:

```css
:root {
  --accent: #d8b061;
  --felt:   #123024;
}
```

The desktop grid has three more, for games that want tighter gutters or a shorter hand tray:

```css
:root {
  --grid-side:   minmax(80px, 1fr);
  --grid-top:    minmax(0, auto);
  --grid-bottom: minmax(0, auto);
  --hand-scroll-padding: 22px 12px 6px;
}
```

`CardComponent` takes a `selectionTone` of `accent`, `red` or `gold` for the ring on a selected card, and a `frameClassName` for game-specific framing such as marking a card as part of a built pile.

## Starting a new game from it

There is no scaffolding command. Install the package, put the two head tags in `index.html`, import the stylesheet, and build the game against `TableGrid` + `Felt` on desktop and `PhoneFrame` on mobile. What is left to write is the reducer, the rules and the seating — which is the part that should differ.

## Releasing

Games install by tag, so a change is only live once it is tagged.

```bash
npm run typecheck
npm run build
git tag v0.2.0 && git push origin v0.2.0
```

Then bump the dependency in whichever game wants it. A game left on an older tag keeps working.
