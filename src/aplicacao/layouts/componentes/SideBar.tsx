import { useState } from "react";
import { NavLink } from "react-router-dom";
import { autenticacaoFacade } from "../../facades/AutenticacaoFacade";

export function Sidebar() {
  const [aberta, setAberta] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberta(true)}
        aria-label="Abrir menu"
        className="md:hidden fixed top-4 left-4 z-30 bg-[#193282] text-white p-2 rounded-lg shadow-lg border border-[#193282] hover:bg-[#1f3da0]"
      >
        Menu
      </button>

      {aberta && (
        <div
          onClick={() => setAberta(false)}
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-[#193282] text-white flex flex-col overflow-hidden
          transform transition-transform duration-300
          ${aberta ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:top-0 md:h-screen
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-[#1f3da0] justify-between">
          <span className="text-lg font-semibold tracking-wide">
            Pets & Tutores
          </span>

          <button
            onClick={() => setAberta(false)}
            aria-label="Fechar menu"
            className="md:hidden text-white/80 hover:text-white"
          >
            Fechar
          </button>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-2">
          <NavLink
            to="/tutores"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded pr-4 pl-3 py-2 border-l-4 transition ${
                isActive
                  ? "bg-[#1f3da0] text-white border-emerald-500"
                  : "border-transparent hover:bg-[#1f3da0] text-white/90"
              }`
            }
            onClick={() => setAberta(false)}
          >
            <span>Tutores</span>
          </NavLink>

          <NavLink
            to="/pets"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded pr-4 pl-3 py-2 border-l-4 transition ${
                isActive
                  ? "bg-[#1f3da0] text-white border-emerald-500"
                  : "border-transparent hover:bg-[#1f3da0] text-white/90"
              }`
            }
            onClick={() => setAberta(false)}
          >
            <span>Pets</span>
          </NavLink>
        </nav>

        <div className="px-4 py-4 border-t border-[#1f3da0] shrink-0 bg-[#193282]">
          <button
            onClick={() => autenticacaoFacade.logout()}
            className="w-full flex items-center gap-3 px-4 py-2 rounded text-red-200 hover:bg-[#1f3da0] transition"
          >
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}

