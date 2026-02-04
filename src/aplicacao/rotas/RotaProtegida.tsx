import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAutenticacao } from '../hooks/useAutenticacao'
import { FullPageFallback } from '../componentes/FullPageFallback'

export function RotaProtegida() {
  const estado = useAutenticacao()
  const location = useLocation()
  const mensagemSessao = estado.erro?.includes('Sessão expirada')
    ? estado.erro
    : undefined

  if (estado.carregando) {
    return <FullPageFallback />
  }

  if (!estado.autenticado) {
    return (
      <Navigate
        to="/login"
        replace
        state={
          mensagemSessao ? { from: location, mensagem: mensagemSessao } : undefined
        }
      />
    )
  }

  return <Outlet />
}
