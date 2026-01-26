export function usuarioEstaAutenticado(): boolean {
    const token = localStorage.getItem('access_token');
    return Boolean(token);
}