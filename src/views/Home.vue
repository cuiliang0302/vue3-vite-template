<template>
  <HelloWorld :msg="'123'"></HelloWorld>
  <h1>这是首页</h1>
  <el-button type="primary" @click="valueAdd">数值+1</el-button>
  <h3>{{ count }}</h3>
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
import HelloWorld from '@/components/HelloWorld.vue'
import {onMounted, ref} from "vue";
import {themeName, setTheme} from '@/utils/theme'
import useStore from "@/store";
import {storeToRefs} from "pinia";
// demo
const {demo} = useStore()
const {count} = storeToRefs(demo)
const valueAdd = () => {
  demo.add()
  console.log(demo.double)
}
// 主题换肤
const color = ref(themeName)
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
