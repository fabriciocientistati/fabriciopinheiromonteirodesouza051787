import { Navigate } from 'react-router-dom'
import { useAutenticacao } from '../hooks/useAutenticacao'
import type { JSX } from 'react'

export function RotaProtegida({ children }: { children: JSX.Element }) {
  const estado = useAutenticacao()

  if (estado.carregando) {
    return null 
  }

  if (!estado.autenticado) {
    return <Navigate to="/login" replace />
  }

  return children

}
