import useUserStore from '@/store/user'
import useDemoStore from '@/store/demo'
import useThemeStore from "@/store/theme";
import useDarkStore from "@/store/dark";
import useAsideStore from "@/store/aside";

// 统一导出useStore方法
export default function useStore() {
  return {
    user: useUserStore(),
    demo: useDemoStore(),
    theme: useThemeStore(),
    dark: useDarkStore(),
    aside: useAsideStore()
  }
}