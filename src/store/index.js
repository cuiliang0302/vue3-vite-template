import useUserStore from './user'
import useDemoStore from './demo'

// 统一导出useStore方法
export default function useStore() {
  return {
    user: useUserStore(),
    demo: useDemoStore(),
  }
}