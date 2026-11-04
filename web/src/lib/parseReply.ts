/**
 * The server replies in Markdown, and for project questions adds a ```json block
 * holding an array of { title, description, link, thumbnail }. This splits a reply
 * (complete or still streaming) into the text around that block and the projects.
 */

export interface Project {
  title: string;
  description: string;
  link?: string;
  thumbnail?: string;
}

export interface ParsedReply {
  text: string;
  after: string;
  projects: Project[];
  /** The block has opened but not closed yet, so it can't be parsed. */
  projectsLoading: boolean;
}

const JSON_FENCE = /```json[^\n]*\n?/i;
const FENCE = '```';

// Model output decides these URLs, so nothing but http(s) reaches an href or src.
// `base` lets a relative path through, resolved against this site.
export function safeUrl(value: unknown, base?: string): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  try {
    const url = new URL(value, base);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function stripThinking(raw: string): string {
  return raw
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<think>[\s\S]*$/i, '') // still open mid-stream
    .trimStart();
}

function toProjects(json: string): Project[] {
  try {
    // Profiles exported from Markdown can escape & as \& in URLs, and models copy
    // that through, which is invalid JSON.
    const parsed: unknown = JSON.parse(json.replace(/\\&/g, '&'));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === 'object' && item.title)
      .map((item) => ({
        title: String(item.title),
        description: String(item.description ?? ''),
        link: safeUrl(item.link),
        thumbnail: safeUrl(item.thumbnail, window.location.origin), // served from web/public/images
      }));
  } catch {
    return [];
  }
}

export function parseReply(raw: string): ParsedReply {
  const text = stripThinking(raw);
  const open = JSON_FENCE.exec(text);
  if (!open) return { text, after: '', projects: [], projectsLoading: false };

  const before = text.slice(0, open.index).trimEnd();
  const rest = text.slice(open.index + open[0].length);
  const close = rest.indexOf(FENCE);
  if (close === -1) return { text: before, after: '', projects: [], projectsLoading: true };

  const projects = toProjects(rest.slice(0, close));
  // Not the shape we expected: leave it in place as an ordinary code block.
  if (projects.length === 0) return { text, after: '', projects: [], projectsLoading: false };

  return { text: before, after: rest.slice(close + FENCE.length).trim(), projects, projectsLoading: false };
}

/** Matches the server's fallback line for questions it has no information on. */
export function isFallbackReply(text: string): boolean {
  return /reach out to me directly/i.test(text);
}
