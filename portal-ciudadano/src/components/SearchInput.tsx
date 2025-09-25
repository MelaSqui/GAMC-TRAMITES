import { useEffect, useRef, useState } from "react";

type Props = {
  value?: string;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
};

export default function SearchInput({
  value = "",
  placeholder = "Buscar…",
  autoFocus,
  className = "",
  onChange,
  onDebouncedChange,
  debounceMs = 300,
}: Props) {
  const [q, setQ] = useState(value);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => setQ(value ?? ""), [value]);

  useEffect(() => {
    if (!onDebouncedChange) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onDebouncedChange(q), debounceMs);
    return () => window.clearTimeout(timer.current);
  }, [q, debounceMs, onDebouncedChange]);

  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M12.9 14.32a8 8 0 111.414-1.414l3.387 3.387a1 1 0 11-1.414 1.414l-3.387-3.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      <input
        type="text"
        value={q}
        onChange={(e) => {
          const v = e.target.value;
          setQ(v);
          onChange?.(v);
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-9 outline-none ring-0 focus:border-blue-600 focus:ring-2 focus:ring-blue-600"
      />

      {q && (
        <button
          type="button"
          onClick={() => {
            setQ("");
            onChange?.("");
            onDebouncedChange?.("");
          }}
          className="absolute inset-y-0 right-0 pr-3 text-slate-400 hover:text-slate-600"
          aria-label="Borrar búsqueda"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
