const TOKEN_KEY = 'TOKEN_KEY'
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN_KEY'


export function setToken(token) {
    localStorage.setItem(TOKEN_KEY,token)
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function setRefreshToken(token) {
    localStorage.setItem(REFRESH_TOKEN_KEY,token)
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
}