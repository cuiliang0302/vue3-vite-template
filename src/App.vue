<template>
  <el-config-provider :locale="locale">
    <router-view v-slot="{ Component }">
      <component :is="Component"/>
    </router-view>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import {onMounted} from "vue";
// import {onloadTheme} from "@/utils/theme";
const locale = zhCn
onMounted(()=>{
  // onloadTheme()
})
</script>

<style>

</style>
