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
  data_json?: {
    data?: {
      full_name?: string;
      email?: string;
      phones?: string[];
      summary?: string;
      skills?: string[];
      experience?: {
        company: string;
        title: string;
        start?: string;
        end?: string;
        achievements?: string[];
      }[];
    };
  };
}

export default function HistoryPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "421406e01293a635fc0d5a6bafc89f30";

  const loadHistory = async () => {
    try {
      setError(null);
      const res = await apiFetch("/history", {
        headers: { "x-api-key": API_KEY },
      });

      if (!res.ok) throw new Error("Falha ao carregar histórico");

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
        headers: { "x-api-key": API_KEY },
      });

      if (!res.ok) throw new Error("Falha ao excluir o currículo.");
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir o currículo.");
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
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
    <div className="h-screen w-screen bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-[#00CC82] mb-6">Currículos processados</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {resumes.length === 0 ? (
        <p className="text-gray-300">Nenhum currículo processado ainda.</p>
      ) : (
        <div className="overflow-auto bg-white/10 rounded-2xl p-6 backdrop-blur-md">
          <table className="w-full text-sm text-left border-collapse">
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
              {resumes.map((resume) => {
                const data = resume.data_json?.data;
                return (
                  <>
                    <tr
                      key={resume.id}
                      className="border-b border-gray-700/40 cursor-pointer hover:bg-white/5"
                      onClick={() => toggleExpand(resume.id)}
                    >
                      <td className="py-2">{resume.full_name || "Indefinido"}</td>
                      <td>{resume.file_name}</td>
                      <td>{(resume.confidence ?? 0).toFixed(2)}</td>
                      <td>{resume.cost_brl?.toFixed(4) ?? "—"}</td>
                      <td>{((resume.processing_ms ?? 0) / 1000).toFixed(2)}</td>
                      <td>{new Date(resume.created_at).toLocaleString("pt-BR")}</td>
                      <td className="text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resume.id);
                          }}
                          className="text-red-400 hover:text-red-500 transition cursor-pointer"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>

                    {expandedRowId === resume.id && data && (
                      <tr className="bg-white/5 border-b border-gray-700/20">
                        <td colSpan={7} className="p-6 text-sm">
                          <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-[#00CC82]">
                              {data.full_name}
                            </h2>
                            <p><strong>Email:</strong> {data.email}</p>
                            <p><strong>Telefone:</strong> {data.phones?.join(", ") || "—"}</p>
                            <p className="text-gray-200 italic">{data.summary}</p>

                            {data.skills && data.skills.length > 0 && (
                              <div>
                                <h3 className="font-semibold text-[#00CC82] mt-4 mb-2">
                                  Habilidades
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {data.skills.map((skill, i) => (
                                    <span
                                      key={i}
                                      className="bg-[#00CC82]/20 border border-[#00CC82]/40 text-[#00CC82] px-3 py-1 rounded-full text-xs font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {data.experience && data.experience.length > 0 && (
                              <div className="mt-4">
                                <h3 className="font-semibold text-[#00CC82] mb-2">Experiências</h3>
                                <div className="space-y-3">
                                  {data.experience.map((exp, i) => (
                                    <div
                                      key={i}
                                      className="bg-black/30 rounded-lg p-3 border border-white/10"
                                    >
                                      <p className="font-semibold">{exp.title}</p>
                                      <p className="text-gray-300 text-sm">
                                        {exp.company} ({exp.start} – {exp.end})
                                      </p>
                                      {exp.achievements && (
                                        <ul className="list-disc list-inside text-gray-400 text-xs mt-1">
                                          {exp.achievements.map((ach, j) => (
                                            <li key={j}>{ach}</li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
