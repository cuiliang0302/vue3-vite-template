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
      <el-steps :space="200" :active="stepActive" simple style="margin-bottom: 15px">
        <el-step title="下载模板" :icon="Document"/>
        <el-step title="上传表格" :icon="DocumentAdd"/>
        <el-step title="预览数据" :icon="Tickets"/>
      </el-steps>
      <div v-show="stepActive===0">
        请点击
        <el-button type="primary" text @click="downloadTemplate">此处</el-button>
        下载模板文件
      </div>
      <div v-show="stepActive===1">
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
      </div>
      <div v-show="stepActive===2">
        <el-table :data="uploadData" style="width: 100%" stripe border>
          <el-table-column v-for="item in uploadDataProp" :prop="item" :label="item"/>
        </el-table>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="stepClick">{{ stepText }}</el-button>
      </span>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {Download, EditPen, Plus, Upload, Document, DocumentAdd, Tickets, UploadFilled} from "@element-plus/icons-vue"
import {ElMessage} from "element-plus";
import {importFile} from "@/utils/excel";

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
// 步骤条当前步骤
const stepActive = ref(0)
// 导入弹窗按钮文字
const stepText = ref('下一步')
// 点击上传窗口步骤按钮事件
const stepClick = () => {
  stepActive.value++
  switch (stepActive.value) {
    case 2:
      stepText.value = "导入"
      break;
    case 3:
      uploadDialogVisible.value = false
      stepText.value = "下一步"
      stepActive.value = 0
      console.log("开始上传了啊")
      emits('submitImport', uploadData.value);
      break;
    default:
      break;
  }
}
// 点击上传窗口取消按钮事件
const cancelClick = () => {
  stepText.value = "下一步"
  stepActive.value = 0
  uploadDialogVisible.value = false
}
// 下载模板文件
const downloadTemplate = () => {
  window.open(props.templateFileUrl)
}
// 上传数据内容
const uploadData = ref([])
// 上传数据字段
const uploadDataProp = ref([])
// 文件上传事件
const handleChange = (file) => {
  console.log("file", file.raw)
  const reader = new FileReader();
  reader.onload = async () => {
    const content = reader.result;
    importFile(content).then((data) => {
      console.log(data)
      uploadData.value = data
      uploadDataProp.value = Object.keys(uploadData.value[0])
      console.log("uploadData.value", uploadData.value)
      console.log(uploadData.value[0])
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error('获取列表数据失败！')
    });
  };
  reader.readAsBinaryString(file.raw);
};

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
const tagConfigFind = (tag, value) => {
  if (value) {
    // console.log(tag, value)
    for (let i in props.tagConfig[tag]) {
      // console.log(props.tagConfig[item][i])
      if (value === props.tagConfig[tag][i]['value']) {
        // console.log({'label': props.tagConfig[item][i]['label'], 'type': props.tagConfig[item][i]['type']})
        return {'label': props.tagConfig[tag][i]['label'], 'type': props.tagConfig[tag][i]['type']}
      }
    }
  }
}
const tableRef = ref(null)
onMounted(() => {
  fieldConfig.value = props.fieldConfig.filter(item => {
    return item.is_table_show
  })
  // console.log("fieldConfig.value", fieldConfig.value)
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