import { useEffect, useState } from 'react';
import { isFallbackReply, parseReply } from '../lib/parseReply';
import type { Chat, Message } from '../lib/useChat';
import { useStickToBottom } from '../lib/useStickToBottom';
import { site } from '../site.config';
import { Composer } from './Composer';
import { SparkFilled } from './Icons';
import { Markdown } from './Markdown';
import { ProjectCards, ProjectsLoading } from './ProjectCards';

interface ChatViewProps {
  chat: Chat;
  onContact: (question?: string) => void;
}

function Welcome({ onPick }: { onPick: (question: string) => void }) {
  return (
    <div className="welcome col">
      <div className="welcome__tile">
        <SparkFilled />
      </div>
      <h1>Hi I'm {site.name}</h1>
      <p>{site.tagline}</p>
      <div className="suggestions">
        {site.suggestions.map((question) => (
          <button type="button" key={question} className="suggestion" onClick={() => onPick(question)}>
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

const SLOW_AFTER_MS = 9000;

function Thinking() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="thinking">
      <span className="thinking__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {slow ? 'Still thinking…' : 'Thinking…'}
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

function Reply({ message, question, canRetry, onRetry, onContact }: ReplyProps) {
  const { text, after, projects, projectsLoading } = parseReply(message.content);
  const streaming = message.status === 'streaming';
  const nothingYet = !text && projects.length === 0 && !projectsLoading;

  return (
    <article className="msg msg--reply">
      <span className="msg__mark" aria-hidden="true">
        <SparkFilled />
      </span>
      <div className="msg__body">
        {streaming && nothingYet && <Thinking />}
        {text && <Markdown>{text}</Markdown>}
        {streaming && projectsLoading && <ProjectsLoading />}
        {projects.length > 0 && <ProjectCards projects={projects} />}
        {after && <Markdown>{after}</Markdown>}

        {message.status === 'stopped' && <p className="msg__note">Stopped</p>}

        {message.status === 'error' && (
          <div className="msg__error" role="alert">
            <p>{message.error}</p>
            {canRetry && (
              <button type="button" className="chip" onClick={onRetry}>
                Try again
              </button>
            )}
          </div>
        )}

        {message.status === 'done' && isFallbackReply(text) && (
          <button type="button" className="chip" onClick={() => onContact(question)}>
            Send me a message
          </button>
        )}
      </div>
    </article>
  );
}

function Thread({ chat, onContact }: ChatViewProps) {
  const { messages, busy, retry } = chat;
  const { scrollRef, onScroll } = useStickToBottom(messages.length);

  return (
    <div className="scroll" ref={scrollRef} onScroll={onScroll}>
      <div className="thread col" role="log" aria-live="polite" aria-busy={busy}>
        {messages.map((message, index) =>
          message.role === 'user' ? (
            <div className="msg msg--user" key={message.id}>
              <p>{message.content}</p>
            </div>
          ) : (
            <Reply
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
  );
}

export function ChatView({ chat, onContact }: ChatViewProps) {
  return (
    <>
      {chat.messages.length === 0 ? <Welcome onPick={chat.send} /> : <Thread chat={chat} onContact={onContact} />}
      <div className="dock">
        <div className="col">
          <Composer busy={chat.busy} onSend={chat.send} onStop={chat.stop} />
        </div>
      </div>
    </>
  );
}
