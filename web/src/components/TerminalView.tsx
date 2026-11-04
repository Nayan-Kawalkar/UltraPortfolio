import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { isFallbackReply, parseReply } from '../lib/parseReply';
import type { Chat, Message } from '../lib/useChat';
import { useStickToBottom } from '../lib/useStickToBottom';
import { site } from '../site.config';
import { Markdown } from './Markdown';

interface TerminalViewProps {
  chat: Chat;
  onContact: (question?: string) => void;
  onExit: () => void;
}

const handle = site.name.toLowerCase();
const PROMPT = `visitor@${handle}:~$`;

function banner(title: string): string {
  const inner = `  ${title}  `;
  const bar = '═'.repeat(inner.length);
  return `╔${bar}╗\n║${inner}║\n╚${bar}╝`;
}

function Intro({ onPick }: { onPick: (question: string) => void }) {
  return (
    <div className="term__intro">
      <pre className="term__banner" aria-hidden="true">
        {banner(`ask-${handle}`)}
      </pre>
      <p>{site.tagline}</p>
      <ol className="term__picks">
        {site.suggestions.map((question, index) => (
          <li key={question}>
            <button type="button" onClick={() => onPick(question)}>
              <span>[{index + 1}]</span> {question}
            </button>
          </li>
        ))}
      </ol>
      <p className="term__hint">
        Type a number or a question. Commands: <kbd>clear</kbd> <kbd>contact</kbd> <kbd>chat</kbd>
      </p>
    </div>
  );
}

interface ReplyProps {
  message: Message;
  question?: string;
  canRetry: boolean;
  onRetry: () => void;
  onContact: (question?: string) => void;
}

function TermReply({ message, question, canRetry, onRetry, onContact }: ReplyProps) {
  const { text, after, projects, projectsLoading } = parseReply(message.content);
  const streaming = message.status === 'streaming';

  return (
    <div className="term__reply">
      {streaming && !text && <p className="term__dim">{projectsLoading ? 'loading projects' : 'thinking'}<i className="cursor" /></p>}
      {text && <Markdown>{text}</Markdown>}

      {projects.length > 0 && (
        <ol className="term__projects">
          {projects.map((project, index) => (
            <li key={project.title}>
              <span className="term__dim">[{index + 1}]</span> <strong>{project.title}</strong>
              {project.description && <p>{project.description}</p>}
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  {project.link}
                </a>
              )}
            </li>
          ))}
        </ol>
      )}

      {after && <Markdown>{after}</Markdown>}
      {streaming && text && !projectsLoading && <i className="cursor" />}
      {message.status === 'stopped' && <p className="term__dim">^C</p>}

      {message.status === 'error' && (
        <p className="term__error" role="alert">
          error: {message.error}{' '}
          {canRetry && (
            <button type="button" onClick={onRetry}>
              [retry]
            </button>
          )}
        </p>
      )}

      {message.status === 'done' && isFallbackReply(text) && (
        <button type="button" className="term__action" onClick={() => onContact(question)}>
          [send me a message]
        </button>
      )}
    </div>
  );
}

export function TerminalView({ chat, onContact, onExit }: TerminalViewProps) {
  const { messages, busy, send, retry, stop, reset } = chat;
  const { scrollRef, onScroll } = useStickToBottom(messages.length);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
  }, []);

  const run = () => {
    const command = value.trim();
    if (!command || busy) return;
    setValue('');

    if (command === 'clear') return reset();
    if (command === 'contact') return onContact();
    if (command === 'chat') return onExit();
    send(site.suggestions[Number(command) - 1] ?? command);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey && event.key === 'c' && busy) {
      event.preventDefault();
      stop();
    }
    if (event.ctrlKey && event.key === 'l') {
      event.preventDefault();
      reset();
    }
  };

  return (
    <>
      <div
        className="scroll term"
        ref={scrollRef}
        onScroll={onScroll}
        onClick={() => {
          // Clicking the screen refocuses the prompt, unless the visitor is selecting text.
          if (!window.getSelection()?.toString()) inputRef.current?.focus();
        }}
      >
        <div className="col" role="log" aria-live="polite" aria-busy={busy}>
          <Intro onPick={send} />
          {messages.map((message, index) =>
            message.role === 'user' ? (
              <p className="term__cmd" key={message.id}>
                <span>{PROMPT}</span> {message.content}
              </p>
            ) : (
              <TermReply
                key={message.id}
                message={message}
                question={messages[index - 1]?.content}
                canRetry={!busy && index === messages.length - 1}
                onRetry={retry}
                onContact={onContact}
              />
            ),
          )}
        </div>
      </div>

      <div className="dock">
        <div className="col">
          <form
            className="term-prompt"
            onSubmit={(event) => {
              event.preventDefault();
              run();
            }}
          >
            <label htmlFor="term-input">{PROMPT}</label>
            <input
              id="term-input"
              ref={inputRef}
              value={value}
              maxLength={2000}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="send"
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyDown}
            />
            {busy && (
              <button type="button" className="term-prompt__stop" onClick={stop}>
                ^C stop
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
