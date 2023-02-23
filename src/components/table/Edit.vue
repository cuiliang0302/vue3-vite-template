<template>
  <el-dialog
      v-model="editDialogVisible"
      title="编辑"
      width="40%"
      :before-close="closeDialog"
  >
    <el-form ref="editFormRef" :model="from" label-width="70px" :size="'large'">
        <span v-for="(item,index) in config" :key="index">
          <el-form-item v-if="item.type==='input'" :label="item.label">
            <el-input v-model="from[item.model]" :placeholder="item.placeholder"/>
          </el-form-item>
          <el-form-item v-if="item.type==='select'" :label="item.label">
            <el-select v-model="from[item.model]" :placeholder="item.placeholder">
              <el-option v-for="(itemOption,indexOption) in selectOption" :key="indexOption"
                         :label="itemOption.name" :value="itemOption.value"/>
            </el-select>
          </el-form-item>
        </span>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="saveData">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import useStore from "@/store";

const {common} = useStore()

// 编辑弹窗是否显示
const {editDialogVisible} = storeToRefs(common)
const emits = defineEmits(['saveData'])
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {}
  },//编辑表单数据
  config: {
    type: Array,
    required: true,
    default: []
  },// 表单配置
  selectOption: {
    type: Array,
    required: true,
    default: []
  }// 选择框选项
})
// 编辑表单
let from = reactive({...props.data})
// 编辑项配置
const config = ref([])
// 表单校验规则
let rules = reactive({})
watch(
    () => props.data,
    (newValue) => {
      Object.assign(from, newValue)
    }, {
      deep: true,
    }
)
// 关闭弹窗
const closeDialog = () => {
  common.changeEditDialogVisible(false)
}
// 保存编辑事件
const saveData = () => {
  let edit_field = [] // 可编辑的字段列表
  for (const i in config.value) {
    edit_field.push(config.value[i].model)
  }
  // 去除只读字段
  const data = {}
  for (const j in from) {
    if (edit_field.indexOf(j) > -1) {
      data[j] = from[j]
    }
  }
  emits('saveData', data)
  common.changeEditDialogVisible(false)
}
onMounted(() => {
  console.log("props.config", props.config)
  // 生成表单校验规则
  console.log(props.config)
  for (const i in props.config) {
    // console.log(props.config[i].is_search)
    if (props.config[i].is_edit) {
      // console.log(props.config[i].is_search)
      config.value.push(props.config[i])
    }
  }
  console.log(config.value)
})
</script>

<style scoped lang="scss">
.el-select {
  width: 100%;
}
</style>