import { useEffect, useState } from 'react'
import { petsEstado, type PetsViewEstado } from '../../estado/petsEstado'


export function usePetsEstado(): PetsViewEstado {
  const [estado, setEstado] = useState<PetsViewEstado>(
    petsEstado.obterSnapshot()
  )

  useEffect(() => {
    const subscription = petsEstado.estado$.subscribe(setEstado)
    return () => subscription.unsubscribe()
  }, [])

  return estado
}
