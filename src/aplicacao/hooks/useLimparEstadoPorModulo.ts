import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { petsFacade } from "../facades/PetsFacade";
import { tutoresFacade } from "../facades/TutoresFacade";

type Modulo = "pets" | "tutores" | null;

function obterModulo(pathname: string): Modulo {
  if (pathname.startsWith("/pets")) return "pets";
  if (pathname.startsWith("/tutores")) return "tutores";
  return null;
}

export function useLimparEstadoPorModulo() {
  const location = useLocation();
  const ultimoModuloRef = useRef<Modulo>(null);

  useEffect(() => {
    const moduloAtual = obterModulo(location.pathname);
    if (!moduloAtual) return;

    const ultimoModulo = ultimoModuloRef.current;
    if (ultimoModulo && ultimoModulo !== moduloAtual) {
      if (ultimoModulo === "pets") {
        petsFacade.limpar();
      }
      if (ultimoModulo === "tutores") {
        tutoresFacade.limparEstado();
      }
    }

    ultimoModuloRef.current = moduloAtual;
  }, [location.pathname]);
}
