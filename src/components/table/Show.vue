<template>
  <el-dialog
      v-model="showDialogVisible"
      title="查看详情"
      width="40%"
      :before-close="closeDialog"
  >
    <el-descriptions
        :column="2"
        size="large"
        border
    >
      <el-descriptions-item v-for="(item,index) in fieldConfig" :key="index">
        <template #label>
          {{ item.label }}
        </template>
        <span v-if="tagShow(item.model)">
          <el-tag :type="tagFind(item.model, props.data[item.model])['type']">
            {{ tagFind(item.model, props.data[item.model])['label'] }}
          </el-tag>
        </span>
        <span v-else>{{ props.data[item.model] }}</span>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import useStore from "@/store";
import {ElMessage} from "element-plus";

const {common} = useStore()

// 添加弹窗是否显示
const {showDialogVisible} = storeToRefs(common)
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {}
  },//显示表单数据
  fieldConfig: {
    type: Array,
    required: true,
    default: []
  },// 显示项配置
  tag: {
    type: Array,
    required: false,
    default: [{
      prop: '',
      mapping: []
    }]
  },// tag标签显示配置
})
// 详情配置项
const fieldConfig = ref([])
// 关闭弹窗
const closeDialog = () => {
  common.changeShowDialogVisible(false)
}

// 判断是是否显示自定义标签
const tagShow = (value) => {
  // console.log(value)
  for (let i in props.tag) {
    // console.log(props.tag[i])
    if (props.tag[i].prop === value) {
      return true
    }
  }
  return false
}
// 自定义标签正确显示内容
const tagFind = (prop, value) => {
  // console.log(prop, value)
  for (let i in props.tag) {
    if (props.tag[i]['prop'] === prop) {
      // 找到了字段
      // console.log(props.tag[i])
      for (let j in props.tag[i]['mapping']) {
        // console.log(props.tag[i]['mapping'][j])
        if (props.tag[i]['mapping'][j]['value'] === value) {
          // console.log(props.tag[i]['mapping'][j]['value'])
          return {'label': props.tag[i]['mapping'][j]['label'], 'type': props.tag[i]['mapping'][j]['type']}
        }
      }
    }
  }
}

onMounted(() => {
  // 生成配置项
  for (const i in props.fieldConfig) {
    if (props.fieldConfig[i].is_info_show) {
      fieldConfig.value.push(props.fieldConfig[i])
    }
  }
})
</script>

<style scoped lang="scss">

</style>