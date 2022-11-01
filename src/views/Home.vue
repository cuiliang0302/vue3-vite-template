<template>
  <el-container>
    <el-aside>
      <Aside></Aside>
    </el-aside>
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <el-card shadow="never">
          <router-view></router-view>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup name="home">
import Aside from '@/components/common/Aside.vue'
import Header from '@/components/common/Header.vue'

</script>

<style scoped lang="scss">
.el-main {
  background-color: var(--el-bg-color-page);
}

.el-aside {
  width: auto !important;
}

.el-header {
  display: flex;
  align-items: center;
}
</style>
