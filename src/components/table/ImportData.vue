<template>
  <el-button type="warning" @click="uploadClick" class="import-btn">
    <el-icon>
      <Coin/>
    </el-icon>
    <slot name="text">批量导入</slot>
  </el-button>
  <el-dialog
      v-model="uploadDialogVisible"
      title="批量添加数据"
      width="40%"
  >
    <el-form label-width="120px">
      <el-form-item label="模板下载：">
        <el-button type="info" @click="downloadTemplate(templateFileUrl)">
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
import {Coin, Download, UploadFilled} from "@element-plus/icons-vue";
import * as XLSX from 'xlsx'

const props = defineProps({
  // 模板Excel文件下载地址
  templateFileUrl: {
    type: String,
    required: true,
    default: ''
  }
})
const emits = defineEmits(['submitImport'])
// 点击上传按钮
const uploadClick = () => {
  uploadDialogVisible.value = true
}
// 上传文件弹窗
const uploadDialogVisible = ref(false)
// 下载模板文件
const downloadTemplate = (url) => {
  window.open(url)
}
// Excel文件内容
const uploadData = ref([])
// 文件上传事件
const handleChange = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    const contents = reader.result;
    const workbook = XLSX.read(contents, {
      type: "binary"
    })
    const ws_name = workbook.SheetNames[0]
    uploadData.value = XLSX.utils.sheet_to_json(workbook.Sheets[ws_name])
    // console.log('uploadData.value:', uploadData.value) // 转换成json的数据
  };
  reader.readAsBinaryString(file.raw);
};
// 开始批量添加数据
const submitUpload = () => {
  uploadDialogVisible.value = false
  // console.log(uploadData.value)
  emits('submitImport', uploadData.value);
}
</script>
<style scoped lang="scss">
.import-btn {
  margin-right: 15px;
}
</style>