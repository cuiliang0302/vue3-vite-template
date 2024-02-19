// 引入依赖
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
import {timeFile} from "@/utils/timeFormat";


// 导出excel文件
export function exportFile(export_data, filename) {
    // 创建工作簿
    const workbook = new ExcelJS.Workbook();
    // 添加工作表，名为sheet1
    const sheet1 = workbook.addWorksheet("sheet1");
    // 获取表头所有键
    const headers = Object.keys(export_data[0])
    // 将标题写入第一行
    sheet1.addRow(headers);
    // 将数据写入工作表
    export_data.forEach((row) => {
        const values = Object.values(row)
        sheet1.addRow(values);
    });
    // 设置默认宽高属性
    sheet1.properties.defaultColWidth = 20
    sheet1.properties.defaultRowHeight = 20
    // 修改所有单元格样式
    // 遍历每一行
    sheet1.eachRow((row, rowNumber) => {
        // 遍历每个单元格
        row.eachCell((cell) => {
            // 设置边框样式
            cell.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
            };
            // 设置居中对齐
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center'
            };
        });
    });
    // 获取标题行数据
    const titleCell = sheet1.getRow(1);
    // 设置标题行单元格样式
    titleCell.eachCell((cell) => {
        // 设置标题行背景颜色
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: '3498db'}
        };
        // 设置标题行字体
        cell.font = {
            bold: true,// 字体粗体
        };
    })
    // 导出表格文件
    workbook.xlsx.writeBuffer().then((buffer) => {
        let file = new Blob([buffer], {type: "application/octet-stream"});
        FileSaver.saveAs(file, filename + timeFile() + ".xlsx");
    }).catch(error => console.log('Error writing excel export', error))
}

// 导入excel文件
export function importFile(content) {
    return new Promise((resolve, reject) => {
        // 创建一个空的JavaScript对象数组，用于存储解析后的数据
        const data = [];
        //创建Workbook实例
        const workbook = new ExcelJS.Workbook();
        workbook.xlsx.load(content).then(workbook => {
            // 获取第一个worksheet内容
            const worksheet = workbook.getWorksheet(1);
            // 获取第一行的标题
            const headers = [];
            worksheet.getRow(1).eachCell((cell) => {
                headers.push(cell.value);
            });
            // console.log("headers", headers)
            // 遍历工作表的每一行（从第二行开始，因为第一行通常是标题行）
            for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                const rowData = {};
                const row = worksheet.getRow(rowNumber);
                // 遍历当前行的每个单元格
                row.eachCell((cell, colNumber) => {
                    // 获取标题对应的键，并将当前单元格的值存储到相应的属性名中
                    rowData[headers[colNumber - 1]] = cell.value;
                });
                // 将当前行的数据对象添加到数组中
                data.push(rowData);
            }
            // console.log("data", data)
            resolve(data);
        }).catch(error => {
            reject(error);
        });
    })
}