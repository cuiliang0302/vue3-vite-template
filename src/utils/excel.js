import fs from 'file-saver'
import {timeFile} from "@/utils/timeFormat";
import {read, utils, write} from "xlsx";
import {ref} from "vue";

// 导出excel文件
export function exportFile(json, fields, filename) {
    json.forEach(item => {
        for (let i in item) {
            if (fields.hasOwnProperty(i)) {
                item[fields[i]] = item[i];
            }
            delete item[i]; //删除原先的对象属性
        }
    })
    let sheetName = filename //excel的文件名称
    let wb = utils.book_new()  //工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
    let ws = utils.json_to_sheet(json, {header: Object.values(fields)}) //将JS对象数组转换为工作表。
    wb.SheetNames.push(sheetName)
    wb.Sheets[sheetName] = ws
    const defaultCellStyle = {font: {name: "Verdana", sz: 13, color: "FF00FF88"}, fill: {fgColor: {rgb: "FFFFAA00"}}};//设置表格的样式
    let wopts = {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary',
        cellStyles: true,
        defaultCellStyle: defaultCellStyle,
        showGridLines: false
    }  //写入的样式
    let wbout = write(wb, wopts)
    let blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'})
    fs.saveAs(blob, filename + timeFile() + '.xlsx')
}

const s2ab = s => {
    if (typeof ArrayBuffer !== 'undefined') {
        const buf = new ArrayBuffer(s.length)
        const view = new Uint8Array(buf)
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
    } else {
        const buf = new Array(s.length);
        for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}

// 导入excel文件
export function importFile(file) {
    return new Promise(function (resolve, reject) {
        let data = []
        const reader = new FileReader();
        reader.onload = () => {
            const contents = reader.result;
            const workbook = read(contents, {
                type: "binary"
            })
            const ws_name = workbook.SheetNames[0]
            data = utils.sheet_to_json(workbook.Sheets[ws_name])// 转换成json的数据
            // console.log('data', data)
            resolve(data)
        };
        reader.onerror=()=>{
            reject(NaN)
        }
        reader.readAsBinaryString(file.raw);
        // console.log('data', data)
    })
}