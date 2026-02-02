import { Route } from 'react-router-dom'
import { lazy } from 'react'
import { LayoutPublico } from '../layouts/LayoutPublico'
import { LoginPagina } from '../paginas/login/LoginPagina'

export const Login = lazy(() => 
  import('../paginas/login/LoginPagina').then(modulo => ({
    default: modulo.LoginPagina,
  })),
)

export function RotasPublicas() {
    return (
    <Route element={<LayoutPublico />}>
        <Route path="/login" element={<LoginPagina  />} />
    </Route>
    )
}