<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
</template>

<script setup>
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
// 导出excel文件
const exportExcel = () => {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表，名为sheet1
  const sheet1 = workbook.addWorksheet("sheet1");
  // 导出数据列表
  const data = [
    {"姓名": "张三", "年龄": 18, "身高": 1.75, "体重": 74},
    {"姓名": "李四", "年龄": 22, "身高": 1.77, "体重": 84},
    {"姓名": "王五", "年龄": 53, "身高": 1.55, "体重": 64}
  ]
  // 获取表头所有键
  const headers = Object.keys(data[0])
  // 将标题写入第一行
  sheet1.addRow(headers);
  // 将数据写入工作表
  data.forEach((row) => {
    const values = Object.values(row)
    sheet1.addRow(values);
  });
  // 年龄大于18岁红色标注
  sheet1.addConditionalFormatting({
    ref: "B2:B4",
    rules: [
      {
        type: "cellIs",
        operator: "greaterThan",
        priority: 1,
        formulae: [18],
        style: {
          fill: {
            type: "pattern",
            pattern: "solid",
            bgColor: { argb: "FFFFC0CB" },
          },
        },
      },
    ],
  });
  // 导出表格文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    let file = new Blob([buffer], {type: "application/octet-stream"});
    FileSaver.saveAs(file, "ExcelJS.xlsx");
  }).catch(error => console.log('Error writing excel export', error))
}

</script>

<style scoped lang="scss">

</style>