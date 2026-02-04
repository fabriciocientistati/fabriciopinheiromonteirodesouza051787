import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Tutor } from '../../../dominio/modelos/Tutor'
import type { PetVinculado } from '../../../dominio/modelos/PetVinculado'
import { useTutoresEstado } from '../../hooks/useTutoresEstado'
import { tutoresFacade } from '../../facades/TutoresFacade'
import { petsFacade } from '../../facades/PetsFacade'
import { Titulo } from '../../componentes/ui/Titulo'
import { Botao } from '../../componentes/ui/Botao'
import { FormularioTutor } from './componentes/FormularioTutor'
import { ListaPetsVinculados } from './componentes/ListaPetsVinculados'
import { VincularPetModal } from './componentes/VincularPetModal'
import { useAutenticacao } from '../../hooks/useAutenticacao'

type FormularioTutorDados = {
  nome: string
  email: string
  telefone: string
  endereco: string
  cpf: string
  foto?: File | null
  removerFoto?: boolean
}

export function FormularioTutorPagina() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { tutorSelecionado, carregando, erro } = useTutoresEstado()
  const { versaoToken } = useAutenticacao()

  const edicao = Boolean(id)
  const carregandoEdicao = edicao && (carregando || !tutorSelecionado)
  const [vincularPetAberto, setVincularPetAberto] = useState(false)
  const [petsSelecionados, setPetsSelecionados] = useState<PetVinculado[]>([])

  useEffect(() => {
    if (edicao && id) {
      tutoresFacade.buscarPorId(Number(id))
    }
  }, [edicao, id, versaoToken])

  function montarDadosPersistencia(
    dados: FormularioTutorDados,
  ): Omit<Tutor, 'id' | 'foto'> {
    const cpfNormalizado = dados.cpf.replace(/\D/g, '')

    return {
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      endereco: dados.endereco,
      cpf: cpfNormalizado,
    }
  }

  async function salvarTutor(dados: FormularioTutorDados) {
    const dadosPersistencia = montarDadosPersistencia(dados)
    let tutorSalvo: Tutor

    if (edicao && id) {
      tutorSalvo = await tutoresFacade.atualizar(Number(id), dadosPersistencia)
    } else {
      tutorSalvo = await tutoresFacade.criar(dadosPersistencia)
    }

    if (dados.foto) {
      await tutoresFacade.atualizarFoto(
        tutorSalvo.id,
        dados.foto,
        edicao ? tutorSelecionado?.foto?.id ?? null : null,
      )
    }

    if (edicao && dados.removerFoto && !dados.foto && tutorSelecionado?.foto?.id) {
      await tutoresFacade.removerFoto(tutorSalvo.id, tutorSelecionado.foto.id)
    }
    if (!edicao && petsSelecionados.length > 0) {
      for (const pet of petsSelecionados) {
        await tutoresFacade.vincularPet(tutorSalvo.id, pet.id)
      }
    }

    navigate('/tutores', {
      state: {
        mensagemSucesso: edicao
          ? 'Tutor alterado com sucesso.'
          : 'Tutor criado com sucesso.',
      },
    })
  }

  if (carregandoEdicao) {
    return <p>Carregando tutor...</p>
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
            {erro}
          </div>
        )}

        <Titulo>{edicao ? 'Editar Tutor' : 'Inserir Tutor'}</Titulo>

        <FormularioTutor 
          tutorInicial={edicao ? tutorSelecionado ?? undefined : undefined}
          onSubmit={salvarTutor}
          textoBotao={edicao ? 'Atualizar' : 'Cadastrar'}
        />
        {!edicao && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Vincular pets (opcional)
              </h3>
              <Botao
                variante="sucesso"
                type="button"
                onClick={() => setVincularPetAberto(true)}
                className="w-full sm:w-auto"
              >
                Vincular Pet
              </Botao>
            </div>

            <ListaPetsVinculados
              pets={petsSelecionados}
              onRemover={(idPet) =>
                setPetsSelecionados((atual) =>
                  atual.filter((pet) => pet.id !== idPet),
                )
              }
            />

            <VincularPetModal
              aberto={vincularPetAberto}
              onFechar={() => setVincularPetAberto(false)}
              onVincular={async (idPet) => {
                setPetsSelecionados((atual) => {
                  if (atual.some((pet) => pet.id === idPet)) return atual

                  const pet = petsFacade
                    .obterSnapshot()
                    .itens.find((item) => item.id === idPet)

                  if (!pet) return atual

                  return [
                    ...atual,
                    {
                      id: pet.id,
                      nome: pet.nome,
                      raca: pet.raca ?? '',
                      idade: pet.idade ?? 0,
                      foto: pet.foto,
                    },
                  ]
                })
              }}
              petsVinculados={petsSelecionados}
            />
          </>
        )}
      </div>
    </div>
  )
}

