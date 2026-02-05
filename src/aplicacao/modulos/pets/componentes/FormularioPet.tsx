import { useState } from 'react'
import type { PetViewModel } from '../../../modelos'
import { Input } from '../../../componentes/ui/Input'
import { Botao } from '../../../componentes/ui/Botao'
import { UploadFoto } from '../../../componentes/ui/UploadFoto'
import { useNavigate } from 'react-router-dom'
import { validarNumeroPositivo, validarObrigatorio } from '../../../utils/validacoes'
import { MENSAGENS_VALIDACAO } from '../../../utils/mensagensValidacao'

interface FormularioPetProps {
  petInicial?: PetViewModel
  onSubmit: (dados: {
    nome: string
    raca: string
    idade: number
    foto?: File | null
    removerFoto?: boolean
  }) => Promise<void>
  textoBotao?: string
}

export function FormularioPet({
  petInicial,
  onSubmit,
  textoBotao = 'Salvar',
}: FormularioPetProps) {
  const navigate = useNavigate()

  const [nome, setNome] = useState(petInicial?.nome ?? '')
  const [raca, setRaca] = useState(petInicial?.raca ?? '')
  const [idade, setIdade] = useState<number | ''>(petInicial?.idade ?? '')
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoRemovida, setFotoRemovida] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const [erros, setErros] = useState<{
    nome?: string
    raca?: string
    idade?: string
  }>({})

  function validar() {
    const novoErros: typeof erros = {}

    if (!validarObrigatorio(nome))
      novoErros.nome = MENSAGENS_VALIDACAO.NOME_OBRIGATORIO
    if (!validarObrigatorio(raca))
      novoErros.raca = MENSAGENS_VALIDACAO.ESPECIE_OBRIGATORIA
    if (!validarNumeroPositivo(idade))
      novoErros.idade = MENSAGENS_VALIDACAO.IDADE_POSITIVA

    setErros(novoErros)
    return Object.keys(novoErros).length === 0
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validar()) return

    setSalvando(true)
    try {
      await onSubmit({
        nome,
        raca,
        idade: Number(idade),
        foto,
        removerFoto: fotoRemovida,
      })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border rounded-lg shadow-md p-6 max-w-2xl mx-auto"
    >
      <div className="space-y-4">
        <Input
          label="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
          className="w-full"
          erro={erros.nome}
        />

        <Input
          label="Espécie"
          value={raca}
          onChange={e => setRaca(e.target.value)}
          required
          className="w-full"
          erro={erros.raca}
        />

        <Input
          label="Idade"
          type="number"
          value={idade}
          onChange={e =>
            setIdade(e.target.value === '' ? '' : Number(e.target.value))
          }
          required
          className="w-full"
          erro={erros.idade}
        />
      </div>

      <UploadFoto
        key={petInicial?.id ?? 'novo'}
        fotoAtual={petInicial?.foto?.url}
        onUpload={(arquivo) => {
          setFoto(arquivo)
          setFotoRemovida(arquivo === null)
        }}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <Botao
          variante="perigo"
          type="button"
          onClick={() => navigate('/pets')}
          className="w-full sm:w-auto"
        >
          Voltar
        </Botao>

        <Botao type="submit" disabled={salvando} className="w-full sm:w-auto">
          {salvando ? 'Salvando...' : textoBotao}
        </Botao>
      </div>
    </form>
  )
}
