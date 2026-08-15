import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../lib/types.js';
import { CHAT_MAX_LEN, Z_HUD } from '../lib/ui.js';

export interface ChatRoomProps {
  messages: ChatMessage[];
  /** Seat index of the local player, used to right-align their own lines. */
  myIndex: number;
  unread: number;
  /** Called whenever the panel is showing, so the host can clear the badge. */
  onOpen: () => void;
  onClose: () => void;
  onSend: (text: string) => void;
}

/** Table chat. Collapsed to a pill, expands into a panel. */
export function ChatRoom({ messages, myIndex, unread, onOpen, onClose, onSend }: ChatRoomProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const latest = messages[messages.length - 1];

  useEffect(() => {
    if (!isExpanded) return;
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    // While expanded, incoming messages count as read immediately.
    onOpen();
  }, [messages, isExpanded, onOpen]);

  useEffect(() => {
    if (isExpanded) inputRef.current?.focus();
  }, [isExpanded]);

  const expand = () => { setIsExpanded(true); onOpen(); };
  const collapse = () => { setIsExpanded(false); onClose(); };
  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
  };

  if (!isExpanded) {
    const previewText = latest ? `${latest.name}: ${latest.text}` : 'No messages yet';
    return (
      <button
        onClick={expand}
        title="Open chat"
        className="pill-chip pl-3 pr-2 py-1.5 flex items-center gap-2 hover:bg-[color:var(--bg-2)] transition-colors max-w-[min(55vw,320px)] relative"
        style={{ zIndex: Z_HUD, color: 'var(--fg-soft)' }}
      >
        <span className="text-[10px] uppercase tracking-[0.14em] shrink-0 font-bold" style={{ color: 'var(--accent)' }}>Chat</span>
        <span className="text-xs truncate">{previewText}</span>
        {unread > 0 && (
          <span
            className="inline-flex items-center justify-center rounded-full text-[10px] font-bold shrink-0 px-1.5"
            style={{ minWidth: 18, height: 18, background: 'var(--accent)', color: '#06121f' }}
          >
            {unread > 99 ? '99+' : unread}
          </span>
        )}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    );
  }

  return (
    <div
      className="glass-panel rounded-2xl flex flex-col w-[min(90vw,400px)]"
      style={{ zIndex: Z_HUD, color: 'var(--fg)' }}
    >
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="text-xs uppercase tracking-[0.14em] font-semibold" style={{ color: 'var(--accent)' }}>Chat</span>
        <button
          onClick={collapse}
          title="Collapse"
          className="transition-colors p-1 -mr-1 rounded hover:bg-[color:var(--bg-2)]"
          style={{ color: 'var(--dim)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
      <div
        ref={scrollRef}
        className="px-4 py-2 max-h-80 overflow-y-auto flex flex-col"
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%)' }}
      >
        <div className="mt-auto flex flex-col pt-6 gap-1.5">
          {messages.length === 0 && (
            <div className="py-3 text-[13px]" style={{ color: 'var(--dim)' }}>No messages yet. Say hi!</div>
          )}
          {messages.map(m => {
            const mine = m.playerIndex === myIndex;
            const nameColor = m.team === 0 ? 'var(--accent)' : 'var(--red)';
            return (
              <div key={m.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] uppercase tracking-[0.12em]" style={{ color: nameColor }}>
                  {mine ? 'You' : m.name}
                </span>
                <span
                  className="text-[14px] leading-snug px-3 py-1.5 rounded-xl max-w-[85%] break-words whitespace-pre-wrap"
                  style={{
                    background: mine ? 'rgba(46, 72, 108, 0.9)' : 'rgba(28, 48, 74, 0.9)',
                    border: '1px solid var(--line-soft)',
                    color: 'var(--fg)',
                  }}
                >
                  {m.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        className="flex items-center gap-2 px-3 py-2"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={CHAT_MAX_LEN}
          placeholder="Type a message..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
          name="card-class-chat"
          className="flex-1 bg-transparent outline-none text-[14px]"
          style={{ color: 'var(--fg)' }}
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
          style={{
            background: draft.trim() ? 'var(--accent)' : 'var(--bg-2)',
            color: draft.trim() ? '#06121f' : 'var(--dimmer)',
            border: '1px solid var(--line)',
            cursor: draft.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
