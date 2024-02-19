<template>
  <Search :fieldConfig="fieldConfig" @submitSearch="submitSearch" :selectOption="selectOption">
    <template #search-item>
      <el-form-item label="身高范围">
        <el-input-number v-model="heightForm.height_min" :min="150"/>
        <span class="range-icon"><el-icon><SemiSelect/></el-icon></span>
        <el-input-number v-model="heightForm.height_max" :max="200"/>
      </el-form-item>
    </template>
  </Search>
  <List :data="tableData" :fieldConfig="fieldConfig" :tableConfig="tableConfig" :templateFileUrl="templateFileUrl"
        @pageSize="pageSize" @pageNumber="pageNumber" :tagConfig="tagConfig" @submitEdit="submitEdit"
        @submitShow="submitShow" @submitAdd="submitAdd" @submitDelete="submitDelete" @submitExport="submitExport"
        @submitImport="submitImport" @multipleClick="multipleClick" @submitMultiple="submitMultiple">
  </List>
  <Show :data="operateForm" :fieldConfig="fieldConfig" :tagConfig="tagConfig"></Show>
  <Edit :data="operateForm" :fieldConfig="fieldConfig" @editData="editData" :selectOption="selectOption"></Edit>
  <Add :fieldConfig="fieldConfig" @addData="addData" :selectOption="selectOption"></Add>
  <el-dialog
      v-model="multipleDialogVisible"
      title="批量操作数据"
      width="40%"
  >
    <el-form label-width="120px">
      <el-form-item label="操作数据ID">
        {{ multipleList }}
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="multipleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="multipleDialogVisible = false">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup name="tables">
import Search from "@/components/table/Search.vue"
import List from "@/components/table/List.vue"
import Edit from "@/components/table/Edit.vue"
import Show from "@/components/table/Show.vue"
import Add from "@/components/table/Add.vue"
import {onMounted, reactive, ref} from "vue";
import useStore from "@/store";
import {deleteDemo, getDemo, getDemoInfo, getSelect, postDemo, putDemo} from "@/api/home";
import {ElMessage} from "element-plus";
import {timeFormatConversion} from "@/utils/timeFormat";
import {SemiSelect} from "@element-plus/icons-vue";
import {exportFile} from "@/utils/excel";

