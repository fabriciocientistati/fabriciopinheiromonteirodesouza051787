import { useState } from 'react'
import type { PetViewModel } from '../../../modelos'
import { Botao } from '../../../componentes/ui/Botao'
import { CardListagem } from '../../../componentes/ui/CardListagem'
import { ConfirmacaoModal } from '../../../componentes/ui/ConfirmacaoModal'

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

  return (
    <>
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
        onConfirmar={async () => {
          if (!petParaExcluir) return
          await onExcluir(petParaExcluir.id)
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
