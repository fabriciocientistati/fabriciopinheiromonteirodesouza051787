import { Outlet } from "react-router-dom";

export function LayoutPublico() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Outlet />
    </div>
  );
}
