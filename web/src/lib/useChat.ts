import { useCallback, useRef, useState } from 'react';
import { ChatError, newSessionId, streamChat, type ApiMessage } from './api';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status: 'done' | 'streaming' | 'stopped' | 'error';
  error?: string;
}

// The server only reads the last 8 messages, so there's no point sending more.
const HISTORY_LIMIT = 8;

let nextId = 0;
const uid = () => `m${++nextId}`;

function toPayload(history: Message[]): ApiMessage[] {
  return history
    .filter((m) => m.status !== 'error' && m.content.trim())
    .slice(-HISTORY_LIMIT)
    .map(({ role, content }) => ({ role, content }));
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const sessionId = useRef(newSessionId());
  const active = useRef<AbortController | null>(null);

  const run = useCallback(async (history: Message[]) => {
    const controller = new AbortController();
    active.current = controller;

    const replyId = uid();
    const patch = (change: (message: Message) => Message) =>
      setMessages((list) => list.map((m) => (m.id === replyId ? change(m) : m)));

    setMessages([...history, { id: replyId, role: 'assistant', content: '', status: 'streaming' }]);
    setBusy(true);

    try {
      await streamChat({
        messages: toPayload(history),
        sessionId: sessionId.current,
        signal: controller.signal,
        onToken: (token) => patch((m) => ({ ...m, content: m.content + token })),
      });
      patch((m) => ({ ...m, status: 'done' }));
    } catch (err) {
      if (active.current !== controller) return; // New Chat replaced this conversation
      if (controller.signal.aborted) {
        patch((m) => ({ ...m, status: 'stopped' }));
      } else {
        const error = err instanceof ChatError ? err.message : 'Something went wrong. Please try again.';
        patch((m) => ({ ...m, status: 'error', error }));
      }
    } finally {
      if (active.current === controller) {
        active.current = null;
        setBusy(false);
      }
    }
  }, []);

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || busy) return;
      void run([...messages, { id: uid(), role: 'user', content, status: 'done' }]);
    },
    [busy, messages, run],
  );

  /** Asks the last question again, replacing the reply that failed. */
  const retry = useCallback(() => {
    if (busy) return;
    const last = messages[messages.length - 1];
    void run(last?.role === 'assistant' ? messages.slice(0, -1) : messages);
  }, [busy, messages, run]);

  const stop = useCallback(() => active.current?.abort(), []);

  const reset = useCallback(() => {
    const running = active.current;
    active.current = null;
    running?.abort();
    setBusy(false);
    setMessages([]);
    sessionId.current = newSessionId();
  }, []);

  return { messages, busy, sessionId, send, retry, stop, reset };
}

export type Chat = ReturnType<typeof useChat>;
