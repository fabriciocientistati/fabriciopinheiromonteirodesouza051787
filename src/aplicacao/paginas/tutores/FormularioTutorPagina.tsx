import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { tutoresFacade } from '../../facades/TutoresFacade'
import { useObservable } from '../../hooks/useObservable'
import type { Tutor } from '../../../dominio/modelos/Tutor'
import { Input } from '../../componentes/ui/Input'
import { Botao } from '../../componentes/ui/Botao'
import { Secao } from '../../componentes/ui/Secao'
import { Titulo } from '../../componentes/ui/Titulo'

type FormularioTutorDados = Omit<Tutor, 'id' | 'foto'>
type FormularioTutorErros = Partial<Record<keyof FormularioTutorDados, string>>

type FormularioTutorConteudoProps = {
  titulo: string
  valoresIniciais: FormularioTutorDados
  erro?: string
  salvando?: boolean
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

function validarFormulario(dados: FormularioTutorDados): FormularioTutorErros {
  const erros: FormularioTutorErros = {}

  if (!dados.nome.trim()) erros.nome = 'Nome é obrigatório.'
  if (!dados.email.trim()) erros.email = 'Email é obrigatório.'
  else if (!/^\S+@\S+\.\S+$/.test(dados.email)) erros.email = 'Email inválido.'
  if (!dados.telefone.trim()) erros.telefone = 'Telefone é obrigatório.'
  if (!dados.endereco.trim()) erros.endereco = 'Endereço é obrigatório.'
  if (!Number.isFinite(dados.cpf) || dados.cpf <= 0) erros.cpf = 'CPF é obrigatório.'

  return erros
}

function FormularioTutorConteudo({
  titulo,
  valoresIniciais,
  erro,
  salvando = false,
  onSalvar,
}: FormularioTutorConteudoProps) {

  const [formulario, setFormulario] = useState<FormularioTutorDados>(valoresIniciais)
  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [erros, setErros] = useState<FormularioTutorErros>({})

  function limparErro(campo: keyof FormularioTutorDados) {
    if (!erros[campo]) return
    setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  const aoSalvar = async () => {
    const validacao = validarFormulario(formulario)
    if (Object.values(validacao).some(Boolean)) {
      setErros(validacao)
      return
    }
    await onSalvar(formulario, arquivoFoto)
  }

  function aoSelecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setArquivoFoto(arquivo)
    setFotoPreview(URL.createObjectURL(arquivo))
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">

      <Titulo>{titulo}</Titulo>

      {erro && <p className="text-red-600">{erro}</p>}

      {/* FOTO */}
      <Secao titulo="Foto do Tutor">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-2">
            <img
              src={fotoPreview || '/sem-foto.png'}
              alt="Foto do tutor"
              className="w-24 h-24 rounded-full object-cover border"
            />

            {fotoPreview && (
              <Botao
                variante="perigo"
                onClick={() => {
                  setFotoPreview(null)
                  setArquivoFoto(null)
                }}
                className="px-2 py-1 text-xs"
              >
                Remover foto
              </Botao>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={aoSelecionarArquivo}
            className="block"
          />
        </div>
      </Secao>

      {/* CAMPOS */}
      <Secao titulo="Dados do Tutor">
        <div className="space-y-4">

          <Input
            label="Nome completo"
            value={formulario.nome}
            onChange={(e) => {
              limparErro('nome')
              setFormulario({ ...formulario, nome: e.target.value })
            }}
            erro={erros.nome}
          />

          <Input
            label="Email"
            value={formulario.email}
            onChange={(e) => {
              limparErro('email')
              setFormulario({ ...formulario, email: e.target.value })
            }}
            erro={erros.email}
          />

          <Input
            label="Telefone"
            value={formulario.telefone}
            onChange={(e) => {
              limparErro('telefone')
              setFormulario({ ...formulario, telefone: e.target.value })
            }}
            erro={erros.telefone}
          />

          <Input
            label="Endereço"
            value={formulario.endereco}
            onChange={(e) => {
              limparErro('endereco')
              setFormulario({ ...formulario, endereco: e.target.value })
            }}
            erro={erros.endereco}
          />

          <Input
            label="CPF"
            type="number"
            value={formulario.cpf}
            onChange={(e) => {
              limparErro('cpf')
              const valor = Number(e.target.value)
              setFormulario({
                ...formulario,
                cpf: Number.isNaN(valor) ? 0 : valor,
              })
            }}
            erro={erros.cpf}
          />

        </div>
      </Secao>

      {/* BOTÕES */}
      <div className="flex justify-end gap-3">
        <Botao variante="perigo" onClick={() => history.back()}>
          Voltar
        </Botao>

        <Botao variante="sucesso" onClick={aoSalvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </Botao>
      </div>

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
    if (id) tutoresFacade.carregarDetalhe(Number(id))
  }, [id])

  const chaveFormulario = estado.tutorSelecionado?.id ?? `carregando-${id ?? 'novo'}`

  const aoSalvar = async (dados: FormularioTutorDados, arquivoFoto: File | null) => {
    try {
      let tutorSalvo: Tutor

      if (id) tutorSalvo = await tutoresFacade.atualizar(Number(id), dados)
      else tutorSalvo = await tutoresFacade.criar(dados)

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
      salvando={estado.criando}
      onSalvar={aoSalvar}
    />
  )
}
