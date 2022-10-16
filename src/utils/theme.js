// 主题换肤
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import useStore from "@/store";

function theme() {
  const {theme} = useStore()
  // 当前主题色
  const {themeName} = storeToRefs(theme)
  // 切换主题色
  const setTheme = (value) => {
    console.log("theme.js", value)

  }
  onMounted(() => {
  })
  return {
    themeName, setTheme,
  }
}

export default theme
