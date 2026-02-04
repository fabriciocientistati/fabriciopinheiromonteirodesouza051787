import { Outlet } from "react-router-dom";
import { Sidebar } from "./componentes/SideBar";

export function LayoutPrivado() {
  return (
    <div className="min-h-screen flex bg-[#f3f5fb]">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
