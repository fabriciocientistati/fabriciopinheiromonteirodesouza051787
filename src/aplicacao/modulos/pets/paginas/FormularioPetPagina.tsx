import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { PetViewModel, TutorViewModel } from '../../../modelos'
import { usePetsEstado } from '../hooks/usePetsEstado'
import { petsFacade } from '../../../facades/PetsFacade'
import { tutoresFacade } from '../../../facades/TutoresFacade'
import { Titulo } from '../../../componentes/ui/Titulo'
import { Botao } from '../../../componentes/ui/Botao'
import { FormularioPet } from '../componentes/FormularioPet'
import { ListaTutoresVinculados } from '../componentes/ListaTutoresVinculados'
import { VincularTutorModal } from '../componentes/VincularTutorModal'
import { useAutenticacao } from '../../../hooks/useAutenticacao'

type FormularioPetDados = {
  nome: string
  raca: string
  idade: number
  foto?: File | null
  removerFoto?: boolean
}

export function FormularioPetPagina() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { petSelecionado, carregando, erro } = usePetsEstado()
  const { versaoToken } = useAutenticacao()

  const edicao = Boolean(id)
  const carregandoEdicao = edicao && (carregando || !petSelecionado)
  const [vincularTutorAberto, setVincularTutorAberto] = useState(false)
  const [tutoresSelecionados, setTutoresSelecionados] = useState<TutorViewModel[]>([])

  useEffect(() => {
    if (edicao && id) {
      petsFacade.buscarPorId(Number(id))
    }
  }, [edicao, id, versaoToken])

  function montarDadosPersistencia(dados: FormularioPetDados) {
    return {
      nome: dados.nome,
      raca: dados.raca,
      idade: dados.idade,
    }
  }

  async function salvarPet(dados: FormularioPetDados) {
    const dadosPersistencia = montarDadosPersistencia(dados)
    let petSalvo: PetViewModel

    if (edicao && id) {
      petSalvo = await petsFacade.atualizar(Number(id), dadosPersistencia)
    } else {
      petSalvo = await petsFacade.criar(dadosPersistencia)
    }

    if (dados.foto) {
      await petsFacade.atualizarFoto(
        petSalvo.id,
        dados.foto,
        edicao ? petSelecionado?.foto?.id ?? null : null,
      )
    }

    if (edicao && dados.removerFoto && !dados.foto && petSelecionado?.foto?.id) {
      await petsFacade.removerFoto(petSalvo.id, petSelecionado.foto.id)
    }
    if (!edicao && tutoresSelecionados.length > 0) {
      for (const tutor of tutoresSelecionados) {
        await tutoresFacade.vincularPet(tutor.id, petSalvo.id)
      }
    }

    navigate('/pets', {
      state: {
        mensagemSucesso: edicao
          ? 'Pet alterado com sucesso.'
          : 'Pet criado com sucesso.',
      },
    })
  }

  if (edicao && erro) {
    return <p className="text-red-600 text-sm">{erro}</p>
  }

  if (carregandoEdicao) {
    return <p>Carregando pet...</p>
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Titulo>{edicao ? 'Editar Pet' : 'Inserir Pet'}</Titulo>

        <FormularioPet
          petInicial={edicao ? petSelecionado ?? undefined : undefined}
          onSubmit={salvarPet}
          textoBotao={edicao ? 'Atualizar' : 'Cadastrar'}
        />
        {!edicao && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Vincular tutores (opcional)
              </h3>
              <Botao
                variante="sucesso"
                type="button"
                onClick={() => setVincularTutorAberto(true)}
                className="w-full sm:w-auto"
              >
                Vincular Tutor
              </Botao>
            </div>

            <ListaTutoresVinculados
              tutores={tutoresSelecionados}
              onRemover={(idTutor) =>
                setTutoresSelecionados((atual) =>
                  atual.filter((tutor) => tutor.id !== idTutor),
                )
              }
            />

            <VincularTutorModal
              aberto={vincularTutorAberto}
              onFechar={() => setVincularTutorAberto(false)}
              onVincular={async (idTutor) => {
                setTutoresSelecionados((atual) => {
                  if (atual.some((tutor) => tutor.id === idTutor)) return atual

                  const tutor = tutoresFacade
                    .obterSnapshot()
                    .itens.find((item) => item.id === idTutor)

                  if (!tutor) return atual

                  return [...atual, tutor]
                })
              }}
              tutoresVinculados={tutoresSelecionados}
            />
          </>
        )}
      </div>
    </div>
  )
}

