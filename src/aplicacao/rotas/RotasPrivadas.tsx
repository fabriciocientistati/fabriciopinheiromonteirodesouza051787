import { Route } from 'react-router-dom'
import { lazy } from 'react'
import { RotaProtegida } from './RotaProtegida'

export const CriarPetPagina = lazy(() => 
  import('../paginas/pets/CriarPet').then(modulo => ({
    default: modulo.CriarPet,
  })),
)

export const AtualizarPetPagina = lazy(() => 
  import('../paginas/pets/AtualizarPet').then(modulo => ({ 
    default: modulo.AtualizarPet, 
  })), 
)

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
          path="/pets/novo"
          element={
              <RotaProtegida>
              <CriarPetPagina/>
              </RotaProtegida>
          }
        />

        <Route
          path="/pets/:id/editar"
          element={
            <RotaProtegida>
              <AtualizarPetPagina/>
            </RotaProtegida>
          }
        />

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