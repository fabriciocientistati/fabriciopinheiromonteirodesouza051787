import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAutenticacao } from '../hooks/useAutenticacao'
import { FullPageFallback } from '../componentes/FullPageFallback'

export function RotaProtegida() {
  const estado = useAutenticacao()
  const location = useLocation()
  const erroSessaoExpirada = estado.erro?.includes('Sessão expirada')

  if (estado.carregando) {
    return <FullPageFallback />
  }

  if (!estado.autenticado) {
    return (
      <Navigate
        to="/login"
        replace
        state={erroSessaoExpirada ? { from: location } : undefined}
      />
    )
  }

  return <Outlet />
}
