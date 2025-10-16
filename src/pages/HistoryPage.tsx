import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const API_KEY = import.meta.env.VITE_API_KEY;

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
      qualifications?: string;
      skills?: string[];
      education?: {
        institution?: string;
        degree?: string;
        area?: string;
        start?: string;
        end?: string;
      }[];
      courses?: {
        name?: string;
        institution?: string;
        year?: string;
      }[];
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
  const [sectionExpanded, setSectionExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    skills: "",
    title: "",
    company: "",
    city: "",
    confidence_min: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadResumes = async (params: Record<string, any> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const query = new URLSearchParams({
        page: String(page),
        page_size: "10",
        ...Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== "" && v != null)
        ),
      });

      const res = await apiFetch(`/resumes/search?${query}`, {
        headers: { "x-api-key": API_KEY },
      });

      if (!res.ok) throw new Error("Falha ao carregar histórico");

      const data = await res.json();
      setResumes(data.data || []);
      setTotalPages(data.pagination?.total_pages || 1);
    } catch (err: any) {
      console.error("Erro ao carregar histórico:", err);
      setError(err.message || "Erro desconhecido ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    setPage(1);
    loadResumes(filters);
  };

  const toggleSection = (key: string) => {
    setSectionExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
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
    loadResumes(filters);
  }, [page]);

  const calculateMatch = (candidateSkills?: string[]) => {
    if (!filters.skills || !candidateSkills?.length) return 0;
    const searched = filters.skills
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const matched = candidateSkills.filter((skill) =>
      searched.includes(skill.toLowerCase())
    );
    return Math.round((matched.length / searched.length) * 100);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <p>Carregando histórico...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-[#00CC82] mb-6">Currículos processados</h1>

      {/* 🔍 Filtros */}
      <div className="bg-white/10 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          name="skills"
          placeholder="Skills (React, Node...)"
          value={filters.skills}
          onChange={handleFilterChange}
          className="bg-black/30 border border-white/20 rounded-md px-3 py-2 text-sm w-full focus:ring-1 focus:ring-[#00CC82]"
        />
        <input
          name="title"
          placeholder="Cargo"
          value={filters.title}
          onChange={handleFilterChange}
          className="bg-black/30 border border-white/20 rounded-md px-3 py-2 text-sm w-full"
        />
        <input
          name="company"
          placeholder="Empresa"
          value={filters.company}
          onChange={handleFilterChange}
          className="bg-black/30 border border-white/20 rounded-md px-3 py-2 text-sm w-full"
        />
        <input
          name="city"
          placeholder="Cidade"
          value={filters.city}
          onChange={handleFilterChange}
          className="bg-black/30 border border-white/20 rounded-md px-3 py-2 text-sm w-full"
        />
        <input
          name="confidence_min"
          placeholder="Confiança mínima (0.8)"
          value={filters.confidence_min}
          onChange={handleFilterChange}
          className="bg-black/30 border border-white/20 rounded-md px-3 py-2 text-sm w-full"
        />

        <button
          onClick={handleApplyFilters}
          className="col-span-1 md:col-span-5 bg-[#00CC82] text-[#0C3355] py-2 rounded-md font-semibold hover:bg-[#00e996] transition"
        >
          Aplicar filtros
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {resumes.length === 0 ? (
        <p className="text-gray-300">Nenhum currículo encontrado.</p>
      ) : (
        <div className="overflow-auto bg-white/10 rounded-2xl p-6 backdrop-blur-md">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="border-b border-gray-500 text-[#00CC82] uppercase text-xs">
              <tr>
                <th className="pb-2">Nome</th>
                <th className="pb-2">Arquivo</th>
                <th className="pb-2">Confiança</th>
                <th className="pb-2">Match</th>
                <th className="pb-2">Tempo (s)</th>
                <th className="pb-2">Data</th>
                <th className="pb-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => {
                const data = resume.data_json?.data;
                const match = calculateMatch(data?.skills);
                return (
                  <>
                    <tr
                      key={resume.id}
                      className="border-b border-gray-700/40 cursor-pointer hover:bg-white/5"
                      onClick={() => toggleExpand(resume.id)}
                    >
                      <td className="py-2">{resume.full_name}</td>
                      <td>{resume.file_name}</td>
                      <td>{(resume.confidence ?? 0).toFixed(2)}</td>
                      <td>
                        {match ? (
                          <span
                            className={`font-semibold ${
                              match >= 80
                                ? "text-green-400"
                                : match >= 50
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                          >
                            {match}%
                          </span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td>{((resume.processing_ms ?? 0) / 1000).toFixed(2)}</td>
                      <td>{new Date(resume.created_at).toLocaleString("pt-BR")}</td>
                      <td className="text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resume.id);
                          }}
                          className="text-red-400 hover:text-red-500"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>

                    {expandedRowId === resume.id && data && (
                      <tr className="bg-white/5 border-b border-gray-700/20">
                        <td colSpan={7} className="p-6 space-y-4">
                          <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-[#00CC82]">
                              {data.full_name}
                            </h2>
                            <p><strong>Email:</strong> {data.email}</p>
                            <p><strong>Telefone:</strong> {data.phones?.join(", ")}</p>
                          </div>

                          {/* 🔽 Seções expansíveis */}
                          <Section title="Resumo Profissional" expanded={sectionExpanded["summary"]} onToggle={() => toggleSection("summary")}>
                            <p>{data.summary || "—"}</p>
                          </Section>

                          <Section title="Qualificações" expanded={sectionExpanded["qualifications"]} onToggle={() => toggleSection("qualifications")}>
                            <p className="whitespace-pre-line">{data.qualifications || "—"}</p>
                          </Section>

                          <Section title="Habilidades" expanded={sectionExpanded["skills"]} onToggle={() => toggleSection("skills")}>
                            <div className="flex flex-wrap gap-2">
                              {data.skills?.map((s, i) => (
                                <span key={i} className="bg-[#00CC82]/20 border border-[#00CC82]/40 text-[#00CC82] px-3 py-1 rounded-full text-xs">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </Section>

                          <Section title="Formação Acadêmica" expanded={sectionExpanded["education"]} onToggle={() => toggleSection("education")}>
                            {data.education?.map((e, i) => (
                              <div key={i} className="border-b border-white/10 py-2">
                                <p className="font-semibold">{e.degree}</p>
                                <p>{e.institution}</p>
                                <p className="text-sm text-gray-400">
                                  {e.start} - {e.end}
                                </p>
                              </div>
                            ))}
                          </Section>

                          <Section title="Cursos e Certificações" expanded={sectionExpanded["courses"]} onToggle={() => toggleSection("courses")}>
                            {data.courses?.map((c, i) => (
                              <div key={i} className="border-b border-white/10 py-2">
                                <p className="font-semibold">{c.name}</p>
                                <p className="text-sm text-gray-400">
                                  {c.institution} - {c.year}
                                </p>
                              </div>
                            ))}
                          </Section>

                          <Section title="Experiências Profissionais" expanded={sectionExpanded["experience"]} onToggle={() => toggleSection("experience")}>
                            {data.experience?.map((exp, i) => (
                              <div key={i} className="border-b border-white/10 py-2">
                                <p className="font-semibold">{exp.title}</p>
                                <p>{exp.company}</p>
                                <p className="text-sm text-gray-400">
                                  {exp.start} – {exp.end}
                                </p>
                                <ul className="list-disc list-inside text-xs text-gray-300 mt-1">
                                  {exp.achievements?.map((a, j) => (
                                    <li key={j}>{a}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </Section>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>

          {/* 🔢 Paginação */}
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#00CC82]/20 rounded disabled:opacity-50 hover:bg-[#00CC82]/30"
            >
              Anterior
            </button>
            <span className="text-gray-300">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-[#00CC82]/20 rounded disabled:opacity-50 hover:bg-[#00CC82]/30"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** 🔹 Componente reutilizável para seções expansíveis */
function Section({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded?: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-white/10 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-3 bg-white/10 hover:bg-white/20 rounded-t-lg"
      >
        <span className="font-semibold text-[#00CC82]">{title}</span>
        <span>{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && <div className="p-4 text-gray-200 text-sm">{children}</div>}
    </div>
  );
}
