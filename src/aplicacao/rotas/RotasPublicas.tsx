import { Route } from 'react-router-dom'
import { lazy } from 'react'

const Login = lazy(() => import('../paginas/login/LoginPagina'))

export function RotasPublicas() {
    return (
    <>
        <Route path="/login" element={<Login />} />
    </>
    )
}