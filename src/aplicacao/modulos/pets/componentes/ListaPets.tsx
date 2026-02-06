import { useEffect, useRef, useState } from 'react'
import type { PetViewModel } from '../../../modelos'
import { Botao } from '../../../componentes/ui/Botao'
import { CardListagem } from '../../../componentes/ui/CardListagem'
import { ConfirmacaoModal } from '../../../componentes/ui/ConfirmacaoModal'
import { Toast } from '../../../componentes/ui/Toast'

const TEMPO_UNDO_MS = 4000

interface ListaPetsProps {
  pets: PetViewModel[]
  onSelecionar: (id: number) => void
  onEditar: (id: number) => void
  onExcluir: (id: number) => Promise<void>
}

export function ListaPets({
  pets,
  onSelecionar,
  onEditar,
  onExcluir,
}: ListaPetsProps) {
  const [petParaExcluir, setPetParaExcluir] = useState<PetViewModel | null>(null)
  const [exclusaoPendente, setExclusaoPendente] = useState<PetViewModel | null>(null)
  const exclusaoTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (exclusaoTimeoutRef.current) {
        window.clearTimeout(exclusaoTimeoutRef.current)
      }
    }
  }, [])

  const agendarExclusao = (pet: PetViewModel) => {
    if (exclusaoTimeoutRef.current) {
      window.clearTimeout(exclusaoTimeoutRef.current)
    }

    setExclusaoPendente(pet)

    exclusaoTimeoutRef.current = window.setTimeout(() => {
      exclusaoTimeoutRef.current = null
      void onExcluir(pet.id)
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
          posicao="centro"
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map(pet => {
          const especieTexto = pet.raca ?? 'Espécie não informada'
          const idadeTexto =
            pet.idade != null ? `${pet.idade} anos` : 'Idade não informada'
          const detalhes = `${especieTexto} - ${idadeTexto}`

          return (
            <CardListagem
              key={pet.id}
              titulo={pet.nome}
              linhas={[detalhes]}
              imagemUrl={pet.foto?.url}
              imagemAlt={`Foto do pet ${pet.nome}`}
              onClick={() => onSelecionar(pet.id)}
              acoes={
                <>
                  <Botao onClick={() => onSelecionar(pet.id)} className="w-full">
                    Detalhar
                  </Botao>

                  <Botao
                    variante="laranja"
                    onClick={() => onEditar(pet.id)}
                    className="w-full"
                  >
                    Editar
                  </Botao>

                  <Botao
                    variante="perigo"
                    onClick={() => setPetParaExcluir(pet)}
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
        aberto={!!petParaExcluir}
        titulo="Excluir pet"
        onCancelar={() => setPetParaExcluir(null)}
        onConfirmar={() => {
          if (!petParaExcluir) return
          agendarExclusao(petParaExcluir)
          setPetParaExcluir(null)
        }}
        mensagem={
          <>
            Deseja realmente excluir o pet{' '}
            <strong>{petParaExcluir?.nome}</strong>?
          </>
        }
      />
    </>
  )
}


