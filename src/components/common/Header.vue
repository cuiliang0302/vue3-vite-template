<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in location">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div>
    <el-dropdown split-button type="" @command="handle">
      {{ username }}
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="password">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">注销登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import useStore from "@/store";
import {storeToRefs} from "pinia";
import {ElMessage} from "element-plus";
const {user} = useStore();
const {username} = storeToRefs(user);
const router = useRouter()
const emits = defineEmits(['changePassword'])
// 当前位置
const location = ref([])
// 注销登录
const handle = (value) => {
  console.log(value)
  if (value === 'logout') {
    ElMessage.success({
      message: '注销成功，正在跳转至登录页！',
      type: 'success',
    })
    window.localStorage.clear()
    window.sessionStorage.clear()
    router.replace('/login')
  } else {
    emits('changePassword')
  }
}
onMounted(() => {
  location.value = router.currentRoute.value.meta.location
})
onBeforeRouteUpdate((to) => {
  console.log(to.meta)
  location.value = to.meta.location
})
</script>

<style scoped lang="scss">
div:nth-child(1) {
  flex: 1;
}
</style>
