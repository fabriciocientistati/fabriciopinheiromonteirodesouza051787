import type { Foto } from '../../dominio/modelos/Foto'
import type { Pet } from '../../dominio/modelos/Pet'
import type { PetVinculado } from '../../dominio/modelos/PetVinculado'
import type { Tutor } from '../../dominio/modelos/Tutor'
import type {
  FotoViewModel,
  PetViewModel,
  PetVinculadoViewModel,
  TutorViewModel,
} from '../modelos'
import { obterEspeciePet } from '../utils/especieStorage'

type OpcoesPet = {
  incluirTutores?: boolean
}

type OpcoesTutor = {
  incluirPets?: boolean
}

export function mapFoto(foto?: Foto): FotoViewModel | undefined {
  if (!foto) return undefined

  return {
    id: foto.id,
    nome: foto.nome,
    contentType: foto.contentType,
    url: foto.url,
  }
}

export function mapPet(
  pet: Pet,
  opcoes: OpcoesPet = {},
): PetViewModel {
  return {
    id: pet.id,
    nome: pet.nome,
    especie: obterEspeciePet(pet.id),
    raca: pet.raca,
    idade: pet.idade,
    foto: mapFoto(pet.foto),
    tutores: opcoes.incluirTutores
      ? pet.tutores?.map(tutor => mapTutor(tutor, { incluirPets: false }))
      : undefined,
  }
}

export function mapPets(
  pets: Pet[],
  opcoes: OpcoesPet = {},
): PetViewModel[] {
  return pets.map(pet => mapPet(pet, opcoes))
}

export function mapTutor(
  tutor: Tutor,
  opcoes: OpcoesTutor = {},
): TutorViewModel {
  return {
    id: tutor.id,
    nome: tutor.nome,
    email: tutor.email ?? undefined,
    telefone: tutor.telefone,
    endereco: tutor.endereco,
    cpf: tutor.cpf ?? undefined,
    foto: mapFoto(tutor.foto),
    pets: opcoes.incluirPets
      ? tutor.pets?.map(mapPetVinculado)
      : undefined,
  }
}

export function mapTutores(
  tutores: Tutor[],
  opcoes: OpcoesTutor = {},
): TutorViewModel[] {
  return tutores.map(tutor => mapTutor(tutor, opcoes))
}

export function mapPetVinculado(pet: PetVinculado): PetVinculadoViewModel {
  return {
    id: pet.id,
    nome: pet.nome,
    especie: obterEspeciePet(pet.id),
    raca: pet.raca ?? '',
    idade: pet.idade ?? 0,
    foto: mapFoto(pet.foto),
  }
}

export function mapPetParaVinculado(pet: Pet): PetVinculadoViewModel {
  return {
    id: pet.id,
    nome: pet.nome,
    especie: obterEspeciePet(pet.id),
    raca: pet.raca ?? '',
    idade: pet.idade ?? 0,
    foto: mapFoto(pet.foto),
  }
}
