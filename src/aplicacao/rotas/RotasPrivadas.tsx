import { Route } from 'react-router-dom'
import { lazy } from 'react'
import { RotaProtegida } from './RotaProtegida'
import { LayoutPrivado } from '../layouts/LayoutPrivado'

const CriarPetPagina = lazy(() =>
  import('../paginas/pets/FormularioPetPagina').then(modulo => ({
    default: modulo.FormularioPetPagina,
  })),
)

const ListaPetsPagina = lazy(() =>
  import('../paginas/pets/ListaPetsPagina').then(modulo => ({
    default: modulo.ListaPetsPagina,
  })),
)

const DetalhePetPagina = lazy(() =>
  import('../paginas/pets/DetalhePetPagina').then(modulo => ({
    default: modulo.DetalhePetPagina,
  })),
)

const CriarTutorPagina = lazy(() =>
  import('../paginas/tutores/FormularioTutorPagina').then(modulo => ({
    default: modulo.FormularioTutorPagina,
  })),
)

const DetalheTutorPagina = lazy(() =>
  import('../paginas/tutores/DetalheTutorPagina').then(modulo => ({
    default: modulo.DetalheTutorPagina,
  })),
)

const ListaTutoresPagina = lazy(() =>
  import('../paginas/tutores/ListaTutoresPagina').then(modulo => ({
    default: modulo.ListaTutoresPagina,
  })),
)

export function RotasPrivadas() {
  return (
    <Route
      element={
        <RotaProtegida>
          <LayoutPrivado />
        </RotaProtegida>
      }
    >
      <Route path="/pets" element={<ListaPetsPagina />} />
      <Route path="/pets/novo" element={<CriarPetPagina />} />
      <Route path="/pets/:id/editar" element={<CriarPetPagina />} />
      <Route path="/pets/:id" element={<DetalhePetPagina />} />

      <Route path="/" element={<ListaPetsPagina />} />

      <Route path="/tutores" element={<ListaTutoresPagina />} />
      <Route path="/tutores/novo" element={<CriarTutorPagina />} />
      <Route path="/tutores/:id/editar" element={<CriarTutorPagina />} />
      <Route path="/tutores/:id" element={<DetalheTutorPagina />} />
    </Route>
  )
}
