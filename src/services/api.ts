// src/services/api.ts
export async function apiFetch(url: string, options: any = {}) {
  const token = localStorage.getItem("token");
  const apiKey = import.meta.env.VITE_API_KEY; // da .env do front

  const headers = {
    ...(options.headers || {}),
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : apiKey
      ? { "x-api-key": apiKey }
      : {}),
  };

  const response = await fetch(`http://127.0.0.1:8000/api/v1${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.warn("Sessão expirada ou credenciais inválidas.");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return response;
}
