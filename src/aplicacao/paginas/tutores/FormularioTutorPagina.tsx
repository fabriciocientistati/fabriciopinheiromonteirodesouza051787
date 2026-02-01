import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import type { Tutor } from '../../../dominio/modelos/Tutor'
import { useTutoresEstado } from '../../hooks/useTutoresEstado'
import { tutoresFacade } from '../../facades/TutoresFacade'
import { Titulo } from '../../componentes/ui/Titulo'
import { FormularioTutor } from './componentes/FormularioTutor'

type FormularioTutorDados = {
  nome: string
  email: string
  telefone: string
  endereco: string
  cpf: string
  foto?: File | null
}

export function FormularioTutorPagina() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { tutorSelecionado, carregando } = useTutoresEstado()

  const edicao = Boolean(id)

  useEffect(() => {
    if (edicao && id) {
      tutoresFacade.buscarPorId(Number(id))
    }
  }, [edicao, id])

  function montarDadosPersistencia(
    dados: FormularioTutorDados,
  ): Omit<Tutor, 'id' | 'foto'> {
    return {
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      endereco: dados.endereco,
      cpf: Number(dados.cpf),
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
      await tutoresFacade.atualizarFoto(tutorSalvo.id, dados.foto)
    }

    navigate('/tutores')
  }

  if (edicao && carregando) {
    return <p>Carregando tutor...</p>
  }

  return (
    <div>
      <Titulo>{edicao ? 'Editar Tutor' : 'Novo Tutor'}</Titulo>

      <FormularioTutor
        tutorInicial={edicao ? tutorSelecionado ?? undefined : undefined}
        onSubmit={salvarTutor}
        textoBotao={edicao ? 'Atualizar' : 'Cadastrar'}
      />
    </div>
  )
}
