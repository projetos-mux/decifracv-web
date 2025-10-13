import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { apiFetch } from "../services/api";

interface ResumeItem {
  id: number;
  full_name: string;
  confidence: number;
  cost_brl: number;
  processing_ms: number;
  created_at: string;
}

export default function MetricsPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/history")
      .then((res) => res.json())
      .then((data) => setResumes(data))
      .catch((err) => console.error("Erro ao carregar métricas:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white">
        <p>Carregando métricas...</p>
      </div>
    );
  }

  // 🧮 Cálculos das métricas
  const total = resumes.length;
  const avgConfidence =
    total > 0
      ? resumes.reduce((acc, r) => acc + (r.confidence || 0), 0) / total
      : 0;

  const avgTime =
    total > 0
      ? resumes.reduce((acc, r) => acc + (r.processing_ms || 0), 0) / total
      : 0;

  const totalCost = resumes.reduce((acc, r) => acc + (r.cost_brl || 0), 0);

  // 🔢 Prepara dados para o gráfico
  const chartData = resumes.map((r) => ({
    name: new Date(r.created_at).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    tempo: (r.processing_ms || 0) / 1000,
    custo: r.cost_brl || 0,
  }));

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white p-8 overflow-auto">
      <h1 className="text-3xl font-bold text-[#00CC82] mb-8">📊 Dashboard de Métricas</h1>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-300 text-sm mb-1">Currículos processados</p>
          <h2 className="text-2xl font-semibold text-[#00CC82]">{total}</h2>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-300 text-sm mb-1">Confiança média</p>
          <h2 className="text-2xl font-semibold text-[#00CC82]">
            {avgConfidence.toFixed(2)}
          </h2>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-300 text-sm mb-1">Tempo médio</p>
          <h2 className="text-2xl font-semibold text-[#00CC82]">
            {(avgTime / 1000).toFixed(2)}s
          </h2>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg text-center sm:col-span-3">
          <p className="text-gray-300 text-sm mb-1">Custo total estimado</p>
          <h2 className="text-2xl font-semibold text-[#00CC82]">
            R$ {totalCost.toFixed(4)}
          </h2>
        </div>
      </div>

      {/* Gráfico de tempo */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-lg font-semibold mb-4 text-[#00CC82]">Tempo de processamento (s)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="tempo" stroke="#00CC82" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de custo */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#00CC82]">Custo por currículo (R$)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="custo" fill="#00CC82" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
