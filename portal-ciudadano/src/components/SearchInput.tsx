export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <input
        className="w-full h-12 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-500 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
    </div>
  );
}