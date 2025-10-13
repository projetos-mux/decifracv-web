import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

interface Company {
  id: number;
  name: string;
  email: string;
  api_key: string;
  created_at: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = async () => {
    try {
      const res = await apiFetch("/companies");
      if (!res.ok) throw new Error("Falha ao carregar empresas");
      const data = await res.json();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta empresa?")) return;
    await apiFetch(`companies/${id}`, {
      method: "DELETE",
    });
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white">
        <p>Carregando empresas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#00CC82] mb-6">🏢 Empresas Cadastradas</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {companies.length === 0 ? (
          <p className="text-gray-300">Nenhuma empresa cadastrada.</p>
        ) : (
          <div className="overflow-x-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-gray-500 text-[#00CC82] uppercase text-xs">
                <tr>
                  <th className="pb-2">Nome</th>
                  <th className="pb-2">E-mail</th>
                  <th className="pb-2">Chave de API</th>
                  <th className="pb-2">Data de Cadastro</th>
                  <th className="pb-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-gray-700/40 hover:bg-white/5 transition"
                  >
                    <td className="py-2">{company.name}</td>
                    <td>{company.email}</td>
                    <td className="font-mono text-[#00CC82] break-all">
                      {company.api_key}
                    </td>
                    <td>
                      {new Date(company.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="text-red-400 hover:text-red-500 transition"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
