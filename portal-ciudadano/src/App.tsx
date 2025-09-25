import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import UnitPage from './pages/UnitPage';
import UnitTramitesPage from './pages/UnitTramitesPage';
import TramiteDetailPage from './pages/TramiteDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<UnitPage />} />
          <Route path="/units/:id" element={<UnitTramitesPage />} />
          <Route path="/tramites/:id" element={<TramiteDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
