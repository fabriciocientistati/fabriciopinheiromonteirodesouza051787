import { Routes, Route } from 'react-router-dom'
import { lazy } from 'react'

const ListaPetsPagina = lazy(() =>
  import('../../paginas/pets/ListaPetsPagina').then(m => ({
    default: m.ListaPetsPagina,
  })),
)

const FormularioPetPagina = lazy(() =>
  import('../../paginas/pets/FormularioPetPagina').then(m => ({
    default: m.FormularioPetPagina,
  })),
)

const DetalhePetPagina = lazy(() =>
  import('../../paginas/pets/DetalhePetPagina').then(m => ({
    default: m.DetalhePetPagina,
  })),
)

export function PetsRotas() {
  return (
    <Routes>
      <Route index element={<ListaPetsPagina />} />
      <Route path="novo" element={<FormularioPetPagina />} />
      <Route path=":id/editar" element={<FormularioPetPagina />} />
      <Route path=":id" element={<DetalhePetPagina />} />
    </Routes>
  )
}
