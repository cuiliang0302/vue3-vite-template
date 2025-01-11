import index from './index'

// 用户登录
export function postLogin(params) {
    const url = '/account/login/'
    return index.post(url, params)
}

// 发送get请求
export function getDemo(params) {
    const url = '/public/demoUser/'
    return index.get(url, params)
}

// 查看数据详情
export function getDemoInfo(id) {
    const url = '/public/demoUser/' + id + '/'
    return index.get(url)
}

// 发送post请求
export function postDemo(params) {
    const url = '/public/demoUser/'
    return index.post(url, params)
}

// 发送put请求
export function putDemo(id, params) {
    const url = '/public/demoUser/' + id + '/'
    return index.put(url, params)
}

export function putChangePassword(id, params) {
    const url = '/account/changePassword/' + id + '/'
    return index.put(url, params)
}

// 发送patch请求
export function patchDemo(id, params) {
    const url = '/public/demoUser/' + id + '/'
    return index.patch(url, params)
}

// 发送delete请求
export function deleteDemo(id) {
    return index.delete('/public/demoUser/' + id + '/')
}

// 发送get请求
export function getSelect(params) {
    const url = '/public/demoProvince/'
    return index.get(url, params)
}

// 获取SSE数据
export function getSSE()  {
    return import.meta.env.VITE_APP_BASE_URL + '/sse/demo/'
}