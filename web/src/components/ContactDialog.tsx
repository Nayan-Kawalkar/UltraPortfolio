import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { sendContact } from '../lib/api';
import { CloseIcon } from './Icons';

interface ContactDialogProps {
  open: boolean;
  question?: string;
  sessionId: string;
  onClose: () => void;
}

type Status = 'idle' | 'sending' | 'sent';

export function ContactDialog({ open, question, sessionId, onClose }: ContactDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setStatus('idle');
      setError('');
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus('sending');
    setError('');
    try {
      await sendContact({
        name: String(data.get('name')).trim(),
        email: String(data.get('email')).trim(),
        message: String(data.get('message')).trim(),
        originalQuestion: question,
        sessionId,
      });
      setStatus('sent');
    } catch (err) {
      setStatus('idle');
      setError(err instanceof Error ? err.message : 'That didn\'t go through. Please try again.');
    }
  };

  // The dialog element fills the backdrop's click area only outside .dialog__panel.
  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog ref={dialogRef} className="dialog" aria-labelledby="contact-title" onClose={onClose} onClick={onDialogClick}>
      <div className="dialog__panel">
        <header className="dialog__head">
          <h2 id="contact-title">{status === 'sent' ? 'Message sent' : 'Send me a message'}</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        {status === 'sent' ? (
          <p className="dialog__note">Thanks for reaching out. I'll reply by email.</p>
        ) : (
          <form onSubmit={onSubmit}>
            {question && (
              <p className="dialog__note">
                About: <span>{question}</span>
              </p>
            )}
            <label>
              Name
              <input name="name" required maxLength={120} autoComplete="name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required maxLength={200} autoComplete="email" />
            </label>
            <label>
              Message
              <textarea name="message" required rows={4} maxLength={2000} />
            </label>
            {error && (
              <p className="dialog__error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="dialog__submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
