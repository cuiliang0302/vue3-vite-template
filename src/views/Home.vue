<template>
  <HelloWorld></HelloWorld>
  <h1>这是首页</h1>
  <button @click="valueAdd">{{ value }}</button>
  <el-button type="primary">主要按钮</el-button>
</template>

<script setup>
import HelloWorld from '@/components/HelloWorld.vue'
import store from '@/store/index'
import {ElButton} from 'element-plus'
import {computed, onMounted} from "vue";

const value = computed(() => store.state.count)
const valueAdd = () => {
  store.commit('add')
}
onMounted(() => {
  console.log("执行onMounted函数")
});
</script>

<style scoped lang="scss">

h1 {
  color: $color-primary;
}
</style>