const {common} = useStore()
// 表格字段配置
const fieldConfig = ref([
  {
    'label': 'ID', // 标签
    'model': 'id',// 字段名
    'is_table_show': true,// 是否在表格显示
    'width': 65,
    'is_export': true,// 是否导出该字段
  },
  {
    'type': 'auto-input',// 表单类型
    'label': '用户名', // 标签
    'model': 'username',// 字段名
    'is_table_show': true,// 是否在表格显示
    'is_info_show': true,// 是否在详情显示
    'is_search': true,// 是否可搜索，如果是false，不用填写placeholder
    'is_edit': true,// 是否可以编辑修改
    'placeholder': '请输入用户名', // 提示文字
    'is_required': true,// 编辑表单时，是否必填
    'is_export': true, // 是否导出该字段
  },
  {
    'type': 'select',// 表单类型
    'label': '省份', // 标签
    'model': 'province',// 字段名
    'is_table_show': true,// 是否在表格显示
    'is_info_show': true,// 是否在详情显示
    'is_export': true // 是否导出该字段
  },
  {
    'type': 'select',// 表单类型
    'label': '省份ID', // 标签
    'model': 'province_id',// 字段名
    'is_search': true,// 是否可搜索，如果是false，不用填写placeholder
    'is_edit': true,// 是否可以编辑修改
    'placeholder': '请选择省份', // 提示文字
    'is_required': true,// 编辑表单时，是否必填
  },
  {
    'type': 'select',// 表单类型
    'label': '性别', // 标签
    'model': 'sex',// 字段名
    'is_search': true,// 是否可搜索，如果是false，不用填写placeholder
    'is_table_show': true,// 是否在表格显示
    'is_edit': true,// 是否可以编辑修改
    'is_info_show': true,// 是否在详情显示
    'placeholder': '请选择性别', // 提示文字
  },
  {
    'label': '性别', // 标签
    'model': 'sex_name',// 字段名
    'is_export': true // 是否导出该字段
  },
  {
    'type': 'date',// 表单类型
    'label': '生日', // 标签
    'model': 'birthday',// 字段名
    'is_table_show': true,// 是否在表格显示
    'is_info_show': true,// 是否在详情显示
    'is_edit': true,// 是否可以编辑修改
    'placeholder': '请选择生日', // 提示文字
    'width': 135,
    'is_export': true, // 是否导出该字段
  },
  {
    'type': 'number',// 表单类型
    'label': '身高(cm)', // 标签
    'model': 'height',// 字段名
    'precision': 0,//精度
    'is_table_show': true,// 是否在表格显示
    'is_info_show': true,// 是否在详情显示
    'is_edit': true,// 是否可以编辑修改
    'placeholder': '请输入身高', // 提示文字
    'is_export': true, // 是否导出该字段
  },
  {
    'type': 'number',// 表单类型
    'label': '体重(kg)', // 标签
    'model': 'weight',// 字段名
    'precision': 2,//精度
    'is_table_show': true,// 是否在表格显示
    'is_info_show': true,// 是否在详情显示
    'is_edit': true,// 是否可以编辑修改
    'placeholder': '请输入体重', // 提示文字
    'is_export': true,// 是否导出该字段
  },
  {
    'type': 'datetime',// 表单类型
    'label': '注册时间', // 标签
    'model': 'created_time',// 字段名
    'is_search': true,
    'is_table_show': true,// 是否在表格显示
    'is_info_show': true,// 是否在详情显示
    'is_edit': true,// 是否可以编辑修改
    'placeholder': '请选择注册时间', // 提示文字
    'is_export': true, // 是否导出该字段
    'width': 170
  },
  {
    'type': 'text',// 表单类型
    'label': '个人介绍', // 标签
    'model': 'introduction',// 字段名
    'is_info_show': true,// 是否在详情显示
    'is_edit': true,// 是否可以编辑修改
    'placeholder': '请输入个人介绍', // 提示文字
    'is_export': true,// 是否导出该字段
  }
])
// 标签显示配置
const tagConfig = reactive({
  'sex': [
    {
      'value': "1", // 字段值
      'label': '男', // 显示名
      'type': 'danger' // 样式
    },
    {
      'value': "2", // 字段值
      'label': '女', // 显示名
      'type': 'warning' // 样式
    }
  ]
})
// 下拉框选择项,结构为{'字段名':[{'label':'X','value':'Y'}]}
const selectOption = reactive({
  'province_id': [],
  'sex': [{'label': '男', 'value': '1'}, {'label': '女', 'value': '2'}]
})
// 操作配置
const tableConfig = {
  'edit': true, // 是否编辑
  'delete': true, // 是否删除
  'add': true, // 是否添加
  'show': true, // 是否查看详情
  'export': true,//是否批量导出
  'import': true,//是否批量导入
  'multiple': true,//是否多选
  'page': {enable: true, size: 10, number: 1, count: 0},//是否开启分页
  'sort': {prop: 'id', order: 'ascending'}, // 是否默认排序
  'width': 195
}

// 表格数据
const tableData = ref([])
const heightForm = reactive({
  'height_min': 150,
  'height_max': 200
})
// 提交查询事件
const submitSearch = (value) => {
  console.log("提交查询了", value)
  tableConfig.page.number = 1
  params.page = 1
  params['height_min'] = heightForm.height_min
  params['height_max'] = heightForm.height_max
  for (let i in value) {
    params[i] = value[i]
  }
  getTableData()
}

