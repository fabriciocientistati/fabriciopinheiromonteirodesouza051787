import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import type { Pet } from '../../../dominio/modelos/Pet'
import { usePetsEstado } from '../../hooks/usePetsEstado'
import { petsFacade } from '../../facades/PetsFacade'
import { Titulo } from '../../componentes/ui/Titulo'
import { FormularioPet } from './componentes/FormularioPet'

type FormularioPetDados = {
  nome: string
  raca: string
  idade: number
  foto?: File | null
}

export function FormularioPetPagina() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { petSelecionado, carregando, erro } = usePetsEstado()

  const edicao = Boolean(id)
  const carregandoEdicao = edicao && (carregando || !petSelecionado)

  useEffect(() => {
    if (edicao && id) {
      petsFacade.buscarPorId(Number(id))
    }
  }, [edicao, id])

  function montarDadosPersistencia(
    dados: FormularioPetDados,
  ): Omit<Pet, 'id' | 'foto'> {
    return {
      nome: dados.nome,
      raca: dados.raca,
      idade: dados.idade,
    }
  }

  async function salvarPet(dados: FormularioPetDados) {
    const dadosPersistencia = montarDadosPersistencia(dados)
    let petSalvo: Pet

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
      </div>
    </div>
  )
}
