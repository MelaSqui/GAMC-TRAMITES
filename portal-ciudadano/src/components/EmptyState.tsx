export default function EmptyState({
  title = "Sin resultados",
  subtitle = "Intenta ajustar tu búsqueda.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="text-lg font-semibold text-slate-800">{title}</div>
      <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
    </div>
  );
}
