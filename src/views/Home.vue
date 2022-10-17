<template>
  <HelloWorld :msg="'123'"></HelloWorld>
  <h1>这是首页</h1>
  <el-button type="primary" @click="valueAdd">数值+1</el-button>
  <h3>当前值：{{ count }}</h3>
  <h2>主题换肤</h2>
  <el-radio-group :model-value="themeName" size="large" @change="changeColor">
    <el-radio-button label="拂晓蓝(默认)"/>
    <el-radio-button label="薄暮红"/>
    <el-radio-button label="火山橘"/>
    <el-radio-button label="日暮黄"/>
    <el-radio-button label="极光绿"/>
    <el-radio-button label="酱紫"/>
  </el-radio-group>
  <h2>深色模式</h2>
  <el-switch
      v-model="v2"
      size="large"
      inline-prompt
      :active-icon="Moon"
      :inactive-icon="Sunny"
  />
</template>

<script setup>
import HelloWorld from '@/components/HelloWorld.vue'
import {onMounted, ref} from "vue";
import {setTheme} from '@/utils/theme'
import useStore from "@/store";
import {storeToRefs} from "pinia";
import {Sunny, Moon} from '@element-plus/icons-vue'
// demo
const {demo, theme} = useStore()
const {count} = storeToRefs(demo)
const valueAdd = () => {
  demo.add()
  console.log(demo.double)
}
// 主题换肤
const {themeName} = storeToRefs(theme)
const changeColor = (value) => {
  console.log(themeName)
  setTheme(value)
}
// 深色模式
const v2 = ref(true)
onMounted(() => {
  console.log("执行onMounted函数")
});
</script>

<style scoped lang="scss">
</style>
