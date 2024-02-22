<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
  <el-button type="success" @click="importExcel">导入excel</el-button>
  <p>导入数据预览</p>
  {{ uploadData}}
  <el-dialog
      v-model="uploadDialogVisible"
      title="批量添加数据"
      width="40%"
  >
    <el-form label-width="120px">
      <el-form-item label="模板下载：">
        <el-button type="info" @click="downloadTemplate">
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
</template>

<script setup>
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {Download, UploadFilled} from "@element-plus/icons-vue"
import {getDemo} from "@/api/home";
import {timeFormatConversion} from "@/utils/timeFormat";
import {exportFile, importFile} from "@/utils/excel";
// 表格字段配置
const fieldConfig = ref([
  {
    'label': 'ID', // 标签
    'model': 'id',// 字段名
    'is_export': true,// 是否导出该字段
  },
  {
    'label': '用户名', // 标签
    'model': 'username',// 字段名
    'is_export': true, // 是否导出该字段
  },
  {
    'label': '省份', // 标签
    'model': 'province',// 字段名
    'is_export': true // 是否导出该字段
  },
  {
    'label': '性别', // 标签
    'model': 'sex_name',// 字段名
    'is_export': true // 是否导出该字段
  },
  {
    'label': '生日', // 标签
    'model': 'birthday',// 字段名
    'is_export': true, // 是否导出该字段
  },
  {
    'label': '身高(cm)', // 标签
    'model': 'height',// 字段名
    'is_export': true, // 是否导出该字段
  },
  {
    'label': '体重(kg)', // 标签
    'model': 'weight',// 字段名
    'is_export': true,// 是否导出该字段
  },
  {
    'label': '注册时间', // 标签
    'model': 'created_time',// 字段名
    'is_export': true, // 是否导出该字段
  },
  {
    'label': '个人介绍', // 标签
    'model': 'introduction',// 字段名
    'is_export': true,// 是否导出该字段
  }
])
// 导出Excel事件
const exportExcel = () => {
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
// 导入excel弹窗是否显示
const uploadDialogVisible = ref(false)
// 点击导入excel按钮事件
const importExcel = () => {
  uploadDialogVisible.value = true
}
// 下载模板文件
const downloadTemplate = () => {
  window.open('https://api.cuiliangblog.cn/static/demo-template.xlsx')
}
// 文件数据
const uploadData=ref([])
// 文件上传事件
const handleChange = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    const content = reader.result;
    importFile(content).then((data) => {
      console.log(data)
      uploadData.value = data
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error('获取列表数据失败！')
    });
  };
  reader.readAsBinaryString(file.raw);
};
// 点击导入excel提交数据事件
const submitUpload = () => {
  uploadDialogVisible.value =false
}
</script>

<style scoped lang="scss">

</style>