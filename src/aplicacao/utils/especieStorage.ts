const CHAVE_STORAGE = 'pets.especies'

type MapaEspecies = Record<string, string>

function lerMapa(): MapaEspecies {
  if (typeof window === 'undefined') return {}
  try {
    const bruto = window.localStorage.getItem(CHAVE_STORAGE)
    if (!bruto) return {}
    const parsed = JSON.parse(bruto) as MapaEspecies
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function salvarMapa(mapa: MapaEspecies) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(mapa))
}

export function obterEspeciePet(id: number): string | undefined {
  const mapa = lerMapa()
  return mapa[String(id)] || undefined
}

export function definirEspeciePet(id: number, especie: string) {
  const mapa = lerMapa()
  mapa[String(id)] = especie
  salvarMapa(mapa)
}

export function removerEspeciePet(id: number) {
  const mapa = lerMapa()
  delete mapa[String(id)]
  salvarMapa(mapa)
}
