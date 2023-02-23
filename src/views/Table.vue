<template>
  <Search :form="searchForm" :config="fieldConfig" :selectOption="selectOption" @submitSearch="submitSearch"></Search>
  <List :data="tableData" :config="fieldConfig" :tag="tagConfig" :option="optionConfig"
        @submitDelete="submitDelete" @submitEdit="submitEdit"></List>
  <Edit :data="editData" :config="fieldConfig" :selectOption="selectOption" @saveData="saveData"></Edit>
</template>

<script setup name="table">
import Search from "@/components/table/Search.vue"
import List from "@/components/table/List.vue"
import Edit from "@/components/table/Edit.vue"
import {reactive, ref} from "vue";
import useStore from "@/store";
import {storeToRefs} from "pinia";

const {common} = useStore()
// 表单对象
const searchForm = reactive({
  'id': '',
  'status': ''
})
// 搜索项配置
const fieldConfig = [
  {
    'type': 'input',// 表单类型
    'label': 'ID', // 标签
    'model': 'id',// 字段名
    'is_show': true,// 是否在表格显示
    'is_search': true,// 是否可搜索，如果是false，不用填写placeholder
    'placeholder': '请输入工控机ID号', // 提示文字
    'is_edit': false,// 是否可以编辑修改
    'required': true,// 编辑表单时，是否必填
  },
  {
    'type': 'select',
    'label': '状态',
    'model': 'status',
    'is_search': true,
    'is_show': false,
    'placeholder': '请选择设备状态',
    'is_edit': true,
    'required': true,
  },
  {
    'type': 'select',
    'label': '状态',
    'model': 'status_name',
    'is_search': false,
    'is_show': true,
    'placeholder': '请选择设备状态',
    'is_edit': false,
    'required': false,
  },
  {
    'type': 'input',
    'label': '设备编号',
    'model': 'number',
    'is_show': true,
    'is_search': false,
    'placeholder': '',
    'is_edit': true,
    'required': true,
  }]
// 下拉框选择项
const selectOption = [
  {
    'name': '开启',//名称
    'value': 1 // 选项值
  },
  {
    'name': '关闭',
    'value': 0
  }
]
// 提交查询事件
const submitSearch = (value) => {
  console.log("父组件收到查询事件了")
  console.log(value)
}
// 表格数据
const tableData = [
  {
    id: '1',
    status: 0,
    status_name: '关闭',
    number: 'SDF1231234',
  },
  {
    id: '2',
    status: 1,
    status_name: '开启',
    number: 'SDF2311234',
  },
  {
    id: '3',
    status: 0,
    status_name: '关闭',
    number: 'ASF2311234',
  }
]

// 标签显示配置
const tagConfig = {
  'prop': 'status_name',// 字段
  'mapping': {
    "开启": "success",
    "关闭": "danger"
  }//对应关系
}
// 操作配置
const optionConfig = {
  'edit': true,
  'delete': true
}
// 表格删除事件
const submitDelete = (value) => {
  console.log("父组件收到了删除事件")
  console.log(value)
}
// 编辑表单
let editData = reactive({})
// 表格编辑事件
const submitEdit = (value) => {
  console.log("父组件收到了编辑事件")
  Object.assign(editData, tableData[value - 1])
  console.log("editData", editData)
  common.changeEditDialogVisible(true)
}
// 表格保存事件
const saveData = (value) => {
  console.log("父组件收到了保存事件")
  console.log(value)
}
</script>

<style scoped>

</style>