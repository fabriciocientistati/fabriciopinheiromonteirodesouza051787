import { useEffect, useState } from 'react'
import type { Observable } from 'rxjs'

export function useObservable<T>(observable: Observable<T>, initial: T) {
  const [valor, setValor] = useState(initial)

  useEffect(() => {
    const sub = observable.subscribe(setValor)
    return () => sub.unsubscribe()
  }, [observable])

  return valor
}
