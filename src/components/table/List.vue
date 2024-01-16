<template>
  <el-card shadow="hover">
    <div class="tableConfig-btn">
      <el-button v-if="props.tableConfig.add===true" type="primary" @click="addClick">
        <el-icon>
          <Plus/>
        </el-icon>
        <slot name="text">新增数据</slot>
      </el-button>
      <el-button v-if="props.tableConfig.export===true" type="success" @click="exportClick">
        <el-icon>
          <Download/>
        </el-icon>
        <slot name="text">批量导出</slot>
      </el-button>
      <el-button v-if="props.tableConfig.import===true" type="warning" @click="importClick">
        <el-icon>
          <Upload/>
        </el-icon>
        <slot name="text">批量导入</slot>
      </el-button>
      <el-button v-if="props.tableConfig.multiple===true" type="danger" @click="multipleClick">
        <el-icon>
          <EditPen/>
        </el-icon>
        <slot name="text">批量操作</slot>
      </el-button>
      <slot name="table-btn"></slot>
    </div>
    <el-table ref="tableRef" :data="props.data" border style="width: 100%" :default-sort="props.tableConfig.sort"
              max-height="700" @selection-change="handleSelectionChange">
      <el-table-column v-if="props.tableConfig.multiple" type="selection" width="55"/>
      <el-table-column v-for="(item,index) in fieldConfig" :key="index"
                       :prop="item.model" :label="item.label" :width="item.width?item.width:''"
                       :sortable="item.sortable?item.sortable:true"
                       align="center">
        <template #default="scope" v-if="props.tagConfig.hasOwnProperty(item.model)">
          <el-tag :type="tagConfigFind(item.model, scope.row[item.model])['type']">
            {{ tagConfigFind(item.model, scope.row[item.model])['label'] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" :width="props.tableConfig.width">
        <template #default="scope">
          <el-button v-if="props.tableConfig.show===true" size="small" type="success"
                     @click="showClick(scope.row.id)">
            查看
          </el-button>
          <el-button v-if="props.tableConfig.edit===true" size="small" type="primary"
                     @click="editClick(scope.row.id)">
            编辑
          </el-button>
          <el-popconfirm v-if="props.tableConfig.delete===true" title="确定要删除吗?"
                         @confirm="deleteClick(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="page" v-if="props.tableConfig.page.enable===true">
      <el-pagination v-model:current-page="props.tableConfig.page.number"
                     v-model:page-size="props.tableConfig.page.size" :page-sizes="[10, 20, 50, 100]"
                     :background="true" layout="total, sizes, prev, pager, next, jumper"
                     :total="props.tableConfig.page.count"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog
        v-model="uploadDialogVisible"
        title="批量导入数据"
        width="40%"
    >
      <el-form label-width="120px">
        <el-form-item label="模板下载：">
          <el-button type="info" @click="downloadTemplate(props.templateFileUrl)">
            <el-icon>
              <Download/>
            </el-icon>
            点击下载
          </el-button>
        </el-form-item>
        <el-form-item label="文件上传：">
          <el-upload drag accept=".xls,.xlsx" :auto-upload="false" :on-change="handleChange">
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                请上传.xls,.xlsx格式文件，文件最大为500kb
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload">
          导入
        </el-button>
      </span>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {Download, EditPen, Plus, Upload, UploadFilled} from "@element-plus/icons-vue"
import {importFile} from "@/utils/excel";
import {ElMessage} from "element-plus";

const emits = defineEmits(['submitShow', 'submitDelete', 'submitEdit', 'submitAdd', 'submitExport',
  'submitImport', 'multipleClick', 'submitMultiple', 'pageSize', 'pageNumber', 'submitCode'])
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: []
  },// 表格数据
  fieldConfig: {
    type: Array,
    required: true,
    default: []
  }, // 列表字段配置
  tagConfig: {
    type: Object,
    required: false,
    default: {}
  },// tag标签显示配置
  templateFileUrl: {
    type: String,
    required: false,
    default: ''
  },// 模板文件下载地址
  tableConfig: {
    type: Object,
    required: false,
    default: {
      'edit': false, // 是否编辑
      'delete': false, // 是否删除
      'add': false, // 是否添加
      'show': false, // 是否查看详情
      'export': true,//是否批量导出
      'import': true,//是否批量导入
      'multiple': true,//是否多选
      'page': {enable: false, size: 10, number: 1, count: 0},//是否开启分页
      'sort': {prop: 'time', order: 'descending'}, // 是否默认排序
    }// 操作选项配置
  }
})
// 表格显示配置
const fieldConfig = ref([])
// 点击查看按钮事件
const showClick = (value) => {
  // console.log(value)
  emits('submitShow', value)
}
// 点击编辑按钮事件
const editClick = (value) => {
  emits('submitEdit', value)
}
// 点击删除按钮事件
const deleteClick = (value) => {
  emits('submitDelete', value)
}
// 点击添加数据事件
const addClick = () => {
  emits('submitAdd')
}
// 点击批量导出事件
const exportClick = () => {
  emits('submitExport')
}
// 点击批量导入事件
const importClick = () => {
  uploadDialogVisible.value = true
}
// 批量导入文件弹窗
const uploadDialogVisible = ref(false)
// 下载模板文件
const downloadTemplate = (url) => {
  window.open(url)
}
// 上传数据
const uploadData = ref([])
// 文件上传事件
const handleChange = async (file) => {
  // console.log("file", file)
  await importFile(file).then(data => {
    uploadData.value = data
  }).catch(() => {
    console.log('解析失败')
    ElMessage.error('Excel文件解析失败！请检查文件内容重新上传')
  })
  // console.log("uploadData.value", uploadData.value)
};
// 批量添加数据提交事件
const submitUpload = () => {
  uploadDialogVisible.value = false
  // console.log("submit-data", uploadData.value)
  emits('submitImport', uploadData.value);
}
// 批量多选点击事件
const multipleClick = () => {
  emits('multipleClick');
}
// 批量多选元素列表
const selectList = ref([])
// 批量多选更新事件
const handleSelectionChange = (val) => {
  selectList.value = []
  for (let i in val) {
    selectList.value.unshift(val[i].id)
  }
  emits('submitMultiple', selectList.value)
}
// 改变分页大小
const handleSizeChange = (val) => {
  emits('pageSize', val)
  // console.log(`${val} items per page`)
}
// 改变页码
const handleCurrentChange = (val) => {
  emits('pageNumber', val)
  // console.log(`current page: ${val}`)
}
// 自定义标签正确显示内容
const tagConfigFind = (item, value) => {
  // console.log(item, value)
  for (let i in props.tagConfig[item]) {
    // console.log(props.tagConfig[item][i])
    if (value === props.tagConfig[item][i]['value']) {
      // console.log({'label': props.tagConfig[item][i]['label'], 'type': props.tagConfig[item][i]['type']})
      return {'label': props.tagConfig[item][i]['label'], 'type': props.tagConfig[item][i]['type']}
    }
  }
}
const tableRef = ref(null)
onMounted(() => {
  setTimeout(() => {
    fieldConfig.value = []
    for (const i in props.fieldConfig) {
      if (props.fieldConfig[i].is_table_show) {
        // console.log(props.fieldConfig[i].is_search)
        fieldConfig.value.push(props.fieldConfig[i])
      }
    }
  }, 0)
})

</script>

<style scoped lang="scss">
.tableConfig-btn {
  margin-bottom: 15px;
}

.page {
  margin: 20px 10px;
  float: right;
}

.el-table {
  max-height: calc(100vh - 360px);
  overflow-y: auto;
}
</style>