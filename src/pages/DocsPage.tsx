export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white p-8">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-[#00CC82] mb-4">📘 Documentação da API - DecifraCV</h1>
        <p className="text-gray-300 mb-6">
          A API do DecifraCV permite que sua empresa envie currículos e receba dados estruturados em JSON.
          Cada empresa possui uma <strong>chave de API</strong> exclusiva.
        </p>

        <h2 className="text-2xl text-[#00CC82] font-semibold mb-2">🔑 Autenticação</h2>
        <pre className="bg-black/40 p-4 rounded-md mb-6 text-sm overflow-auto">
          <code>
            {`x-api-key: SUA_CHAVE_DE_API_AQUI`}
          </code>
        </pre>

        <h2 className="text-2xl text-[#00CC82] font-semibold mb-2">📤 Enviar currículo</h2>
        <pre className="bg-black/40 p-4 rounded-md mb-6 text-sm overflow-auto">
          <code>
            {`POST https://decifracv.com/api/v1/parse
            Headers:
              x-api-key: SUA_CHAVE_DE_API
            Body:
              file=@curriculo.pdf`
            }
          </code>
        </pre>

        <h2 className="text-2xl text-[#00CC82] font-semibold mb-2">📥 Exemplo de resposta</h2>
        <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto">
          <code>
            {`{
              "data": {
                "full_name": "Maria Souza",
                "email": "maria@email.com",
                "skills": ["React", "Node", "SQL"],
                "confidence": 0.93,
                "processing_ms": 7250
              },
              "warnings": []
            }`}
          </code>
        </pre>

        <h2 className="text-2xl text-[#00CC82] font-semibold mb-2">📈 Limites de uso</h2>
        <p className="text-gray-300">
          • Plano gratuito: até 50 currículos/mês <br />
          • Plano Pro: ilimitado + dashboard e métricas detalhadas
        </p>
      </div>
    </div>
  );
}
