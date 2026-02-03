import { render, screen } from '@testing-library/react'
import { CardListagem } from './CardListagem'

describe('CardListagem', () => {
  it('renderiza titulo, linhas e fallback de foto', () => {
    render(
      <CardListagem
        titulo="Tutor Teste"
        linhas={['Linha 1', 'Linha 2']}
        imagemUrl={null}
        imagemAlt="Tutor"
        acoes={<button>Acao</button>}
      />,
    )

    expect(screen.getByText('Tutor Teste')).toBeInTheDocument()
    expect(screen.getByText('Linha 1')).toBeInTheDocument()
    expect(screen.getByText('Linha 2')).toBeInTheDocument()
    expect(screen.getByText('Sem foto')).toBeInTheDocument()
  })
})
