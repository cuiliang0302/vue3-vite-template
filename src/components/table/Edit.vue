<template>
  <el-dialog
      v-model="editDialogVisible"
      title="编辑"
      width="30%"
      :before-close="closeDialog"
  >
    <el-form ref="editFormRef" :model="from" :rules="rules" label-width="100px" :size="'large'">
        <span v-for="(item,index) in fieldConfig" :key="index">
          <el-form-item v-if="item.type==='input'" :label="item.label" :prop="item.model">
            <el-input v-model="from[item.model]" :placeholder="item.placeholder"/>
          </el-form-item>
          <el-form-item v-if="item.type==='datetime'" :label="item.label" :prop="item.model">
            <el-date-picker
                v-model="from[item.model]"
                type="datetime"
                :placeholder="item.placeholder"
            />
          </el-form-item>
          <el-form-item v-if="item.type==='time'" :label="item.label" :prop="item.model">
           <el-time-picker v-model="from[item.model]" :placeholder="item.placeholder"/>
          </el-form-item>
          <el-form-item v-if="item.type==='select'" :label="item.label" :prop="item.model">
            <el-select v-model="from[item.model]" :placeholder="item.placeholder">
              <el-option v-for="(itemOption,indexOption) in selectOption" :key="indexOption"
                         :label="itemOption.label" :value="itemOption.value"/>
            </el-select>
          </el-form-item>
           <el-form-item v-if="item.type==='auto-input'" :label="item.label" :prop="item.model">
            <AutoInput :field="item.model" v-model="from[item.model]"></AutoInput>
          </el-form-item>
        </span>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="editData(editFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import useStore from "@/store";
import {ElMessage} from "element-plus";
import AutoInput from "@/components/common/AutoInput.vue";
const {common} = useStore()

// 编辑弹窗是否显示
const {editDialogVisible} = storeToRefs(common)
const emits = defineEmits(['editData'])
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {}
  },//编辑表单数据
  fieldConfig: {
    type: Array,
    required: true,
    default: []
  },// 表单配置
  selectOption: {
    type: Array,
    required: false,
    default: []
  }// 选择框选项
})
// 编辑表单对象
const editFormRef = ref(null)
// 编辑表单
let from = reactive({...props.data})
// 编辑项配置
const fieldConfig = ref([])
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
const editData = async (editFormRef) => {
  await editFormRef.validate((valid) => {
    if (valid) {
      emits('editData', from)
      common.changeEditDialogVisible(false)
    } else {
      ElMessage.error('请检查表单填写项，然后再提交')
    }
  })
}

onMounted(() => {
  // console.log("props.fieldConfig", props.fieldConfig)
  // 生成表单配置项
  setTimeout(() => {
    fieldConfig.value=[]
    for (const i in props.fieldConfig) {
      // console.log(props.fieldConfig[i].is_search)
      if (props.fieldConfig[i].is_edit) {
        // console.log(props.fieldConfig[i].is_search)
        fieldConfig.value.push(props.fieldConfig[i])
      }
    }
  }, 0)
  // 生成验证表单规则
  for (const j in fieldConfig.value) {
    if (fieldConfig.value[j].is_required) {
      // console.log("fieldConfig.value[j]", fieldConfig.value[j])
      rules[fieldConfig.value[j].model] = [{
        required: true,
        message: fieldConfig.value[j].placeholder,
        trigger: 'change'
      }]
    }
  }
  // 时间字段特殊
})
</script>

<style scoped lang="scss">
.el-select {
  width: 100%;
}

:deep(.el-date-editor) {
  width: 100% !important;
}

:deep(.el-input__wrapper) {
  width: 90% !important;
}

:deep(.el-autocomplete) {
  width: 100% !important;
}
</style>