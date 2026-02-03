import { useState } from 'react'
import type { Tutor } from '../../../../dominio/modelos/Tutor'
import { Botao } from '../../../componentes/ui/Botao'
import { CardListagem } from '../../../componentes/ui/CardListagem'
import { ConfirmacaoModal } from '../../../componentes/ui/ConfirmacaoModal'

interface ListaTutoresProps {
  tutores: Tutor[]
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
  const [tutorParaExcluir, setTutorParaExcluir] = useState<Tutor | null>(null)

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tutores.map(tutor => (
          <CardListagem
            key={tutor.id}
            titulo={tutor.nome}
            linhas={[tutor.email, tutor.telefone]}
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
        ))}
      </div>

      <ConfirmacaoModal
        aberto={!!tutorParaExcluir}
        titulo="Excluir tutor"
        onCancelar={() => setTutorParaExcluir(null)}
        onConfirmar={async () => {
          if (!tutorParaExcluir) return
          await onExcluir(tutorParaExcluir.id)
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