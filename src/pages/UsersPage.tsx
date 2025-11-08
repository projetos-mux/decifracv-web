import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

interface User {
  id: number;
  name: string;
  email: string;
  company_id: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [passwords, setPasswords] = useState<{ password: string; confirm: string }>({
    password: "",
    confirm: "",
  });
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await apiFetch("/user/list");
      if (!res.ok) throw new Error("Falha ao carregar usuários");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      const res = await apiFetch(`/user/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao excluir usuário");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePasswordChange = async (id: number) => {
    if (!passwords.password || !passwords.confirm) {
      alert("Preencha ambos os campos de senha.");
      return;
    }
    if (passwords.password !== passwords.confirm) {
      alert("As senhas não coincidem.");
      return;
    }

    setSaving(true);
    try {
      const res = await apiFetch(`/user/${id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: passwords.password }),
      });
      if (!res.ok) throw new Error("Falha ao alterar senha");
      alert("Senha alterada com sucesso!");
      setOpenRow(null);
      setPasswords({ password: "", confirm: "" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white">
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#0C3355] to-[#001B30] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#00CC82] mb-6">
          👤 Usuários Cadastrados
        </h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {users.length === 0 ? (
          <p className="text-gray-300">Nenhum usuário encontrado.</p>
        ) : (
          <div className="overflow-x-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-gray-500 text-[#00CC82] uppercase text-xs">
                <tr>
                  <th className="pb-2">Nome</th>
                  <th className="pb-2">E-mail</th>
                  <th className="pb-2">Empresa (ID)</th>
                  <th className="pb-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <>
                    <tr
                      key={user.id}
                      className="border-b border-gray-700/40 hover:bg-white/5 transition"
                    >
                      <td className="py-2">{user.name}</td>
                      <td>{user.email}</td>
                      <td className="text-gray-300">{user.company_id}</td>
                      <td className="text-right space-x-4">
                        <button
                          onClick={() =>
                            setOpenRow(openRow === user.id ? null : user.id)
                          }
                          className="text-[#00CC82] hover:text-[#00ff9f] transition cursor-pointer"
                        >
                          Alterar Senha
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-400 hover:text-red-500 transition cursor-pointer"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>

                    {openRow === user.id && (
                      <tr className="bg-white/5 border-b border-gray-700/40">
                        <td colSpan={4}>
                          <div className="flex flex-col md:flex-row items-center gap-3 p-4">
                            <input
                              type="password"
                              placeholder="Nova senha"
                              value={passwords.password}
                              onChange={(e) =>
                                setPasswords((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="bg-transparent border border-gray-500 rounded-lg px-3 py-2 text-white w-full md:w-1/3 focus:border-[#00CC82] outline-none"
                            />
                            <input
                              type="password"
                              placeholder="Confirmar senha"
                              value={passwords.confirm}
                              onChange={(e) =>
                                setPasswords((prev) => ({
                                  ...prev,
                                  confirm: e.target.value,
                                }))
                              }
                              className="bg-transparent border border-gray-500 rounded-lg px-3 py-2 text-white w-full md:w-1/3 focus:border-[#00CC82] outline-none"
                            />
                            <div className="flex gap-3 mt-2 md:mt-0">
                              <button
                                disabled={saving}
                                onClick={() => handlePasswordChange(user.id)}
                                className={`bg-[#00CC82] text-[#001B30] px-4 py-2 ${saving ? 'cursor-default' : 'cursor-pointer'} rounded-lg font-semibold hover:bg-[#00ff9f] transition disabled:opacity-50`}
                              >
                                {saving ? "Alterando..." : "Alterar"}
                              </button>
                              <button
                                onClick={() => {
                                  setOpenRow(null);
                                  setPasswords({ password: "", confirm: "" });
                                }}
                                className="border border-gray-500 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700/30 transition cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
