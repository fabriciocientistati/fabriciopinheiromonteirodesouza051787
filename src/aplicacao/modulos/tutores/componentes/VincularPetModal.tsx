import { useEffect, useMemo, useState } from 'react'
import type { PetVinculado } from '../../../../dominio/modelos/PetVinculado'
import { petsFacade } from '../../../facades/PetsFacade'
import { useObservable } from '../../../hooks/useObservable'
import { Card } from '../../../componentes/ui/Card'
import { Botao } from '../../../componentes/ui/Botao'
import { Input } from '../../../componentes/ui/Input'
import { Toast } from '../../../componentes/ui/Toast'

const TEMPO_DEBOUNCE_MS = 300

interface Props {
  aberto: boolean
  onFechar: () => void
  onVincular: (idPet: number) => Promise<void>
  petsVinculados?: PetVinculado[]
}

export function VincularPetModal({
  aberto,
  onFechar,
  onVincular,
  petsVinculados = [],
}: Props) {
  const estadoPets = useObservable(
    petsFacade.estado$,
    petsFacade.obterSnapshot(),
  )

  const [busca, setBusca] = useState('')
  const [mensagemSucesso, setMensagemSucesso] = useState('')

  const petsVinculadosIds = useMemo(
    () => new Set(petsVinculados.map(pet => pet.id)),
    [petsVinculados],
  )

  useEffect(() => {
    if (!aberto) return

    const timeout = setTimeout(() => {
      petsFacade.definirBusca(busca.trim())
    }, TEMPO_DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [busca, aberto])

  async function vincularPet(idPet: number) {
    if (petsVinculadosIds.has(idPet)) return

    await onVincular(idPet)
    setMensagemSucesso('Pet vinculado com sucesso.')

    setBusca('')
    petsFacade.definirBusca('')
  }

  function fecharModal() {
    setMensagemSucesso('')
    setBusca('')
    petsFacade.definirBusca('')
    onFechar()
  }

  if (!aberto) return null

  const podeIrAnterior = estadoPets.pagina > 0
  const podeIrProxima = estadoPets.pagina + 1 < estadoPets.contadorPagina

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg lg:max-w-2xl xl:max-w-3xl p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-hidden">
        <h2 className="text-lg font-semibold">Vincular Pet</h2>

        <Input
          placeholder="Buscar pets..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full"
        />

        {mensagemSucesso && (
          <Toast
            mensagem={mensagemSucesso}
            tipo="sucesso"
            tempoMs={2000}
            onFechar={() => setMensagemSucesso('')}
            posicao="modal"
          />
        )}

        {estadoPets.carregando && (
          <p className="text-gray-500">Carregando pets...</p>
        )}
        {estadoPets.erro && <p className="text-red-600">{estadoPets.erro}</p>}

        <ul className="space-y-2 max-h-64 sm:max-h-72 lg:max-h-80 overflow-y-auto">
          {estadoPets.itens.map(pet => {
            const vinculado = petsVinculadosIds.has(pet.id)

            return (
              <Card
                key={pet.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={pet.foto?.url || '/sem-foto.png'}
                    alt={pet.nome}
                    className="w-12 h-12 rounded-full object-cover border"
                  />

                  <div className="text-center sm:text-left">
                    <p className="text-base sm:text-lg font-semibold text-slate-900">
                      {pet.nome}
                    </p>
                    <p className="text-sm text-gray-600">
                      {pet.raca ?? 'Sem raca'}
                    </p>
                  </div>
                </div>

                <Botao
                  variante="sucesso"
                  disabled={vinculado}
                  onClick={() => vincularPet(pet.id)}
                  className="w-full sm:w-auto"
                >
                  {vinculado ? 'Vinculado' : 'Vincular'}
                </Botao>
              </Card>
            )
          })}
        </ul>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
          <Botao
            variante="secundario"
            disabled={!podeIrAnterior}
            onClick={() => petsFacade.irParaPagina(0)}
          >
            &lt;&lt;
          </Botao>

          <Botao
            variante="secundario"
            disabled={!podeIrAnterior}
            onClick={() => petsFacade.irParaPagina(estadoPets.pagina - 1)}
          >
            &lt;
          </Botao>

          <span className="text-sm text-gray-700">
            Pagina <strong>{estadoPets.pagina + 1}</strong> de{' '}
            <strong>{estadoPets.contadorPagina}</strong>
          </span>

          <Botao
            variante="secundario"
            disabled={!podeIrProxima}
            onClick={() => petsFacade.irParaPagina(estadoPets.pagina + 1)}
          >
            &gt;
          </Botao>

          <Botao
            variante="secundario"
            disabled={!podeIrProxima}
            onClick={() => petsFacade.irParaPagina(estadoPets.contadorPagina - 1)}
          >
            &gt;&gt;
          </Botao>
        </div>

        <Botao
          variante="perigo"
          onClick={fecharModal}
          className="w-full sm:w-auto sm:self-end"
        >
          Fechar
        </Botao>
      </div>
    </div>
  )
}
