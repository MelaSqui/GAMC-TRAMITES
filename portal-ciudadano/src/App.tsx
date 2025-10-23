import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import UnitsPage from "./pages/UnitPage";
import TramiteDetailPage from "./pages/TramiteDetailPage";
import UnitTramitesPage from "./pages/UnitTramitesPage";

function TopBar() {
  return (
    <header className="border-b border-[var(--c-border)] bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo-gamc.svg" alt="GAMC" className="h-7" />
          <span className="font-semibold">Guía de Trámites</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/" className="btn-soft">Trámites</Link>
          <Link to="/unidades" className="btn-soft">Unidades</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--c-border)] py-10">
      <div className="mx-auto max-w-6xl px-4 text-sm text-[var(--c-muted)]">
        © {new Date().getFullYear()} Gobierno Autónomo Municipal de Cochabamba
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/unidades" element={<UnitsPage />} />
        {/* detalle de un trámite */}
        <Route path="/tramites/:id" element={<TramiteDetailPage />} />
        {/* trámites por unidad */}
        <Route path="/unidades/:id/tramites" element={<UnitTramitesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
