import { Route, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { LayoutPublico } from '../layouts/LayoutPublico'

const LoginPagina = lazy(() =>
  import('../paginas/login/LoginPagina').then(modulo => ({
    default: modulo.LoginPagina,
  })),
)

export function RotasPublicas() {
  return (
    <Route element={<LayoutPublico />}>
      <Route path="/login" element={<LoginPagina />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>
  )
}