// 日期对象格式化转换
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // import locale
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // use locale

// 显示几天前
export function timeAgo(valueTime) {
    return dayjs(valueTime).fromNow()
}

// 转换为指定格式
export function timeFormatConversion(valueTime, format) {
    return dayjs(valueTime).format(format)
}

// 显示全部时间范围
export function timeFullRange(startTime, endTime) {
    return dayjs(startTime).format('YYYY-MM-DD HH:mm') + '至' + dayjs(endTime).format('YYYY-MM-DD HH:mm')
}

// 时间_用于文件名
export function timeFile() {
    return dayjs(new Date()).format('YYYY_MM_DD_HH_mm_ss')
}

// 字符串转日期
export function strToDate(valueTime) {
    // console.log(valueTime)
    return dayjs(valueTime).toDate()
}

// 字符串(只有时分秒)转日期
export function strTimeToDate(valueTime) {
    return dayjs('2023-01-01 ' + valueTime).toDate()
}

// 比较日期差值
export function diffDate(value1, value2) {
    let a = dayjs(value1)
    let b = dayjs(value2)
    return b.diff(a, 'day')
}

// 比较日期差分钟值
export function diffDateMinute(value1, value2) {
    let a = dayjs(value1)
    let b = dayjs(value2)
    return b.diff(a, 'minute')
}

// 比较日期差分钟值
export function lastMinute() {
    let time = dayjs().subtract(1, 'minutes')
    return [dayjs(time).format('YYYY-MM-DD HH:mm:00'), dayjs(time).format('YYYY-MM-DD HH:mm:59')]
}
