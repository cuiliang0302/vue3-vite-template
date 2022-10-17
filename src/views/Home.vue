<template>
  <HelloWorld :msg="'123'"></HelloWorld>
  <h1>这是首页</h1>
  <el-button type="primary" @click="valueAdd">数值+1</el-button>
  <h3>{{ count }} {{themeName}}</h3>
  <h2>主题换肤</h2>
  <el-radio-group v-model="themeName" size="large" @change="changeColor">
    <el-radio-button label="拂晓蓝(默认)" />
    <el-radio-button label="薄暮红"/>
    <el-radio-button label="火山橘"/>
    <el-radio-button label="日暮黄"/>
    <el-radio-button label="极光绿"/>
    <el-radio-button label="酱紫"/>
  </el-radio-group>
  <h2>深色模式</h2>
</template>

<script setup>
import HelloWorld from '@/components/HelloWorld.vue'
import {onMounted} from "vue";
import { setTheme } from '@/utils/theme'
import useStore from "@/store";
import {storeToRefs} from "pinia";
// demo
const {demo,theme} = useStore()
const {count} = storeToRefs(demo)
const {themeName} = storeToRefs(theme)
const valueAdd = () => {
  demo.add()
  console.log(demo.double)
}
// 主题换肤
const changeColor = (value) => {
  console.log(themeName)
  setTheme(value)
}
onMounted(() => {
  console.log("执行onMounted函数")
});
</script>

<style scoped lang="scss">
</style>
