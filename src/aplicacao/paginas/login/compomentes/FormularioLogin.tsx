import { useState } from "react";

interface FormularioLoginProps {
  username: string;
  password: string;
  carregando: boolean;
  erro?: string;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
}

export function FormularioLogin({
  username,
  password,
  carregando,
  erro,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: FormularioLoginProps) {
  const [erros, setErros] = useState<{ username?: string; password?: string }>({});

  function validar() {
    const novoErros: typeof erros = {};

    if (!username.trim()) novoErros.username = "O usuário é obrigatório.";
    if (!password.trim()) novoErros.password = "A senha é obrigatória.";

    setErros(novoErros);
    return Object.keys(novoErros).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-6 border border-gray-200"
    >
      <h1 className="text-2xl font-semibold text-gray-800 text-center">
        Acessar Sistema
      </h1>

      <div className="space-y-4">
        <div>
          <input
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="Usuário"
            className={`
              w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none
              ${erros.username ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#1f3da0]"}
            `}
          />
          {erros.username && (
            <p className="text-red-600 text-sm mt-1">{erros.username}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Senha"
            className={`
              w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none
              ${erros.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#1f3da0]"}
            `}
          />
          {erros.password && (
            <p className="text-red-600 text-sm mt-1">{erros.password}</p>
          )}
        </div>
      </div>

      {erro && (
        <p className="text-red-600 text-sm text-center font-medium">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={carregando}
        className={`
          w-full py-2 rounded-lg text-white font-medium transition
          ${carregando ? "bg-[#9fb2d9]" : "bg-[#193282] hover:bg-[#1f3da0]"}
        `}
      >
        {carregando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
