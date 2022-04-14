const mutations = {
	add(state) {
		state.count++
	},
	// 设置是否可以显示加载异常弹窗
	setToken(state, value) {
		state.token = value
	}
}
export default mutations
