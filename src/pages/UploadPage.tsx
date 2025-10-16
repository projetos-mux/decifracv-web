import { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { apiFetch } from "../services/api";

interface ResumeData {
  full_name?: string;
  email?: string;
  skills?: string[];
  summary?: string;
  confidence?: number;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiFetch("/parse", {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key": "421406e01293a635fc0d5a6bafc89f30"
          //"x-api-key": "ceb5f70ea140b07c60f9fa1a3b85d77b"
        }
      });

      if (!response.ok) {
        throw new Error("Falha ao processar o currículo");
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      setError("Erro ao processar o currículo. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center text-white p-6 bg-gradient-to-br from-[#0C3355] to-[#001B30]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-full max-w-lg text-center"
      >
        <h1 className="text-3xl font-semibold mb-2 text-[#00CC82]">DecifraCV API</h1>
        <p className="text-gray-200 mb-8">
          Plataforma inteligente para empresas que desejam integrar o envio de currículos
          e receber automaticamente as informações estruturadas dos candidatos.
        </p>

        {/* Upload inicial */}
        {!loading && !result && (
          <>
            <label className="cursor-pointer flex flex-col items-center border-2 border-dashed border-[#00CC82]/40 rounded-xl p-8 hover:border-[#00CC82] transition">
              <Upload className="w-12 h-12 mb-3 text-[#00CC82]" />
              <span className="text-gray-300">
                {file ? file.name : "Arraste ou clique para enviar o currículo do candidato (PDF/DOCX)"}
              </span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>

            <button
              onClick={handleSubmit}
              disabled={!file}
              className={`mt-6 w-full py-3 rounded-xl font-medium transition ${file
                ? "bg-[#00CC82] hover:bg-[#00b974]"
                : "bg-gray-500 cursor-not-allowed"
                }`}
            >
              {file ? "Enviar e processar currículo" : "Selecione um arquivo"}
            </button>

            {error && <p className="text-red-400 mt-4">{error}</p>}
          </>
        )}

        {/* Carregando */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00CC82] border-t-transparent"></div>
            <p className="text-gray-300">Processando currículo com IA...</p>
          </motion.div>
        )}

        {/* Resultado */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left mt-4"
          >
            <h2 className="text-xl font-semibold text-[#00CC82] mb-2">
              {result.full_name || "Nome não identificado"}
            </h2>
            <p className="text-gray-300 mb-2">
              <strong>Email:</strong> {result.email || "Não encontrado"}
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Confiança da análise:</strong> {(result.confidence ?? 0).toFixed(2)}
            </p>
            <p className="text-gray-200 mb-3 text-sm italic">
              {result.summary || "Resumo não identificado."}
            </p>
            {result.skills && result.skills.length > 0 && (
              <div className="mt-4">
                <h3 className="text-[#00CC82] font-semibold mb-2">Habilidades detectadas:</h3>
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-[#00CC82]/20 text-[#00CC82] px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
              className="mt-6 w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-xl text-white transition"
            >
              Enviar outro currículo
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
