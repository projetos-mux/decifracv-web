import { useState } from "react";
import { motion } from "framer-motion";

export default function RegisterUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ⚙️ Aqui você pode importar de um .env no futuro
  const API_KEY = "421406e01293a635fc0d5a6bafc89f30";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY, // vincula usuário à empresa correta
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erro ao registrar usuário");
      }

      setSuccess("Usuário registrado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-semibold text-[#00CC82] mb-2 text-center">
          Cadastro de Usuário
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Registre um novo usuário vinculado à sua empresa.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nome completo *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-[#00CC82]/40 focus:outline-none focus:border-[#00CC82]"
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">E-mail *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-[#00CC82]/40 focus:outline-none focus:border-[#00CC82]"
              placeholder="Ex: usuario@empresa.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Senha *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-[#00CC82]/40 focus:outline-none focus:border-[#00CC82]"
              placeholder="Crie uma senha segura"
              required
            />
          </div>

          {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          {success && <p className="text-green-400 text-center text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full py-3 rounded-xl font-medium transition ${
              loading ? "bg-gray-500" : "bg-[#00CC82] hover:bg-[#00b974]"
            }`}
          >
            {loading ? "Registrando..." : "Cadastrar usuário"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
