// src/components/Layout.tsx
import { Link } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold text-blue-600">GAMC</Link>
          <a href="https://www.cochabamba.bo" className="text-slate-500 hover:text-slate-700 text-sm">
            Portal GAMC
          </a>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1">{children}</main>

      {/* Footer compacto */}
      <footer className="mt-auto border-t bg-white">
        <div className="container mx-auto px-3 py-1 text-[11px] leading-tight text-slate-500">
          © 2025 GAMC · Información referencial
        </div>
      </footer>
    </div>
  );
}
