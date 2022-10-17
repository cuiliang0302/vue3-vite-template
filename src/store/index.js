import useUserStore from '@/store/user'
import useDemoStore from '@/store/demo'
import useThemeStore from "@/store/theme";

let appStore = {}

// 统一导出useStore方法
export const registerStore = () => {
  appStore['user'] = useUserStore()
  appStore['demo'] = useDemoStore()
  appStore['theme'] = useThemeStore()
  return appStore
}
export default appStore;
