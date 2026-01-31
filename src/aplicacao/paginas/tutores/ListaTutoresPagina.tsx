import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tutoresFacade } from '../../facades/TutoresFacade'
import { useObservable } from '../../hooks/useObservable'
import { Botao } from '../../componentes/ui/Botao'
import { Card } from '../../componentes/ui/Card'
import { Secao } from '../../componentes/ui/Secao'
import { Titulo } from '../../componentes/ui/Titulo'
import { Input } from '../../componentes/ui/Input'

export function ListaTutoresPagina() {
  const navigate = useNavigate()

  const estado = useObservable(
    tutoresFacade.estado$,
    tutoresFacade.obterSnapshot(),
  )

  const [busca, setBusca] = useState(estado.filtroBusca ?? '')

  useEffect(() => {
    tutoresFacade.carregarPagina(estado.pagina)
  }, [estado.pagina, estado.filtroBusca])

  function aoBuscar(valor: string) {
    setBusca(valor)
    tutoresFacade.definirBusca(valor)
    tutoresFacade.irParaPagina(0)
  }

  const podeIrAnterior = estado.pagina > 0
  const podeIrProxima = estado.pagina + 1 < estado.contadorPagina

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <Titulo>Tutores</Titulo>

        <div className="flex gap-3 items-center">
          <Input
            placeholder="Pesquisar tutor..."
            value={busca}
            onChange={(e) => aoBuscar(e.target.value)}
            className="w-64"
          />

          <Botao onClick={() => navigate('/tutores/novo')}>
            Novo Tutor
          </Botao>
        </div>
      </div>

      <Secao titulo="Lista de Tutores">
        {estado.carregando && (
          <p className="text-gray-500">Carregando...</p>
        )}

        {estado.erro && (
          <p className="text-red-600">{estado.erro}</p>
        )}

        <p className="text-sm text-gray-600 mb-2">
          Página {estado.pagina + 1} de {estado.contadorPagina}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estado.itens.map((tutor) => (
            <Card
              key={tutor.id}
              className="cursor-pointer"
              onClick={() => navigate(`/tutores/${tutor.id}`)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={tutor.foto?.url || '/sem-foto.png'}
                  alt={tutor.nome}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{tutor.nome}</p>
                  <p className="text-sm text-gray-600">{tutor.telefone}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Botao
            variante="secundario"
            disabled={!podeIrAnterior}
            onClick={() => tutoresFacade.irParaPagina(0)}
          >
            «
          </Botao>

          <Botao
            variante="secundario"
            disabled={!podeIrAnterior}
            onClick={() => tutoresFacade.irParaPagina(estado.pagina - 1)}
          >
            ‹
          </Botao>

          <span className="text-sm">
            Página <strong>{estado.pagina + 1}</strong> de{' '}
            <strong>{estado.contadorPagina}</strong>
          </span>

          <Botao
            variante="secundario"
            disabled={!podeIrProxima}
            onClick={() => tutoresFacade.irParaPagina(estado.pagina + 1)}
          >
            ›
          </Botao>

          <Botao
            variante="secundario"
            disabled={!podeIrProxima}
            onClick={() =>
              tutoresFacade.irParaPagina(estado.contadorPagina - 1)
            }
          >
            »
          </Botao>
        </div>
      </Secao>
    </div>
  )
}
