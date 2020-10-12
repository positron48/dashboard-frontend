import axios from 'axios'
import {isLogin, logout, getToken} from './auth.js'
import {urlEncode} from './helpers.js'

console.log(process.env)

const HTTP = axios.create({
    baseURL: process.env.VUE_APP_API_HOST,
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

    createProject (projectData) {
        const path = '/api/project'
        let data = {
            externalId: projectData.externalId,
            regexp: projectData.regexp,
            useDefaultRedmine: projectData.useDefaultRedmine,
            redmineUrl: projectData.redmineUrl,
            redmineUser: projectData.redmineUser,
            redminePassword: projectData.redminePassword
        }
        return HTTP.put(path, urlEncode(data))
    },

    editProject (projectData) {
        const path = '/api/project/' + projectData.id
        let data = {
            regexp: projectData.regexp,
            useDefaultRedmine: projectData.useDefaultRedmine,
            externalId: projectData.externalId,
            redmineUrl: projectData.redmineUrl,
            redmineUser: projectData.redmineUser,
            redminePassword: projectData.redminePassword
        }
        return HTTP.patch(path, urlEncode(data))
    },

    deleteProject (id) {
        const path = '/api/project/' + id
        return HTTP.delete(path)
    },

    getProject (id) {
        return HTTP.get('/api/project/' + id)
    },

    createTest (test, id) {
        const path = '/api/test'
        let data = {projectId: id, name: test.name, script: test.script, comment: test.comment}
        return HTTP.put(path, urlEncode(data))
    },

    editTest (test) {
        const path = '/api/test/' + test.id
        let data = {name: test.name, script: test.script, comment: test.comment}
        return HTTP.patch(path, urlEncode(data))
    },

    deleteTest (id) {
        const path = '/api/test/' + id
        return HTTP.delete(path)
    },

    // получение данных тестовой площадки
    getTestData (id) {
        return HTTP.get('/api/test/' + id)
    },

    // получение git status тестовой площадки
    getTestStatus (id) {
        return HTTP.get('/api/test/' + id + '?type=status')
    }
}

export default API