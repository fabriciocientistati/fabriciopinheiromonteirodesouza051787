import { useEffect, useMemo, useRef, useState } from 'react'
import type { Tutor } from '../../../../dominio/modelos/Tutor'
import { tutoresFacade } from '../../../facades/TutoresFacade'
import { useObservable } from '../../../hooks/useObservable'
import { Card } from '../../../componentes/ui/Card'
import { Botao } from '../../../componentes/ui/Botao'
import { Input } from '../../../componentes/ui/Input'
import { formatarTelefone } from '../../../utils/validacoes'

const TEMPO_DEBOUNCE_MS = 300

interface Props {
  aberto: boolean
  onFechar: () => void
  onVincular: (idTutor: number) => Promise<void>
  tutoresVinculados?: Tutor[]
}

export function VincularTutorModal({
  aberto,
  onFechar,
  onVincular,
  tutoresVinculados = [],
}: Props) {
  const estadoTutores = useObservable(
    tutoresFacade.estado$,
    tutoresFacade.obterSnapshot(),
  )

  const [busca, setBusca] = useState('')
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const timeoutSucessoRef = useRef<number | null>(null)

  const tutoresVinculadosIds = useMemo(
    () => new Set(tutoresVinculados.map(tutor => tutor.id)),
    [tutoresVinculados],
  )

  useEffect(() => {
    if (!aberto) return

    const timeout = setTimeout(() => {
      tutoresFacade.definirBusca(busca.trim())
    }, TEMPO_DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [busca, aberto])

  async function vincularTutor(idTutor: number) {
    await onVincular(idTutor)
    setMensagemSucesso('Tutor vinculado com sucesso.')

    if (timeoutSucessoRef.current) {
      window.clearTimeout(timeoutSucessoRef.current)
    }

    timeoutSucessoRef.current = window.setTimeout(() => {
      setMensagemSucesso('')
      timeoutSucessoRef.current = null
    }, 2000)

    setBusca('')
    tutoresFacade.definirBusca('')
  }

  function fecharModal() {
    if (timeoutSucessoRef.current) {
      window.clearTimeout(timeoutSucessoRef.current)
      timeoutSucessoRef.current = null
    }

    setMensagemSucesso('')
    setBusca('')
    tutoresFacade.definirBusca('')
    onFechar()
  }

  if (!aberto) return null

  const podeIrAnterior = estadoTutores.pagina > 0
  const podeIrProxima = estadoTutores.pagina + 1 < estadoTutores.contadorPagina

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg lg:max-w-2xl xl:max-w-3xl p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-hidden">
        <h2 className="text-lg font-semibold">Vincular Tutor</h2>

        <Input
          placeholder="Buscar tutores..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full"
        />

        {mensagemSucesso && (
          <p className="text-emerald-600 text-sm">{mensagemSucesso}</p>
        )}

        {estadoTutores.carregando && (
          <p className="text-gray-500">Carregando tutores...</p>
        )}
        {estadoTutores.erro && (
          <p className="text-red-600">{estadoTutores.erro}</p>
        )}

        <ul className="space-y-2 max-h-64 sm:max-h-72 lg:max-h-80 overflow-y-auto">
          {estadoTutores.itens.map(tutor => {
            const vinculado = tutoresVinculadosIds.has(tutor.id)
            return (
              <Card
                key={tutor.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={tutor.foto?.url || '/sem-foto.png'}
                    alt={tutor.nome}
                    className="w-12 h-12 rounded-full object-cover border"
                  />

                  <div className="text-center sm:text-left">
                    <p className="text-base sm:text-lg font-semibold text-slate-900">
                      {tutor.nome}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatarTelefone(tutor.telefone)}
                    </p>
                  </div>
                </div>

                <Botao
                  variante="sucesso"
                  disabled={vinculado}
                  onClick={() => vincularTutor(tutor.id)}
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
            onClick={() => tutoresFacade.irParaPagina(0)}
          >
            «
          </Botao>

          <Botao
            variante="secundario"
            disabled={!podeIrAnterior}
            onClick={() => tutoresFacade.irParaPagina(estadoTutores.pagina - 1)}
          >
            ‹
          </Botao>

          <span className="text-sm text-gray-700">
            Página <strong>{estadoTutores.pagina + 1}</strong> de{' '}
            <strong>{estadoTutores.contadorPagina}</strong>
          </span>

          <Botao
            variante="secundario"
            disabled={!podeIrProxima}
            onClick={() => tutoresFacade.irParaPagina(estadoTutores.pagina + 1)}
          >
            ›
          </Botao>

          <Botao
            variante="secundario"
            disabled={!podeIrProxima}
            onClick={() =>
              tutoresFacade.irParaPagina(estadoTutores.contadorPagina - 1)
            }
          >
            »
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
