export default function EmptyState({
  title = "Sin resultados",
  subtitle = "Intenta ajustar tu búsqueda o explora otras opciones.",
  icon,
}: {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="card text-center py-12">
      <div className="card-content">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
          {icon || (
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-muted max-w-md mx-auto">{subtitle}</p>
      </div>
    </div>
  );
}