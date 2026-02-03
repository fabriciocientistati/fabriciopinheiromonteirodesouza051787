import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAutenticacao } from '../hooks/useAutenticacao'
import { FullPageFallback } from '../componentes/FullPageFallback'

export function RotaProtegida() {
  const estado = useAutenticacao()
  const location = useLocation()

  if (estado.carregando) {
    return <FullPageFallback />
  }

  if (!estado.autenticado) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
