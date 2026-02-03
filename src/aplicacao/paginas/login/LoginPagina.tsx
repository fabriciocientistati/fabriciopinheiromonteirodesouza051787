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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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
  );
}

