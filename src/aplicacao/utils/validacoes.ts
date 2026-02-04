export function limparNumeros(valor: unknown): string {
  return String(valor ?? '').replace(/\D/g, '')
}

export function normalizarCpf(valor: unknown): string {
  const digits = limparNumeros(valor).slice(0, 11)

  if (!digits) return ''

  return digits.padStart(11, '0')
}

export function formatarCpf(valor: string): string {
  const digits = limparNumeros(valor).slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 6)
    return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function formatarTelefone(valor: string): string {
  const digits = limparNumeros(valor).slice(0, 11)

  if (!digits) return ''
  if (digits.length < 3) return `(${digits}`

  const ddd = digits.slice(0, 2)
  const resto = digits.slice(2)

  if (resto.length <= 4) return `(${ddd}) ${resto}`
  if (resto.length <= 8)
    return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`

  return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`
}

export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function validarObrigatorio(valor: string): boolean {
  return valor.trim().length > 0
}

export function validarNumeroPositivo(valor: number | ''): boolean {
  return typeof valor === 'number' && valor > 0
}

export function validarTelefone(telefone: string): boolean {
  const digits = limparNumeros(telefone)
  return digits.length >= 10 && digits.length <= 11
}

export function validarCpf(cpf: string): boolean {
  const digits = limparNumeros(cpf)

  if (digits.length !== 11) return false
  if (/^(\d)\1+$/.test(digits)) return false

  const calcularDigito = (base: string, fatorInicial: number) => {
    let total = 0
    for (let i = 0; i < base.length; i++) {
      total += Number(base[i]) * (fatorInicial - i)
    }
    const resto = total % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const digito1 = calcularDigito(digits.slice(0, 9), 10)
  const digito2 = calcularDigito(`${digits.slice(0, 9)}${digito1}`, 11)

  return digits.endsWith(`${digito1}${digito2}`)
}
