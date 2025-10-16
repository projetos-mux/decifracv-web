export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white p-8">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-[#00CC82] mb-4">
          📘 Documentação da API - DecifraCV
        </h1>
        <p className="text-gray-300 mb-6">
          A API do <strong>DecifraCV</strong> permite que empresas integrem a análise automatizada
          de currículos diretamente em seus sistemas. Cada empresa possui uma{" "}
          <strong>chave de API exclusiva</strong> para autenticação, e os usuários autenticados podem
          acessar o dashboard e métricas via <strong>JWT</strong>.
        </p>

        {/* 🔑 Autenticação */}
        <h2 className="text-2xl text-[#00CC82] font-semibold mb-2">🔑 Autenticação</h2>
        <p className="text-gray-300 mb-2">
          Todas as requisições à API devem incluir um dos seguintes métodos de autenticação:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-6">
          <li>
            <strong>API Key</strong> – para empresas integradas via API externa
          </li>
          <li>
            <strong>JWT</strong> – para usuários autenticados no painel web
          </li>
        </ul>

        <pre className="bg-black/40 p-4 rounded-md mb-6 text-sm overflow-auto">
          <code>{`x-api-key: SUA_CHAVE_DE_API`}</code>
        </pre>

        {/* 🧾 ROTAS DISPONÍVEIS */}
        <h2 className="text-2xl text-[#00CC82] font-semibold mb-4">🚀 Endpoints Principais</h2>

        <div className="space-y-8">

          {/* Enviar currículo */}
          <div>
            <h3 className="text-xl font-semibold text-[#00CC82] mb-2">📤 POST /api/v1/parse</h3>
            <p className="text-gray-300 mb-2">
              Envia um currículo em PDF ou DOCX para análise automática pela IA.
            </p>
            <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto mb-4">
              <code>{`POST https://decifracv.com/api/v1/parse
Headers:
  x-api-key: SUA_CHAVE_DE_API
Content-Type: multipart/form-data
Body:
  file=@curriculo.pdf`}</code>
            </pre>
            <p className="text-gray-300 mb-2 font-semibold">Resposta:</p>
            <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto">
              <code>{`{
  "data": {
    "full_name": "Maria Souza",
    "email": "maria@email.com",
    "phones": ["(11) 99999-0000"],
    "skills": ["React", "Node.js", "SQL"],
    "experience": [
      { "company": "Tech Ltda", "title": "Desenvolvedora Frontend", "start": "2021", "end": "2024" }
    ],
    "confidence": 0.93,
    "processing_ms": 7250
  },
  "warnings": []
}`}</code>
            </pre>
          </div>

          {/* Histórico */}
          <div>
            <h3 className="text-xl font-semibold text-[#00CC82] mb-2">📚 GET /api/v1/history</h3>
            <p className="text-gray-300 mb-2">
              Retorna o histórico de currículos processados pela empresa autenticada.
            </p>
            <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto mb-4">
              <code>{`GET https://decifracv.com/api/v1/history
Headers:
  x-api-key: SUA_CHAVE_DE_API`}</code>
            </pre>
            <p className="text-gray-300 mb-2 font-semibold">Resposta:</p>
            <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto">
              <code>{`[
  {
    "id": 5,
    "file_name": "curriculo.pdf",
    "full_name": "Maria Souza",
    "confidence": 0.91,
    "processing_ms": 6823,
    "cost_brl": 0.0075,
    "created_at": "2025-10-16T18:35:00.000Z"
  }
]`}</code>
            </pre>
          </div>

          {/* Deletar currículo */}
          <div>
            <h3 className="text-xl font-semibold text-[#00CC82] mb-2">🗑️ DELETE /api/v1/delete/&lt;id&gt;</h3>
            <p className="text-gray-300 mb-2">
              Remove um currículo processado. Só pode ser executado pela empresa ou usuário
              autenticado vinculado à empresa que o enviou.
            </p>
            <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto">
              <code>{`DELETE https://decifracv.com/api/v1/delete/123
Headers:
  Authorization: Bearer SEU_TOKEN_JWT
  ou
  x-api-key: SUA_CHAVE_DE_API`}</code>
            </pre>
          </div>

          {/* Métricas */}
          <div>
            <h3 className="text-xl font-semibold text-[#00CC82] mb-2">📊 GET /api/v1/metrics</h3>
            <p className="text-gray-300 mb-2">
              Retorna métricas de uso da API para a empresa autenticada.
            </p>
            <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto mb-4">
              <code>{`GET https://decifracv.com/api/v1/metrics
Headers:
  x-api-key: SUA_CHAVE_DE_API`}</code>
            </pre>
            <p className="text-gray-300 mb-2 font-semibold">Resposta:</p>
            <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto">
              <code>{`{
  "total_resumes": 128,
  "avg_confidence": 0.91,
  "avg_processing_ms": 7450,
  "total_cost_brl": 1.84
}`}</code>
            </pre>
          </div>

          {/* Registro de empresa */}
          <div>
            <h3 className="text-xl font-semibold text-[#00CC82] mb-2">🏢 POST /api/v1/companies/register</h3>
            <p className="text-gray-300 mb-2">
              Registra uma nova empresa e gera uma chave de API exclusiva.
            </p>
            <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto mb-4">
              <code>{`POST https://decifracv.com/api/v1/companies/register
Headers:
  Content-Type: application/json
Body:
  {
    "name": "Minha Empresa",
    "email": "contato@empresa.com"
  }`}</code>
            </pre>
            <p className="text-gray-300 mb-2 font-semibold">Resposta:</p>
            <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto">
              <code>{`{
  "name": "Minha Empresa",
  "email": "contato@empresa.com",
  "api_key": "421406e01293a635fc0d5a6bafc89f30"
}`}</code>
            </pre>
          </div>

          {/* Registro e login de usuário */}
          <div>
            <h3 className="text-xl font-semibold text-[#00CC82] mb-2">👤 Autenticação de Usuário (JWT)</h3>

            <p className="text-gray-300 mb-2">🔹 Cadastro de usuário</p>
            <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto mb-4">
              <code>{`POST https://decifracv.com/api/v1/auth/register
Headers:
  Content-Type: application/json
  x-api-key: CHAVE_DA_EMPRESA
Body:
  {
    "name": "Paulo Henrique",
    "email": "paulo@empresa.com",
    "password": "minha_senha_segura"
  }`}</code>
            </pre>

            <p className="text-gray-300 mb-2">🔹 Login do usuário</p>
            <pre className="bg-black/40 p-4 rounded-md text-sm overflow-auto">
              <code>{`POST https://decifracv.com/api/v1/auth/login
Headers:
  Content-Type: application/json
Body:
  {
    "email": "paulo@empresa.com",
    "password": "minha_senha_segura"
  }

Resposta:
{
  "access_token": "JWT_TOKEN_AQUI",
  "token_type": "bearer"
}`}</code>
            </pre>
          </div>
        </div>

        {/* 📈 Limites de uso */}
        <h2 className="text-2xl text-[#00CC82] font-semibold mt-10 mb-2">📈 Limites e Planos</h2>
        <p className="text-gray-300">
          • <strong>Plano gratuito:</strong> até 50 currículos/mês<br />
          • <strong>Plano Pro:</strong> ilimitado + dashboard com métricas e histórico completo<br />
          • <strong>Plano Enterprise:</strong> API personalizada + portal dedicado + suporte prioritário
        </p>
      </div>
    </div>
  );
}
