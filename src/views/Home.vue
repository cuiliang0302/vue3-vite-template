<template>
  <HelloWorld :msg="'123'"></HelloWorld>
  <h1>这是首页</h1>
  <h3>{{ value }}</h3>
  <el-button type="primary" @click="valueAdd">主要按钮</el-button>
</template>

<script setup>
import HelloWorld from '@/components/HelloWorld.vue'
import store from '@/store/index'
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

</style>
