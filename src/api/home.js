import index from './index'

// 发送get请求
export function getDemo(params) {
	const url = '/demo/'
	return index.get(url, params)
}

// 发送post请求
export function postDemo(params) {
	const url = '/demo/'
	return index.post(url, params)
}

// 发送put请求
export function putDemo(id, params) {
	const url = '/demo/' + id + '/'
	return index.put(url, params)
}

// 发送patch请求
export function patchDemo(id, params) {
	const url = '/demo/' + id + '/'
	return index.patch(url, params)
}

// 发送delete请求
export function deleteDemo(id) {
	return index.delete('/demo/' + id + '/')
}
