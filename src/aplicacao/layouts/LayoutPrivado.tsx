import { Outlet } from "react-router-dom";
import { Botao } from "../componentes/ui/Botao";
import { autenticacaoFacade } from "../facades/AutenticacaoFacade";

export function LayoutPrivado() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="h-16 flex items-center justify-between px-6 border-b bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">
          Pets & Tutores
        </h1>

        <Botao
          variante="perigo"
          onClick={() => autenticacaoFacade.logout()}
          className="px-4 py-1"
        >
          Sair
        </Botao>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
