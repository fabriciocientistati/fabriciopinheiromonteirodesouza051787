import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { petsFacade } from '../../facades/PetsFacade'

export function CriarPet() {
  const [nome, setNome] = useState('')
  const [raca, setRaca] = useState('')
  const [idade, setIdade] = useState(0)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const navigate = useNavigate()

  function selecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setArquivo(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    try {
      const pet = await petsFacade.criarComImagem(
        { nome, raca, idade },
        arquivo ?? undefined
      )

      navigate(`/pets/${pet.id}`)
    } catch {
      setErro('Erro ao criar pet')
    }
  }

  return (
    <form onSubmit={salvar}>
      <h1>Criar Pet</h1>

      <input
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
      />

      <input
        placeholder="Raça"
        value={raca}
        onChange={e => setRaca(e.target.value)}
      />

      <input
        type="number"
        placeholder="Idade"
        value={idade}
        onChange={e => setIdade(Number(e.target.value))}
      />

      <input type="file" accept="image/*" onChange={selecionarArquivo} />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded mt-2"
        />
      )}

      {erro && <p>{erro}</p>}

      <button type="submit">Salvar</button>
      <button type="button" onClick={() => navigate('/')}>Voltar para lista</button>
    </form>
  )
}
