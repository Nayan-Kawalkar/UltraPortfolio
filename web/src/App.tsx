import { useState } from 'react';
import { ChatView } from './components/ChatView';
import { ContactDialog } from './components/ContactDialog';
import { MenuIcon } from './components/Icons';
import { ModeToggle, type Mode } from './components/ModeToggle';
import { Sidebar } from './components/Sidebar';
import { TerminalView } from './components/TerminalView';
import { useChat } from './lib/useChat';

const MODE_KEY = 'ask-mode';

function readMode(): Mode {
  try {
    return localStorage.getItem(MODE_KEY) === 'terminal' ? 'terminal' : 'chat';
  } catch {
    return 'chat';
  }
}

export default function App() {
  const chat = useChat();
  const [mode, setMode] = useState<Mode>(readMode);
  const [navOpen, setNavOpen] = useState(false);
  const [contact, setContact] = useState<{ open: boolean; question?: string }>({ open: false });

  const changeMode = (next: Mode) => {
    setMode(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      // The choice just won't be remembered next visit.
    }
  };

  const openContact = (question?: string) => {
    setNavOpen(false);
    setContact({ open: true, question });
  };

  const atWelcome = mode === 'chat' && chat.messages.length === 0;

  return (
    <div className="app">
      <Sidebar
        open={navOpen}
        busy={chat.busy}
        onClose={() => setNavOpen(false)}
        onNewChat={() => {
          setNavOpen(false);
          chat.reset();
        }}
        onAskProject={(name) => {
          setNavOpen(false);
          chat.send(`Tell me about your ${name} project`);
        }}
        onContact={() => openContact()}
      />

      <main className="main" data-view={atWelcome ? 'welcome' : 'thread'}>
        <header className="topbar">
          <div className="topbar__inner col">
            <button type="button" className="icon-btn menu-btn" aria-label="Open menu" onClick={() => setNavOpen(true)}>
              <MenuIcon />
            </button>
            <ModeToggle mode={mode} onChange={changeMode} />
          </div>
        </header>

        {mode === 'chat' ? (
          <ChatView chat={chat} onContact={openContact} />
        ) : (
          <TerminalView chat={chat} onContact={openContact} onExit={() => changeMode('chat')} />
        )}
      </main>

      <ContactDialog
        open={contact.open}
        question={contact.question}
        sessionId={chat.sessionId.current}
        onClose={() => setContact({ open: false })}
      />
    </div>
  );
}
