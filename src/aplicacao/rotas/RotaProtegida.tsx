import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAutenticacao } from '../hooks/useAutenticacao'
import { FullPageFallback } from '../componentes/FullPageFallback'
import { MENSAGENS_ERRO } from '../utils/mensagensErro'

export function RotaProtegida() {
  const estado = useAutenticacao()
  const location = useLocation()
  const erroSessaoExpirada = estado.erro?.includes(
    MENSAGENS_ERRO.SESSAO_EXPIRADA,
  )

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
