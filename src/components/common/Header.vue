<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in location">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div>
    <el-dropdown>
        <span class="el-dropdown-link">
          admin
          <el-icon class="el-icon--right">
            <arrow-down/>
          </el-icon>
        </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>修改密码</el-dropdown-item>
          <el-dropdown-item>注销登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {ArrowDown} from '@element-plus/icons-vue'

const router = useRouter()
// 当前位置
const location = ref([])
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

div:nth-child(2) {
  width: 100px;
}
</style>
