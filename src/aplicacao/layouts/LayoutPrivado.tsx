import { Outlet } from "react-router-dom";
import { Sidebar } from "./componentes/SideBar";
import { autenticacaoFacade } from "../facades/AutenticacaoFacade";
import { useLimparEstadoPorModulo } from "../hooks/useLimparEstadoPorModulo";

export function LayoutPrivado() {
  useLimparEstadoPorModulo();

  return (
    <div className="min-h-screen flex bg-[#f3f5fb]">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="md:hidden flex justify-end pb-4">
            <button
              onClick={() => autenticacaoFacade.logout()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-red-200 text-red-600 bg-white shadow-sm hover:bg-red-50 transition"
            >
              Sair
            </button>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