// 操作表单
let operateForm = reactive({})
// 操作的数据ID
const operateId = ref('')
// 表格查看事件
const submitShow = (value) => {
  console.log(value)
  operateId.value = value
  getDemoInfo(operateId.value).then((response) => {
    console.log(response)
    response['birthday'] = timeFormatConversion(response['birthday'], 'YYYY年MM月DD日')
    response['created_time'] = timeFormatConversion(response['created_time'], 'YYYY-MM-DD HH:mm:ss')
    Object.assign(operateForm, response)
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('获取详细数据失败！')
  });
  common.changeShowDialogVisible(true)
}
// 表格编辑事件
const submitEdit = (value) => {
  console.log(value)
  operateId.value = value
  getDemoInfo(operateId.value).then((response) => {
    console.log(response)
    Object.assign(operateForm, response)
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('获取详细数据失败！')
  });
  common.changeEditDialogVisible(true)
}
// 表格保存事件
const editData = (value) => {
  console.log(value)
  putDemo(operateId.value, value).then((response) => {
    console.log(response)
    getTableData()
    ElMessage({
      message: '修改信息成功！',
      type: 'success',
    })
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('修改信息失败！')
  });
}
// 表格新增事件
const submitAdd = () => {
  console.log("父组件收到了新增事件")
  common.changeAddDialogVisible(true)
}
// 表格新增保存事件
const addData = (value) => {
  console.log(value)
  postDemo(value).then((response) => {
    console.log(response)
    getTableData()
    ElMessage({
      message: '新增数据成功！',
      type: 'success',
    })
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('添加数据失败！')
  });
}
// 删除数据
const submitDelete = (value) => {
  deleteDemo(value).then((response) => {
    console.log(response)
    getTableData()
    ElMessage({
      message: '删除数据成功！',
      type: 'success',
    })
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('删除数据失败！')
  });
}
// 批量导出事件
const submitExport = () => {
  ElMessage({
    message: '开始导出数据，请稍候！',
    type: 'success',
  })
  // 导出数据查询参数
  const printParams = {
    'size': 1000,
    'page': 1,
  }
  // 获取需要导出的字段配置
  const export_fields = fieldConfig.value
      .filter(obj => obj['is_export'])
      .map(({label, model}) => ({[model]: label}))
  // 处理数据结构
  getDemo(printParams).then((response) => {
    // console.log(response.results)
    const export_data = response.results.map(obj => {
      const newObj = {};
      export_fields.forEach(field => {
        const [key, value] = Object.entries(field)[0];
        if (key === 'created_time') {
          newObj[value] = timeFormatConversion((obj[key]), 'YYYY-MM-DD HH:mm:ss');
        } else {
          newObj[value] = obj[key];
        }
      });
      return newObj;
    });
    let filename = '示例用户'
    exportFile(export_data, filename);
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('获取列表数据失败！')
  });
}
// 批量导入模板文件下载地址
// const templateFileUrl = import.meta.env.VITE_APP_TEMPLATE_URL + 'selfEmployed.xlsx'
const templateFileUrl = 'https://api.cuiliangblog.cn/static/demo-template.xlsx'
// 数据批量导入
const submitImport = (value) => {
  console.log(value)
  const result = value.map(obj => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
      const matchingKey = fieldConfig.value.find(item => item.label === key);
      if (matchingKey) {
        newObj[matchingKey.model] = obj[key];
      } else {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  });
  console.log(result)
  result.forEach((item, index) => {
    console.log(item, index)
    setTimeout(() => {
      postDemo(item).then((response) => {
        console.log(response)
        ElMessage({
          message: `成功插入第${parseInt(index) + 1}条数据！`,
          type: 'success',
        })
      }).catch(response => {
        //发生错误时执行的代码
        console.log(response)
        ElMessage.error('添加数据失败！请检查填写项数值是否正确')
      });
    }, 1000)
    setTimeout(() => {
      getTableData()
    }, 1000)
  })
}
// 批量多选弹窗显示
const multipleDialogVisible = ref(false)
// 批量多选点击事件
const multipleClick = () => {
  multipleDialogVisible.value = true
}
// 批量多选操作的元素列表
const multipleList = ref([])
// 批量多选更新事件
const submitMultiple = (value) => {
  console.log(value)
  multipleList.value = value
}
// 查询参数
const params = reactive({
  'page': tableConfig.page.number,
  'size': tableConfig.page.size
})
// 改变分页大小
const pageSize = (value) => {
  tableConfig.page.size = value
  params.size = value
  tableConfig.page.number = 1
  params.page = 1
  getTableData()
}
// 改变页码数
const pageNumber = (value) => {
  tableConfig.page.number = value
  params.page = value
  getTableData()
}

// 获取列表数据
function getTableData() {
  getDemo(params).then((response) => {
    console.log(response)
    tableConfig.page.count = response.count
    tableData.value = response.results.map(({birthday, created_time, ...item}) => ({
      ...item,
      birthday: timeFormatConversion(birthday, 'YYYY年MM月DD日'),
      created_time: timeFormatConversion(created_time, 'YYYY-MM-DD HH:mm:ss')
    }))
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('获取列表数据失败！')
  });
}

// 获取下拉选择框数据
function getSelectData() {
  getSelect({'size': 100, 'page': 1}).then((response) => {
    console.log(response)
    for (let i in response.results) {
      selectOption.province_id.push({'label': response.results[i].name, 'value': response.results[i].id})
    }
    console.log(selectOption)
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('获取列表数据失败！')
  });
}

onMounted(() => {
  getTableData()
  getSelectData()
})
</script>

<style scoped lang="scss">
.view-btn {
  margin-right: 3px;
}

.token {
  text-align: center;
}

.range-icon {
  margin: 0 10px
}
</style>