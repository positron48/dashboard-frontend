import axios from 'axios'
import {isLogin, logout, getToken} from './auth.js'
import {urlEncode} from './helpers.js'

const HTTP = axios.create({
    baseURL: 'http://localhost:46123',
    headers: {
        'Content-type': 'application/x-www-form-urlencoded'
    }
})

HTTP.interceptors.response.use(function (response) {
    if (typeof response.data === 'object' && response.data !== null && 'token' in response.data) {
        localStorage.setItem('token', response.data.token)
        delete response.data.token
    }
    return response
}, function (error) {
    if (error.response !== undefined && 'status' in error.response && error.response.status === 401 && isLogin()) {
        logout()
        location.reload()
    }
    return Promise.reject(error)
})

HTTP.interceptors.request.use(
    config => {
        let token = getToken()
        if(token !== null) {
            config.headers.token = getToken()
        }
        return config
    }
)

export var API = {
    hasToken () {
        return getToken() !== null
    },

    auth (login, password) {
        const path = '/api/auth'
        let data = {login: login, password: password}
        return HTTP.post(path, urlEncode(data))
    },

    getUser () {
        return HTTP.get('/api/user')
    },

    getProjects () {
        return HTTP.get('/api/projects')
    },

    createProject (id, regexp) {
        const path = '/api/project'
        let data = {id: id, regexp: regexp}
        return HTTP.put(path, urlEncode(data))
    },

    // получение данных о задаче с трекера
    getVersion (version) {
        return HTTP.get('/api/version?version=' + version)
    }
}

export default API