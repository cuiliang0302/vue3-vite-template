// 切换深色模式
import useStore from "@/store";
import {useDark, useToggle} from '@vueuse/core'

// 切换深色
export function setDark(value) {
  let { dark } = useStore();
  console.log("dark.js", value)
  // const el = ref(null)
  // const primary_color = useCssVar('--el-color-primary', el)
  // primary_color.value = getThemeValue(value)
  const use_dark = useDark()
  const toggleDark = useToggle(use_dark)
  if (value !== use_dark.value) {
    console.log("开始切换深色模式")
    toggleDark()
    dark.changeDark(value)
  }
}

// // 首次加载时换肤
// export function onloadTheme() {
//   let { theme } = useStore();
//   const { themeName } = storeToRefs(theme)
//   console.log("首次加载了啊",themeName.value)
//   setTheme(themeName.value)
// }
