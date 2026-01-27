import { Route } from 'react-router-dom'
import { lazy } from 'react'
import { RotaProtegida } from './RotaProtegida'

const ListaPets = lazy(() => import('../paginas/pets/ListaPets'))
const DetalhePet = lazy(() => import('../paginas/pets/DetalhePet'))

export function RotasPrivadas() {
    return (
    <>
        <Route
        path="/"
        element={
            <RotaProtegida>
                <ListaPets />
            </RotaProtegida>
        }
        />

        <Route
        path="/pets/:id"
        element={
            <RotaProtegida>
                <DetalhePet />
            </RotaProtegida>
        }
        />
    </>
    )
}