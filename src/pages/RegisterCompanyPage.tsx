import { useState } from "react";
import { apiFetch } from "../services/api";

export default function RegisterCompanyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setApiKey(null);

    if (!name.trim() || !email.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/companies/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Erro ao registrar empresa.");
      }

      const data = await response.json();
      setApiKey(data.api_key);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Falha ao registrar empresa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white p-6">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-semibold text-[#00CC82] mb-2 text-center">Cadastro de Empresa</h1>
        <p className="text-gray-300 text-center mb-8">
          Registre sua empresa e receba uma chave de API exclusiva para usar o DecifraCV.
        </p>

        {!apiKey ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Nome da empresa *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-[#00CC82]/40 focus:outline-none focus:border-[#00CC82]"
                placeholder="Ex: Mux Tech Innovation"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">E-mail corporativo *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-[#00CC82]/40 focus:outline-none focus:border-[#00CC82]"
                placeholder="Ex: contato@empresa.com"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 w-full py-3 rounded-xl font-medium transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#00CC82] hover:bg-[#00b974]"
              }`}
            >
              {loading ? "Registrando..." : "Registrar empresa"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-[#00CC82]">✅ Empresa registrada com sucesso!</h2>
            <p className="text-gray-300 text-sm">
              Guarde sua chave de API — ela será necessária para autenticar suas requisições.
            </p>
            <div className="bg-black/40 p-3 rounded-lg font-mono text-[#00CC82] text-sm break-all">
              {apiKey}
            </div>
            <button
              onClick={() => {
                setApiKey(null);
                setName("");
                setEmail("");
              }}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-xl text-white transition"
            >
              Registrar outra empresa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
