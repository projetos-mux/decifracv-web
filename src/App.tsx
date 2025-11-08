import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadPage from "./pages/UploadPage";
import HistoryPage from "./pages/HistoryPage";
import MetricsPage from "./pages/MetricsPage";
import DocsPage from "./pages/DocsPage";
import RegisterCompanyPage from "./pages/RegisterCompanyPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import CompaniesPage from "./pages/CompaniesPage";
import LoginPage from "./pages/LoginPage";
import LinkText from "./components/LinkText";
import UsersPage from "./pages/UsersPage";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="p-4 flex flex-wrap justify-center gap-6 bg-[#0C3355]/80 backdrop-blur-lg shadow-md">
      {isAuthenticated && (
        <>
          <LinkText path="/" text="Upload" />
          <LinkText path="/history" text="Histórico" />
          <LinkText path="/metrics" text="Métricas" />
          <LinkText path="/companies" text="Empresas" />
          <LinkText path="/users" text="Usuários" />
          <LinkText path="/register" text="Cadastrar Usuários" />
        </>
      )}

      {!isAuthenticated && (
        <>
          <LinkText path="/login" text="Login" />
          <LinkText path="/register" text="Cadastro" />
        </>
      )}

      <LinkText path="/register-company" text="Cadastrar Empresa" />
      <LinkText path="/docs" text="Docs" />

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-500 transition font-medium cursor-pointer hover:underline"
        >
          Sair
        </button>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="w-full h-full bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white min-h-screen">
          <Navbar />

          <Routes>
            <Route path="/docs" element={<DocsPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterUserPage />} />
            <Route path="/register-company" element={<RegisterCompanyPage />} />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/metrics"
              element={
                <ProtectedRoute>
                  <MetricsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/companies"
              element={
                <ProtectedRoute>
                  <CompaniesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
