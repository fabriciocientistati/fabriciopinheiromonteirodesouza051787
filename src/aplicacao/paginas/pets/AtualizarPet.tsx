import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { petsFacade } from '../../facades/PetsFacade'
import type { PetsViewEstado } from '../../../estado/petsEstado'

export function AtualizarPet() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [raca, setRaca] = useState('')
  const [idade, setIdade] = useState<number | ''>('')
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

 const [fotoId, setFotoId] = useState<number | null>(null)

useEffect(() => {
  if (!id) return

  petsFacade.buscarPorId(Number(id))

  const sub = petsFacade.estado$.subscribe((estado: PetsViewEstado) => {
    if (estado.petSelecionado) {
      const pet = estado.petSelecionado
      setNome(pet.nome)
      setRaca(pet.raca ?? '')
      setIdade(pet.idade ?? '')
      setPreview(pet.foto?.url ?? null)
      setFotoId(pet.foto?.id ?? null)
    }
  })

  return () => sub.unsubscribe()
}, [id])

async function removerFoto() {
  if (!id || !fotoId) return

  try {
    await petsFacade.removerFoto(Number(id), fotoId)
    setPreview(null)
    setFotoId(null)
  } catch {
    setErro('Erro ao remover foto')
  }
}


  function selecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setArquivo(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  function validarCampos() {
    if (!nome.trim()) return 'O nome é obrigatório.'
    if (!raca.trim()) return 'A raça é obrigatória.'
    if (idade === '' || idade <= 0) return 'A idade deve ser maior que zero.'
    return null
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()

    const erroValidacao = validarCampos()
    if (erroValidacao) {
      setErro(erroValidacao)
      return
    }

    try {
      await petsFacade.atualizar(Number(id), {
        nome,
        raca,
        idade: Number(idade),
      })

      if (arquivo) {
        await petsFacade.atualizarFoto(Number(id), arquivo)
      }

      navigate(`/pets/${id}`)
    } catch {
      setErro('Erro ao atualizar pet')
    }
  }

  return (
    <div>
      <h1>Atualizar Pet</h1>

      <form onSubmit={salvar}>
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
          onChange={e => setIdade(e.target.value === '' ? '' : Number(e.target.value))}
        />

        <input type="file" accept="image/*" onChange={selecionarArquivo} />

        {preview && ( 
          <> <img src={preview} alt="Preview" width={150} height={150} /> 
          
          {fotoId && ( 
            <button type="button" onClick={removerFoto}> 
              Remover Foto 
            </button> 
          )} 
          </> 
        )}

        {erro && <p>{erro}</p>}

        <button type="submit">Atualizar</button>

        <button type="button" onClick={() => navigate('/')}>
          Voltar para lista
        </button>
      </form>
    </div>
  )
}
