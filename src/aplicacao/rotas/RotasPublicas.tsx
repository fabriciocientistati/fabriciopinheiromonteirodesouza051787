import { Route } from 'react-router-dom'
import { lazy } from 'react'

export const Login = lazy(() => 
  import('../paginas/login/LoginPagina').then(modulo => ({
    default: modulo.LoginPagina,
  })),
)

export function RotasPublicas() {
    return (
    <>
        <Route path="/login" element={<Login />} />
    </>
    )
}