import { useEffect, useRef, useState } from 'react'
import type { TutorViewModel } from '../../../modelos'
import { Botao } from '../../../componentes/ui/Botao'
import { CardListagem } from '../../../componentes/ui/CardListagem'
import { ConfirmacaoModal } from '../../../componentes/ui/ConfirmacaoModal'
import { Toast } from '../../../componentes/ui/Toast'
import { formatarTelefone } from '../../../utils/validacoes'

const TEMPO_UNDO_MS = 4000

interface ListaTutoresProps {
  tutores: TutorViewModel[]
  onSelecionar: (id: number) => void
  onEditar: (id: number) => void
  onExcluir: (id: number) => Promise<void>
}

export function ListaTutores({
  tutores,
  onSelecionar,
  onEditar,
  onExcluir,
}: ListaTutoresProps) {
  const [tutorParaExcluir, setTutorParaExcluir] = useState<TutorViewModel | null>(null)
  const [exclusaoPendente, setExclusaoPendente] = useState<TutorViewModel | null>(null)
  const exclusaoTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (exclusaoTimeoutRef.current) {
        window.clearTimeout(exclusaoTimeoutRef.current)
      }
    }
  }, [])

  const agendarExclusao = (tutor: TutorViewModel) => {
    if (exclusaoTimeoutRef.current) {
      window.clearTimeout(exclusaoTimeoutRef.current)
    }

    setExclusaoPendente(tutor)

    exclusaoTimeoutRef.current = window.setTimeout(() => {
      exclusaoTimeoutRef.current = null
      void onExcluir(tutor.id)
        .catch(() => {})
        .finally(() => setExclusaoPendente(null))
    }, TEMPO_UNDO_MS)
  }

  const desfazerExclusao = () => {
    if (exclusaoTimeoutRef.current) {
      window.clearTimeout(exclusaoTimeoutRef.current)
      exclusaoTimeoutRef.current = null
    }
    setExclusaoPendente(null)
  }

  return (
    <>
      {exclusaoPendente && (
        <Toast
          mensagem={`Exclusão de "${exclusaoPendente.nome}" em ${TEMPO_UNDO_MS / 1000}s.`}
          tipo="info"
          tempoMs={TEMPO_UNDO_MS}
          onFechar={() => setExclusaoPendente(null)}
          acaoLabel="Desfazer"
          onAcao={desfazerExclusao}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tutores.map(tutor => {
          const telefoneFormatado = formatarTelefone(tutor.telefone)

          return (
            <CardListagem
              key={tutor.id}
              titulo={tutor.nome}
              linhas={[telefoneFormatado]}
              imagemUrl={tutor.foto?.url}
              imagemAlt={`Foto do tutor ${tutor.nome}`}
              acoes={
                <>
                  <Botao onClick={() => onSelecionar(tutor.id)} className="w-full">
                    Detalhar
                  </Botao>
                  <Botao
                    variante="laranja"
                    onClick={() => onEditar(tutor.id)}
                    className="w-full"
                  >
                    Editar
                  </Botao>
                  <Botao
                    variante="perigo"
                    onClick={() => setTutorParaExcluir(tutor)}
                    className="w-full"
                  >
                    Excluir
                  </Botao>
                </>
              }
            />
          )
        })}
      </div>

      <ConfirmacaoModal
        aberto={!!tutorParaExcluir}
        titulo="Excluir tutor"
        onCancelar={() => setTutorParaExcluir(null)}
        onConfirmar={() => {
          if (!tutorParaExcluir) return
          agendarExclusao(tutorParaExcluir)
          setTutorParaExcluir(null)
        }}
        mensagem={
          <>
            Deseja realmente excluir o tutor{' '}
            <strong>{tutorParaExcluir?.nome}</strong>?
          </>
        }
      />
    </>
  )
}


