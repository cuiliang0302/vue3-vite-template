<template>
  <HelloWorld :msg="'123'"></HelloWorld>
  <h1>这是首页</h1>
  <el-button type="primary" @click="valueAdd">数值+1</el-button>
  <h3>{{ value }}</h3>
  <h2>主题换肤</h2>
  <el-radio-group v-model="color" size="large">
    <el-radio-button label="拂晓蓝(默认)"/>
    <el-radio-button label="薄暮红"/>
    <el-radio-button label="火山橘"/>
    <el-radio-button label="日暮黄"/>
  </el-radio-group>
  <h2>深色模式</h2>
</template>

<script setup name="home">
import HelloWorld from '@/components/HelloWorld.vue'
import {onMounted, ref} from "vue";
import useStore from '@/store/index'
import {storeToRefs} from "pinia";

const {demo, user} = useStore()
const {count} = storeToRefs(demo)
const value = count
const color = ref('1')
const valueAdd = () => {
  demo.add()
  console.log(demo.double)
}
onMounted(() => {
  console.log("执行onMounted函数")
});
</script>

<style scoped lang="scss">

</style>
