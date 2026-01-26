const CHAVE_ACCESS_TOKEN = 'access_token'
const CHAVE_REFRESH_TOKEN = 'refresh_token'

export function salvarTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(CHAVE_ACCESS_TOKEN, accessToken)
    localStorage.setItem(CHAVE_REFRESH_TOKEN, refreshToken)
}

export function obterAccessToken(): string | null {
    return localStorage.getItem(CHAVE_ACCESS_TOKEN)
}

export function obterRefreshToken(): string | null {
    return localStorage.getItem(CHAVE_REFRESH_TOKEN)
}

export function limparTokens() {
    localStorage.removeItem(CHAVE_ACCESS_TOKEN)
    localStorage.removeItem(CHAVE_REFRESH_TOKEN)
}