import { useEffect, useState } from 'react'
import { tutoresEstado, type TutoresViewEstado } from '../../estado/tutoresEstado'


export function useTutoresEstado(): TutoresViewEstado {
  const [estado, setEstado] = useState<TutoresViewEstado>(
    tutoresEstado.obterSnapshot()
  )

  useEffect(() => {
    const subscription = tutoresEstado.estado$.subscribe(setEstado)
    return () => subscription.unsubscribe()
  }, [])

  return estado
}
