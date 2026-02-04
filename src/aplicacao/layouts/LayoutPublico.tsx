import { Outlet } from "react-router-dom";

export function LayoutPublico() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f5fb]">
      <Outlet />
    </div>
  );
}
