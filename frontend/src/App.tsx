import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import UnitsPage from "./pages/UnitPage";
import UnitTramitesPage from "./pages/UnitTramitesPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAFBFC]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/unidades" element={<UnitsPage />} />
          <Route path="/unidades/:id" element={<UnitTramitesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
