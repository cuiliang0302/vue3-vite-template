// 主题换肤
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import useThemeStore from "@/store/theme";
import {useCssVar} from "@vueuse/core";
import {getThemeValue} from "@/utils/color";

const theme = useThemeStore()
// 获取当前主题色
export const {themeName} = storeToRefs(theme)

// 切换主题色
export function setTheme(value) {
  console.log("theme.js", value)
  const el = ref(null)
  const primary_color = useCssVar('--el-color-primary', el)
  primary_color.value = getThemeValue(value)
}

// 首次加载时换肤
export function onloadTheme() {
  console.log("首次加载了啊")
  setTheme(getThemeValue(themeName))
}