import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import HistoryPage from "./pages/HistoryPage";
import MetricsPage from "./pages/MetricsPage";
import DocsPage from "./pages/DocsPage";
import RegisterCompanyPage from "./pages/RegisterCompanyPage";
import CompaniesPage from "./pages/CompaniesPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-full bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white">
        <nav className="p-4 flex justify-center gap-8 bg-[#0C3355]/80 backdrop-blur-lg shadow-md">
          <Link to="/" className="text-[#00CC82] hover:underline">Upload</Link>
          <Link to="/docs" className="text-[#00CC82] hover:underline">Documentação</Link>
          <Link to="/history" className="text-[#00CC82] hover:underline">Histórico</Link>
          <Link to="/metrics" className="text-[#00CC82] hover:underline">Métricas</Link>
          <Link to="/register" className="text-[#00CC82] hover:underline">Registro</Link>
          <Link to="/companies" className="text-[#00CC82] hover:underline">Empresas</Link>
        </nav>

        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/register" element={<RegisterCompanyPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
