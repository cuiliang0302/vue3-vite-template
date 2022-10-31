import {defineStore} from 'pinia'
// 侧边菜单
const useAsideStore = defineStore('aside', {
  state: () => ({
    // 侧边栏默认不折叠
    isCollapse: false,
  }),
  // 计算属性
  getters: {
    // 计算侧边栏宽度
    width() {
      if (this.isCollapse) {
        return '60px'

      } else {
        return '250px'
      }
    },
  },
  // 修改数据
  actions: {
    // 切换侧边栏折叠模式
    changeCollapse(value) {
      this.isCollapse = value
    }
  },
  // 持久化存储插件其他配置
  persist: {
    // 修改存储中使用的键名称，默认为当前 Store的 id
    key: 'useAsideStore',
    // 修改为 sessionStorage，默认为 localStorage
    storage: window.sessionStorage,
    // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
    // paths: ['isCollapse'],
  }
})

export default useAsideStore