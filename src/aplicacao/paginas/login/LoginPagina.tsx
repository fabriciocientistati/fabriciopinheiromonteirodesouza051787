import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useObservable } from "../../hooks/useObservable";
import { autenticacaoFacade } from "../../facades/AutenticacaoFacade";
import { autenticacaoEstado } from "../../../estado/autenticacaoEstado";
import { FormularioLogin } from "./compomentes/FormularioLogin";

export function LoginPagina() {
  const navigate = useNavigate();
  const location = useLocation();

  const estado = useObservable(
    autenticacaoEstado.estado$,
    autenticacaoFacade.obterSnapshot()
  );
  const erroSessao =
    estado.erro && estado.erro.includes("Sessão expirada") ? estado.erro : null;
  const erroLogin = erroSessao ? undefined : estado.erro;

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    if (estado.autenticado) {
      const state = location.state as { from?: { pathname: string } } | null;
      const destino = state?.from?.pathname ?? "/pets";

      navigate(destino, { replace: true });
    }
  }, [estado.autenticado, navigate, location.state]);

  return (
    <div className="min-h-screen bg-[#f3f5fb] relative overflow-hidden">
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#193282]/15 blur-3xl" />
      <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-amber-300/20 blur-3xl" />

      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl grid lg:grid-cols-[1.1fr_0.9fr] rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-[0_25px_70px_-35px_rgba(15,23,42,0.45)] overflow-hidden">
          <div className="hidden lg:flex flex-col justify-between gap-8 p-10 bg-gradient-to-br from-[#193282] via-[#1f3da0] to-[#0e1e4f] text-white">
            <div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/80">
                <span className="h-px w-8 bg-white/70" />
                Portal Público
              </div>
              <h1 className="mt-6 text-3xl font-semibold leading-tight">
                Pets e Tutores
                <span className="block text-white/80">
                  Gestão e registros oficiais
                </span>
              </h1>
              <p className="mt-4 text-sm text-white/75">
                Acesse o painel para cadastrar, editar e vincular dados da base.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                Acesso de teste
              </p>
              <div className="mt-3 space-y-1 text-sm font-medium">
                <p>Usuário: admin</p>
                <p>Senha: admin</p>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            {erroSessao && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg px-4 py-3 text-center mb-6">
                {erroSessao}
              </div>
            )}

            <FormularioLogin
              username={usuario}
              password={senha}
              carregando={estado.carregando}
              erro={erroLogin}
              onUsernameChange={setUsuario}
              onPasswordChange={setSenha}
              onSubmit={() => {
                autenticacaoFacade.login({
                  username: usuario,
                  password: senha,
                })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

