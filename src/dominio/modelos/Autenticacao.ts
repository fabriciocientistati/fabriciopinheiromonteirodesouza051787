export interface CredenciaisLogin {
    username: string
    password: string
}

export interface TokenAutenticacao {
    access_token: string
    refresh_token: string
    expires_in: number
    refresh_expires_in: number
}