<template>
  <h2>主题换肤</h2>
  <el-radio-group v-model="color" size="large" @change="changeColor">
    <el-radio-button label="拂晓蓝(默认)"/>
    <el-radio-button label="薄暮红"/>
    <el-radio-button label="火山橘"/>
    <el-radio-button label="日暮黄"/>
    <el-radio-button label="极光绿"/>
    <el-radio-button label="酱紫"/>
  </el-radio-group>
  <h2>深色模式</h2>
</template>

<script setup name="home">
import {onMounted, ref} from "vue";
import theme from '@/utils/theme'
// 主题换肤
// const {themeName} = theme()
let {setTheme} = theme()
const color = ref('themeName')
const changeColor = (value) => {
  console.log(value)
  setTheme(value)
}
onMounted(() => {
  console.log("执行onMounted函数")
});
</script>

<style scoped lang="scss">
</style>
