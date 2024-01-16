<template>
  <el-menu
      :default-active="menuName"
      class="el-menu-vertical"
      background-color="#1e263b"
      text-color="#fff"
      :collapse="isCollapse"
  >
    <div class="logo" @click="changeCollapse">
      <el-icon>
        <elemeFilled/>
      </el-icon>
      <span v-if="!isCollapse">系统名称</span>
    </div>
    <el-menu-item index="index" @click="router.push('/')">
      <el-icon>
        <home-filled/>
      </el-icon>
      <template #title><span>首页</span></template>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <trend-charts/>
        </el-icon>
        <span>示例页</span>
      </template>
      <el-menu-item index="demo" @click="router.push('/demo')">演示页面</el-menu-item>
      <el-menu-item index="tables" @click="router.push('/tables')">演示表格</el-menu-item>
      <el-menu-item index="test" @click="router.push('/test')">测试页</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {HomeFilled, TrendCharts, ElemeFilled} from "@element-plus/icons-vue"
import useStore from "@/store";
import {storeToRefs} from "pinia";

const router = useRouter()
const {common} = useStore()
// 导航栏默认不折叠
const {isCollapse} = storeToRefs(common);
// 导航栏折叠事件
const changeCollapse = () => {
  console.log(!isCollapse.value)
  // setCollapse(!isCollapse.value)
  common.changeCollapse(!isCollapse.value)
};
// 当前激活的菜单名称
const menuName = ref('')
onMounted(() => {
  menuName.value = router.currentRoute.value.name
})
</script>

<style scoped lang="scss">
.logo {
  padding-left: 15px;
  height: 60px;
  color: white;
  background-color: #171d23;
  display: flex;
  align-items: center;
  cursor: pointer;

  i {
    font-size: 35px;
  }

  span {
    margin-left: 10px;
  }
}

.el-menu {
  height: 100vh;
}

.el-icon {
  font-size: 20px;
  margin-right: 5px;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
}
</style>
