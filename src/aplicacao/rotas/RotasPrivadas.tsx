import { Route } from 'react-router-dom'
import { lazy } from 'react'
import { RotaProtegida } from './RotaProtegida'

export const ListaPetsPagina = lazy(() =>
  import('../paginas/pets/ListaPets').then(modulo => ({
    default: modulo.ListaPets,
  })),
)

export const DetalhePetPagina = lazy(() =>
  import('../paginas/pets/DetalhePet').then(modulo => ({
    default: modulo.DetalhePet,
  })),
)


export function RotasPrivadas() {
    return (
    <>
        <Route
        path="/"
        element={
            <RotaProtegida>
                <ListaPetsPagina />
            </RotaProtegida>
        }
        />

        <Route
        path="/pets/:id"
        element={
            <RotaProtegida>
                <DetalhePetPagina />
            </RotaProtegida>
        }
        />
    </>
    )
}