"use client"

export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative group">
      <input
        className="w-full h-12 sm:h-14 lg:h-16 pl-12 sm:pl-14 pr-4 text-sm sm:text-base lg:text-lg text-slate-900 placeholder-slate-400 bg-white border-2 border-slate-200 rounded-2xl sm:rounded-3xl focus:outline-none focus:border-[#341A67] focus:ring-4 focus:ring-[#341A67]/15 transition-all duration-300 shadow-md hover:shadow-lg focus:shadow-xl focus:scale-[1.02] font-medium"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      {/* Search icon with enhanced styling */}
      <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-[#47B4D8] pointer-events-none group-focus-within:text-[#341A67] transition-colors duration-300">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>

      {/* Clear button with enhanced styling */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-600 hover:text-slate-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
