// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UnitsPage from './pages/UnitPage';
import UnitTramitesPage from './pages/UnitTramitesPage';
import TramiteDetailPage from './pages/TramiteDetailPage'; // el que ya tienes

import "./index.css"; // Asegúrate de importar los estilos globales si es necesario

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/units" replace />} />
        <Route path="/units" element={<UnitsPage />} />
        <Route path="/units/:id" element={<UnitTramitesPage />} />
        <Route path="/tramites/:id" element={<TramiteDetailPage />} />
        <Route path="*" element={<Navigate to="/units" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

