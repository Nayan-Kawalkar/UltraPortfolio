export type Mode = 'chat' | 'terminal';

const MODES: Mode[] = ['chat', 'terminal'];

export function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <div className="toggle" role="group" aria-label="View">
      {MODES.map((item) => (
        <button
          key={item}
          type="button"
          className={`toggle__item toggle__item--${item}`}
          aria-pressed={mode === item}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
