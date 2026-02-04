import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useObservable } from "../../hooks/useObservable";
import { autenticacaoFacade } from "../../facades/AutenticacaoFacade";
import { autenticacaoEstado } from "../../../estado/autenticacaoEstado";
import { FormularioLogin } from "./compomentes/FormularioLogin";

export function LoginPagina() {
  const navigate = useNavigate();
  const location = useLocation();
  const mensagemSessao =
    (location.state as { mensagem?: string } | null)?.mensagem ?? null;

  const estado = useObservable(
    autenticacaoEstado.estado$,
    autenticacaoFacade.obterSnapshot()
  );

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    if (estado.autenticado) {
      const state = location.state as { from?: { pathname: string } } | null;
      const destino = state?.from?.pathname ?? "/";

      navigate(destino, { replace: true });
    }
  }, [estado.autenticado, navigate, location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f5fb] px-4">
      <div className="w-full max-w-sm space-y-4">
        {mensagemSessao && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md px-4 py-3 text-center">
            {mensagemSessao}
          </div>
        )}
        <FormularioLogin
          username={usuario}
          password={senha}
          carregando={estado.carregando}
          erro={estado.erro}
          onUsernameChange={setUsuario}
          onPasswordChange={setSenha}
          onSubmit={() =>
            autenticacaoFacade.login({
              username: usuario,
              password: senha,
            })
          }
        />
      </div>
    </div>
  );
}
