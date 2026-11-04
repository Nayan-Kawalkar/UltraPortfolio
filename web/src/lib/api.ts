/**
 * Client for the Express server in smart-portfilio-server-2.0.
 *
 *   POST /api/chat     { messages, sessionId } → SSE: token | done | error
 *   POST /api/contact  { name, email, message, originalQuestion?, sessionId? }
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

const CANT_REACH = "I can't reach the server right now. Please try again in a moment.";
const NO_ANSWER = "I couldn't get an answer just now. Please try again.";
const CUT_OFF = 'The reply got cut off. Please try again.';

/** An error whose message is written for the visitor. */
export class ChatError extends Error {}

export interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface StreamOptions {
  messages: ApiMessage[];
  sessionId: string;
  signal: AbortSignal;
  onToken: (token: string) => void;
}

export function newSessionId(): string {
  // getRandomValues, not randomUUID: it also works on plain-http LAN addresses.
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return `sess_${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`;
}

function rateLimitMessage(retryAfter: unknown): string {
  const minutes = typeof retryAfter === 'number' ? Math.ceil(retryAfter / 60) : 0;
  if (minutes > 1) return `That's a lot of questions in a short time. Please try again in about ${minutes} minutes.`;
  return "You're asking quickly. Please try again in a moment.";
}

async function readJson(response: Response): Promise<Record<string, unknown> | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function streamChat({ messages, sessionId, signal, onToken }: StreamOptions): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, sessionId }),
      signal,
    });
  } catch (err) {
    if (signal.aborted) throw err;
    throw new ChatError(CANT_REACH);
  }

  if (response.status === 429) {
    const body = await readJson(response);
    throw new ChatError(rateLimitMessage(body?.retryAfter));
  }
  if (!response.ok || !response.body) {
    console.warn('[chat] server responded', response.status);
    throw new ChatError(NO_ANSWER);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? ''; // the last piece may be half a line

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;

        let event: { type?: string; content?: string };
        try {
          event = JSON.parse(line.slice(5));
        } catch {
          continue;
        }

        if (event.type === 'token') onToken(event.content ?? '');
        if (event.type === 'done') return;
        if (event.type === 'error') {
          console.warn('[chat] server error event:', event.content);
          throw new ChatError(NO_ANSWER);
        }
      }
    }
  } catch (err) {
    if (err instanceof ChatError || signal.aborted) throw err;
    throw new ChatError(CUT_OFF);
  }

  // The stream closed without a `done` event, e.g. a host timeout mid-reply.
  throw new ChatError(CUT_OFF);
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  originalQuestion?: string;
  sessionId?: string;
}

export async function sendContact(payload: ContactPayload): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ChatError(CANT_REACH);
  }

  if (response.ok) return;
  const body = await readJson(response);
  throw new ChatError(typeof body?.error === 'string' ? body.error : 'That didn\'t go through. Please try again.');
}
