import { render, screen } from '@testing-library/react'
import { ListaPets } from './ListaPets'

describe('ListaPets', () => {
  it('exibe nome e detalhes do pet na listagem', () => {
    render(
      <ListaPets
        pets={[
          {
            id: 1,
            nome: 'Thor',
            raca: 'Vira-premio',
            idade: 2,
          },
        ]}
        onSelecionar={() => {}}
        onEditar={() => {}}
        onExcluir={async () => {}}
      />,
    )

    expect(screen.getByText('Thor')).toBeInTheDocument()
    expect(screen.getByText('Vira-premio - 2 anos')).toBeInTheDocument()
  })
})
