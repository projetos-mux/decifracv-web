import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

interface ResumeItem {
  id: number;
  file_name: string;
  full_name: string;
  confidence: number;
  created_at: string;
  cost_brl: number;
  processing_ms: number;
}

export default function HistoryPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ substitua pela key real ou futuramente use contexto / variáveis de ambiente
  const API_KEY = "f2703d43843dd69fc4bf9f4687bba445";

  const loadHistory = async () => {
    try {
      setError(null);
      const res = await apiFetch("/history", {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (!res.ok) {
        throw new Error("Falha ao carregar histórico");
      }

      const data = await res.json();
      setResumes(data);
    } catch (err: any) {
      console.error("Erro ao carregar histórico:", err);
      setError(err.message || "Erro desconhecido ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este currículo?")) return;

    try {
      const res = await apiFetch(`/delete/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (!res.ok) {
        throw new Error("Falha ao excluir o currículo.");
      }

      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir o currículo. Verifique sua chave de API.");
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white">
        <p>Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white p-8">
      <h1 className="text-2xl font-bold text-[#00CC82] mb-6">Currículos processados</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {resumes.length === 0 ? (
        <p className="text-gray-300">Nenhum currículo processado ainda.</p>
      ) : (
        <div className="overflow-auto bg-white/10 rounded-2xl p-6 backdrop-blur-md">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-gray-500 text-[#00CC82] uppercase text-xs">
              <tr>
                <th className="pb-2">Nome</th>
                <th className="pb-2">Arquivo</th>
                <th className="pb-2">Confiança</th>
                <th className="pb-2">Custo (R$)</th>
                <th className="pb-2">Tempo (s)</th>
                <th className="pb-2">Data</th>
                <th className="pb-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map(
                (resume) =>
                  resume && (
                    <tr key={resume.id} className="border-b border-gray-700/40">
                      <td className="py-2">{resume.full_name || "Indefinido"}</td>
                      <td>{resume.file_name}</td>
                      <td>{(resume.confidence ?? 0).toFixed(2)}</td>
                      <td>
                        {typeof resume.cost_brl === "number"
                          ? resume.cost_brl.toFixed(4)
                          : "—"}
                      </td>
                      <td>{((resume.processing_ms ?? 0) / 1000).toFixed(2)}</td>
                      <td>{new Date(resume.created_at).toLocaleString("pt-BR")}</td>
                      <td className="text-right">
                        <button
                          onClick={() => handleDelete(resume.id)}
                          className="text-red-400 hover:text-red-500 transition cursor-pointer"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
