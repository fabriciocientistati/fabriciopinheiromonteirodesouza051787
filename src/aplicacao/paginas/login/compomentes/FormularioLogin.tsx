import { useState } from "react";
import { MENSAGENS_VALIDACAO } from "../../../utils/mensagensValidacao";

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
  const [erros, setErros] = useState<{
    username?: string;
    password?: string;
  }>({});

  function validar() {
    const novoErros: typeof erros = {};

    if (!username.trim()) novoErros.username = MENSAGENS_VALIDACAO.USUARIO_OBRIGATORIO;
    if (!password.trim()) novoErros.password = MENSAGENS_VALIDACAO.SENHA_OBRIGATORIA;

    setErros(novoErros);
    return Object.keys(novoErros).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Autenticação
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-slate-500">
          Informe suas credenciais para continuar.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Usuário
          </label>
          <input
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="admin"
            className={
              `mt-2 w-full px-4 py-3 rounded-xl border bg-white/90 shadow-sm focus:ring-2 focus:outline-none transition ` +
              (erros.username
                ? "border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:ring-[#1f3da0]/30")
            }
          />
          {erros.username && (
            <p className="text-red-600 text-sm mt-1">{erros.username}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="admin"
            className={
              `mt-2 w-full px-4 py-3 rounded-xl border bg-white/90 shadow-sm focus:ring-2 focus:outline-none transition ` +
              (erros.password
                ? "border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:ring-[#1f3da0]/30")
            }
          />
          {erros.password && (
            <p className="text-red-600 text-sm mt-1">{erros.password}</p>
          )}
        </div>
      </div>

      {erro && (
        <p className="text-red-600 text-sm text-center font-medium">{erro}</p>
      )}

      <button
        type="submit"
        disabled={carregando}
        className={
          `w-full py-3 rounded-xl text-white font-medium transition shadow-lg shadow-[#193282]/20 ` +
          (carregando ? "bg-[#9fb2d9]" : "bg-[#193282] hover:bg-[#1f3da0]")
        }
      >
        {carregando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
