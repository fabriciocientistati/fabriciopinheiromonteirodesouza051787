import { render, screen } from '@testing-library/react'
import { ListaTutores } from './ListaTutores'

describe('ListaTutores', () => {
  it('exibe telefone mascarado na listagem', () => {
    render(
      <ListaTutores
        tutores={[
          {
            id: 1,
            nome: 'Fabricio',
            telefone: '65993086401',
            endereco: 'Rua A',
            cpf: '05178722181',
          },
        ]}
        onSelecionar={() => {}}
        onEditar={() => {}}
        onExcluir={async () => {}}
      />,
    )

    expect(screen.getByText('Fabricio')).toBeInTheDocument()
    expect(screen.getByText('(65) 99308-6401')).toBeInTheDocument()
  })
})
