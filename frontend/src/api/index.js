import request from './request'

export function login() {
    return request.post('/login',{
        username:'user1',
        password:'password1',
    })
}

export function reqProjected() {
    return request.get('/protected')
}

export * from './refreshToken'