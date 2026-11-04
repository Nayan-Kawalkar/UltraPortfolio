import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUpIcon, StopIcon } from './Icons';

interface ComposerProps {
  busy: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export function Composer({ busy, onSend, onStop }: ComposerProps) {
  const [value, setValue] = useState('');
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const ready = value.trim().length > 0;

  // Grow with the text; the max-height in CSS takes over from there.
  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.style.height = 'auto';
    field.style.height = `${field.scrollHeight}px`;
  }, [value]);

  // Skipped on touch screens, where focus would pop the keyboard open.
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) fieldRef.current?.focus();
  }, []);

  const submit = () => {
    if (busy || !ready) return;
    onSend(value);
    setValue('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      className="composer"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <textarea
        ref={fieldRef}
        rows={1}
        value={value}
        placeholder="Message..."
        aria-label="Message"
        maxLength={2000}
        enterKeyHint="send"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
      />
      {busy ? (
        <button type="button" className="send is-active" aria-label="Stop reply" onClick={onStop}>
          <StopIcon />
        </button>
      ) : (
        <button type="submit" className={`send${ready ? ' is-active' : ''}`} aria-label="Send" disabled={!ready}>
          <ArrowUpIcon />
        </button>
      )}
    </form>
  );
}
