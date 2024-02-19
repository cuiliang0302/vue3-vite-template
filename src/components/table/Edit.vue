<template>
  <el-dialog
      v-model="editDialogVisible"
      title="编辑"
      width="30%"
      :before-close="closeDialog"
  >
    <el-form ref="editFormRef" :model="form" :rules="rules" label-width="100px" :size="'large'">
        <span v-for="(item,index) in fieldConfig" :key="index">
          <el-form-item v-if="item.type==='text'" :label="item.label" :prop="item.model">
            <el-input v-model="form[item.model]" :placeholder="item.placeholder"/>
          </el-form-item>
          <el-form-item v-if="item.type==='number'" :label="item.label" :prop="item.model">
            <el-input-number v-model="form[item.model]" controls-position="right" :precision="item.precision"
                             :placeholder="item.placeholder"/>
          </el-form-item>
          <el-form-item v-if="item.type==='datetime'" :label="item.label" :prop="item.model">
            <el-date-picker
                v-model="form[item.model]"
                type="datetime"
                :placeholder="item.placeholder"
            />
          </el-form-item>
          <el-form-item v-if="item.type==='time'" :label="item.label" :prop="item.model">
           <el-time-picker v-model="form[item.model]" :placeholder="item.placeholder"/>
          </el-form-item>
          <el-form-item v-if="item.type==='date'" :label="item.label" :prop="item.model">
            <el-date-picker v-model="form[item.model]" type="date" :placeholder="item.placeholder"
                            value-format="YYYY-MM-DD"/>
          </el-form-item>
          <el-form-item v-if="item.type==='select'" :label="item.label" :prop="item.model">
            <el-select v-model="form[item.model]" :placeholder="item.placeholder">
              <el-option v-for="(itemOption,indexOption) in selectOption[item.model]" :key="indexOption"
                         :label="itemOption.label" :value="itemOption.value"/>
            </el-select>
          </el-form-item>
           <el-form-item v-if="item.type==='auto-input'" :label="item.label" :prop="item.model">
            <AutoInput :field="item.model" v-model="form[item.model]"></AutoInput>
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
    type: Object,
    required: false,
    default: {}
  }// 选择框选项
})
// 编辑表单对象
const editFormRef = ref(null)
// 编辑表单
let form = reactive({...props.data})
// 编辑项配置
const fieldConfig = ref([])
// 表单校验规则
let rules = reactive({})
watch(
    () => props.data,
    (newValue) => {
      Object.assign(form, newValue)
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
      emits('editData', form)
      common.changeEditDialogVisible(false)
    } else {
      ElMessage.error('请检查表单填写项，然后再提交')
    }
  })
}

onMounted(() => {
  // 生成表单配置项
  fieldConfig.value = props.fieldConfig.filter(item => {
    return item.is_edit
  })
  // console.log("editFieldConfig.value", fieldConfig.value)
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