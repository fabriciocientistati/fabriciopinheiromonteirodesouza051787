import { useState } from "react";
import { NavLink } from "react-router-dom";
import { autenticacaoFacade } from "../../facades/AutenticacaoFacade";

export function Sidebar() {
  const [aberta, setAberta] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberta(true)}
        className="md:hidden fixed top-4 left-4 z-30 bg-[#6610f2] text-white p-2 rounded-lg shadow"
      >
        ☰
      </button>

      {aberta && (
        <div
          onClick={() => setAberta(false)}
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-30
          w-64 bg-[#6610f2] text-white flex flex-col
          transform transition-transform duration-300
          ${aberta ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-[#4b0bb8] justify-between">
          <span className="text-lg font-semibold tracking-wide">
            Pets & Tutores
          </span>

          <button
            onClick={() => setAberta(false)}
            className="md:hidden text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink
            to="/tutores"
            className={({ isActive }) =>
              `
              flex items-center gap-3 rounded px-4 py-2 transition
              ${isActive ? "bg-[#4b0bb8]" : "hover:bg-[#5a0de0]"}
            `
            }
            onClick={() => setAberta(false)}
          >
            👤 <span>Tutores</span>
          </NavLink>

          <NavLink
            to="/pets"
            className={({ isActive }) =>
              `
              flex items-center gap-3 rounded px-4 py-2 transition
              ${isActive ? "bg-[#4b0bb8]" : "hover:bg-[#5a0de0]"}
            `
            }
            onClick={() => setAberta(false)}
          >
            🐾 <span>Pets</span>
          </NavLink>
        </nav>

        <div className="px-4 py-4 border-t border-[#4b0bb8]">
          <button
            onClick={() => autenticacaoFacade.logout()}
            className="
              w-full flex items-center gap-3 px-4 py-2 rounded
              text-red-200 hover:bg-[#5a0de0] transition
            "
          >
            🚪 <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
