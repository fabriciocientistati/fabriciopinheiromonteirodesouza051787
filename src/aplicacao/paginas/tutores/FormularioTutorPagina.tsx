import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { tutoresFacade } from '../../facades/TutoresFacade'
import { useObservable } from '../../hooks/useObservable'
import type { Tutor } from '../../../dominio/modelos/Tutor'

type FormularioTutorDados = Omit<Tutor, 'id' | 'foto'>

type FormularioTutorConteudoProps = {
  titulo: string
  valoresIniciais: FormularioTutorDados
  erro?: string
  onSalvar: (dados: FormularioTutorDados, arquivoFoto: File | null) => Promise<void>
}

function obterValoresIniciais(tutor?: Tutor | null): FormularioTutorDados {
  return {
    nome: tutor?.nome ?? '',
    email: tutor?.email ?? '',
    telefone: tutor?.telefone ?? '',
    endereco: tutor?.endereco ?? '',
    cpf: tutor?.cpf ?? 0,
  }
}

function FormularioTutorConteudo({
  titulo,
  valoresIniciais,
  erro,
  onSalvar,
}: FormularioTutorConteudoProps) {
  const [formulario, setFormulario] = useState<FormularioTutorDados>(valoresIniciais)
  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null)

  const aoSalvar = async () => {
    await onSalvar(formulario, arquivoFoto)
  }

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold">{titulo}</h1>

      {erro && <p className="text-red-600">{erro}</p>}

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nome completo"
          value={formulario.nome}
          onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={formulario.email}
          onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Telefone"
          value={formulario.telefone}
          onChange={(e) => setFormulario({ ...formulario, telefone: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Endereco"
          value={formulario.endereco}
          onChange={(e) => setFormulario({ ...formulario, endereco: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="CPF"
          value={formulario.cpf}
          onChange={(e) => setFormulario({ ...formulario, cpf: Number(e.target.value) })}
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setArquivoFoto(e.target.files[0])
            }
          }}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        onClick={aoSalvar}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Salvar
      </button>
    </div>
  )
}

export function FormularioTutorPagina() {
  const { id } = useParams()
  const navigate = useNavigate()
  const estado = useObservable(
    tutoresFacade.estado$,
    tutoresFacade.obterSnapshot(),
  )

  useEffect(() => {
    if (id) {
      tutoresFacade.carregarDetalhe(Number(id))
    }
  }, [id])

  const chaveFormulario = estado.tutorSelecionado?.id ?? `carregando-${id ?? 'novo'}`

  const aoSalvar = async (dados: FormularioTutorDados, arquivoFoto: File | null) => {
    try {
      let tutorSalvo: Tutor

      if (id) {
        tutorSalvo = await tutoresFacade.atualizar(Number(id), dados)
      } else {
        tutorSalvo = await tutoresFacade.criar(dados)
      }

      if (arquivoFoto) {
        await tutoresFacade.atualizarFoto(tutorSalvo.id, arquivoFoto)
      }

      navigate(`/tutores/${tutorSalvo.id}`)
    } catch (erro) {
      console.error(erro)
    }
  }

  if (id && estado.carregando && !estado.tutorSelecionado) {
    return <p className="p-6">Carregando dados do tutor...</p>
  }

  return (
    <FormularioTutorConteudo
      key={chaveFormulario}
      titulo={id ? 'Editar Tutor' : 'Novo Tutor'}
      valoresIniciais={obterValoresIniciais(estado.tutorSelecionado)}
      erro={estado.erro}
      onSalvar={aoSalvar}
    />
  )
}