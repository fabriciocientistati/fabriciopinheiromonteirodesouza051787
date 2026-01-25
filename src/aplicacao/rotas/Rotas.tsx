import { Routes, Route, Navigate } from 'react-router-dom'
import LayoutBase from '../layouts/LayoutBase'
import { Suspense, lazy } from 'react'

//Lazy loading dos módulos
const PetsPagina = lazy(() => import('../paginas/pets/PetsPagina'))
const TutoresPagina = lazy(() => import('../paginas/tutores/TutoresPagina'))

function FullPageFallback() { 
  return ( 
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950"> 
    <div className="mb-6 flex items-center gap-2"> 
    <div className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" /> 
      <span className="text-lg font-semibold text-slate-100"> Preparando as informações... </span> 
    </div> 
      <p className="text-sm text-slate-400"> Só um instante, estamos buscando as informações necessárias. </p> 
    </div> ); 
  }

export default function Rotas() {
  
  return (
    <LayoutBase>
        <Suspense fallback={<div><FullPageFallback /></div>}>
            <Routes>
                <Route path="/" element={<Navigate to="/pets" replace />} />
                <Route path="/pets" element={<PetsPagina />} />
                <Route path="/tutores" element={<TutoresPagina />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>    
    </LayoutBase>
  )
}
