<template>
  <el-card shadow="hover" class="search-card">
    <el-form ref="searchFormRef" :inline="true" :model="from">
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          <el-icon>
            <Search/>
          </el-icon>
          查询
        </el-button>
        <el-button @click="reset">
          <el-icon>
            <Refresh/>
          </el-icon>
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {Search, Refresh} from "@element-plus/icons-vue"


const emits = defineEmits(['submitSearch'])
const props = defineProps({
  form: {
    type: Object,
    required: true,
    default: {}
  },//搜索表单
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
// 搜索表单对象
const searchFormRef = ref(null)
// 搜索表单
let from = reactive({...props.form})
// 搜索项配置
let config = ref([])
watch(
    () => from.value,
    (newValue) => {
      from = newValue
    }, {
      deep: true,
    }
)
// 提交搜索
const onSubmit = () => {
  emits('submitSearch', from);
}
// 表单清空
const reset = () => {
  // console.log('reset!')
  for (const key in from) {
    from[key] = ''
  }
}
onMounted(() => {
  console.log(props.config)
  for (const i in props.config) {
    // console.log(props.config[i].is_search)
    if (props.config[i].is_search) {
      // console.log(props.config[i].is_search)
      config.value.push(props.config[i])
    }
  }
  console.log(config.value)
})
</script>

<style scoped lang="scss">
.search-card {
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>