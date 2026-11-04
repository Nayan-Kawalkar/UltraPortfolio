import { useCallback, useLayoutEffect, useRef } from 'react';

const NEAR_BOTTOM = 96;

/**
 * Keeps a scroll area at the bottom while a reply streams in, unless the reader
 * has scrolled up. Sending a new message pins it to the bottom again.
 */
export function useStickToBottom(messageCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM;
  }, []);

  useLayoutEffect(() => {
    pinned.current = true;
  }, [messageCount]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el && pinned.current) el.scrollTop = el.scrollHeight;
  });

  return { scrollRef, onScroll };
}
