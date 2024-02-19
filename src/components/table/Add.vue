<template>
  <el-dialog
      v-model="addDialogVisible"
      title="添加"
      width="40%"
      :before-close="closeDialog"
  >
    <el-form ref="addFormRef" :model="form" :rules="rules" label-width="100px" :size="'large'">
        <span v-for="(item,index) in fieldConfig" :key="index">
          <el-form-item v-if="item.type==='text'" :label="item.label" :prop="item.model">
            <el-input v-model="form[item.model]" :placeholder="item.placeholder"/>
          </el-form-item>
          <el-form-item v-if="item.type==='number'" :label="item.label" :prop="item.model">
            <el-input-number v-model="form[item.model]" controls-position="right" :precision="item.precision"
                             :placeholder="item.placeholder"/>
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
          <el-form-item v-if="item.type==='datetime'" :label="item.label" :prop="item.model" class="input-datetime">
            <el-date-picker
                v-model="form[item.model]"
                type="datetime"
                :placeholder="item.placeholder"
            />
          </el-form-item>
          <el-form-item v-if="item.type==='date'" :label="item.label" :prop="item.model">
            <el-date-picker v-model="form[item.model]" type="date" :placeholder="item.placeholder"
                            value-format="YYYY-MM-DD"/>
          </el-form-item>
        </span>
      <slot name="item"></slot>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog(addFormRef)">取消</el-button>
        <el-button type="primary" @click="addData(addFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {storeToRefs} from "pinia";
import useStore from "@/store";
import {ElMessage} from "element-plus";
import AutoInput from "@/components/common/AutoInput.vue";

const {common} = useStore()

// 添加弹窗是否显示
const {addDialogVisible} = storeToRefs(common)
const emits = defineEmits(['addData'])
const props = defineProps({
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
// 添加表单对象
const addFormRef = ref(null)
// 添加表单
let form = reactive({})
// 添加项配置
const fieldConfig = ref([])
// 表单校验规则
const rules = reactive({})
// 关闭弹窗
const closeDialog = () => {
  common.changeAddDialogVisible(false)
}
// 保存添加事件
const addData = async (addFormRef) => {
  await addFormRef.validate((valid) => {
    if (valid) {
      let add_field = [] // 可添加的字段列表
      for (const i in fieldConfig.value) {
        add_field.push(fieldConfig.value[i].model)
      }
      // 去除只读字段
      const data = {}
      for (const j in form) {
        if (add_field.indexOf(j) > -1) {
          data[j] = form[j]
        }
      }
      emits('addData', data)
      common.changeAddDialogVisible(false)
    } else {
      ElMessage.error('请检查表单填写项，然后再提交')
    }
  })
  for (const key in form) {
    form[key] = ''
  }
}
onMounted(() => {
  // 生成表单配置项
  // for (const i in props.fieldConfig) {
  //   if (props.fieldConfig[i].is_edit) {
  //     fieldConfig.value.push(props.fieldConfig[i])
  //   }
  // }
  fieldConfig.value = props.fieldConfig.filter(item => {
    return item.is_edit
  })
  // 生成验证表单规则
  for (const j in fieldConfig.value) {
    if (fieldConfig.value[j].is_required) {
      rules[fieldConfig.value[j].model] = [{
        required: true,
        message: fieldConfig.value[j].placeholder,
        trigger: 'change'
      }]
    }
    // console.log(rules)
  }

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