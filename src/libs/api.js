import axios from 'axios'
import {isLogin, logout, getToken} from './auth.js'
import {urlEncode} from './helpers.js'

const HTTP = axios.create({
    baseURL: 'http://localhost:5000',
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
        config.headers.token = getToken()
        return config
    }
)

export var API = {

    auth (login, password, radio) {
        const path = '/api/auth'
        var data = {login: login, password: password, action: radio}
        return HTTP.post(path, urlEncode(data))
    },

    // получение данных о задаче с трекера
    getVersion (version) {
        return HTTP.get('/api/version?version=' + version)
    }
}

export default API