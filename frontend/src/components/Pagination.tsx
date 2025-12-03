"use client"

type Props = {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, lastPage, total, perPage, onPageChange }: Props) {
  if (lastPage <= 1) return null

  const startItem = (currentPage - 1) * perPage + 1
  const endItem = Math.min(currentPage * perPage, total)

  // Generar array de páginas a mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (lastPage <= maxVisible) {
      // Mostrar todas las páginas
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", lastPage)
      } else if (currentPage >= lastPage - 2) {
        pages.push(1, "...", lastPage - 3, lastPage - 2, lastPage - 1, lastPage)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage)
      }
    }

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200">
      {/* Info de resultados */}
      <p className="text-sm text-slate-600">
        Mostrando <span className="font-semibold text-slate-900">{startItem}</span> a{" "}
        <span className="font-semibold text-slate-900">{endItem}</span> de{" "}
        <span className="font-semibold text-slate-900">{total}</span> trámites
      </p>

      {/* Controles de paginación */}
      <div className="flex items-center gap-1">
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Página anterior"
          className={`
            flex items-center justify-center w-10 h-10 rounded-lg transition-all
            ${
              currentPage === 1
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#341A67] hover:shadow-md"
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Números de página */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="w-10 h-10 flex items-center justify-center text-slate-400 font-bold"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`
                w-10 h-10 rounded-lg font-medium transition-all
                ${
                  currentPage === page
                    ? "bg-[#341A67] text-white shadow-lg scale-105"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#341A67] hover:shadow-md"
                }
              `}
            >
              {page}
            </button>
          ),
        )}

        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          title="Página siguiente"
          className={`
            flex items-center justify-center w-10 h-10 rounded-lg transition-all
            ${
              currentPage === lastPage
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#341A67] hover:shadow-md"
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
