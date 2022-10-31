<template>
  <el-menu
      :default-active="'1'"
      class="el-menu-vertical"
      @open="handleOpen"
      @close="handleClose"
      background-color="#1e263b"
      text-color="#fff"
      active-text-color="#3498db"
      :collapse="isCollapse"
  >
    <div class="logo" @click="changeCollapse">
      <el-icon>
        <elemeFilled/>
      </el-icon>
      <span v-if="!isCollapse">系统名称</span>
    </div>
    <el-menu-item index="1" @click="router.push('/')">
      <el-icon>
        <home-filled/>
      </el-icon>
      <template #title><span>菜单1</span></template>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <trend-charts/>
        </el-icon>
        <span>菜单2</span>
      </template>
      <el-menu-item index="2-1" @click="router.push('/')">菜单2-1</el-menu-item>
      <el-menu-item index="2-2" @click="router.push('/')">菜单2-2</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <opportunity/>
        </el-icon>
        <span>菜单3</span>
      </template>
      <el-menu-item index="3-1" @click="router.push('/')">菜单3-1</el-menu-item>
      <el-menu-item index="3-2" @click="router.push('/')">菜单3-2</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="4" @click="router.push('/alert')">
      <el-icon>
        <bell-filled/>
      </el-icon>
      <template #title><span>菜单4</span></template>
    </el-menu-item>
    <el-sub-menu index="5">
      <template #title>
        <el-icon>
          <tools/>
        </el-icon>
        <span>菜单5</span>
      </template>
      <el-menu-item index="5-1" @click="router.push('/')">菜单5-1</el-menu-item>
      <el-menu-item index="5-2" @click="router.push('/')">菜单5-2</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {HomeFilled, BellFilled, TrendCharts, Opportunity, Tools, ElemeFilled} from "@element-plus/icons-vue"
import useStore from "@/store";
import {storeToRefs} from "pinia";

const router = useRouter()
const {aside} = useStore()
// 导航栏默认不折叠
const {isCollapse} = storeToRefs(aside);
// 导航栏折叠事件
const changeCollapse = () => {
  console.log(!isCollapse.value)
  // setCollapse(!isCollapse.value)
  aside.changeCollapse(!isCollapse.value)
};
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>

<style scoped lang="scss">
.logo {
  margin-left: 15px;
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
  width: 250px;
  min-height: 400px;
}
</style>
