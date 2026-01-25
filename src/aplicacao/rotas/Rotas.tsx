import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import LayoutBase from "../layouts/LayoutBase";
import { FullPageFallback } from "../componentes/FullPageFallback";

// Lazy loading das páginas
const PetsPagina = lazy(() => import("../paginas/pets/PetsPagina"));
const TutoresPagina = lazy(() => import("../paginas/tutores/TutoresPagina"));

export default function Rotas() {
  return (
    <LayoutBase>
      <Suspense fallback={<FullPageFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/pets" replace />} />
          <Route path="/pets" element={<PetsPagina />} />
          <Route path="/tutores" element={<TutoresPagina />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </LayoutBase>
  );
}
