<template>
  <el-card shadow="hover">
    <div class="tableConfig-btn">
      <el-button v-if="props.tableConfig.add===true" type="primary" @click="addClick">
        <el-icon>
          <Plus/>
        </el-icon>
        <slot name="text">新增数据</slot>
      </el-button>
      <slot name="table-btn"></slot>
    </div>
    <el-table ref="tableRef" :data="props.data" border style="width: 100%" :default-sort="props.tableConfig.sort"
              max-height="700">
      <el-table-column v-for="(item,index) in fieldConfig" :key="index"
                       :prop="item.model" :label="item.label" :width="item.width?item.width:''"
                       :sortable="item.sortable?item.sortable:true"
                       align="center">
        <template #default="scope" v-if="tagShow(item.model)">
          <el-tag :type="tagFind(item.model, scope.row[item.model])['type']">
            {{ tagFind(item.model, scope.row[item.model])['label'] }}
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
                     v-model:page-size="props.tableConfig.page.size" :page-sizes="[10, 20, 50, 100,1000]"
                     :background="true" layout="total, sizes, prev, pager, next, jumper"
                     :total="props.tableConfig.page.count"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </el-card>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {Plus} from "@element-plus/icons-vue"

const emits = defineEmits(['submitShow', 'submitDelete', 'submitEdit', 'submitAdd', 'pageSize', 'pageNumber', 'submitCode'])
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
  tag: {
    type: Array,
    required: false,
    default: [{
      prop: '',
      mapping: []
    }]
  },// tag标签显示配置
  tableConfig: {
    type: Object,
    required: false,
    default: {
      'edit': false, // 是否编辑
      'delete': false, // 是否删除
      'add': false, // 是否添加
      'show': false, // 是否查看详情
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


// 判断是是否显示自定义标签
const tagShow = (value) => {
  // console.log(value)
  for (let i in props.tag) {
    // console.log(props.tag[i])
    if (props.tag[i].prop === value) {
      return true
    }
  }
  return false
}
// 自定义标签正确显示内容
const tagFind = (prop, value) => {
  // console.log(prop, value)
  for (let i in props.tag) {
    if (props.tag[i]['prop'] === prop) {
      // 找到了字段
      // console.log(props.tag[i])
      for (let j in props.tag[i]['mapping']) {
        // console.log(props.tag[i]['mapping'][j])
        if (props.tag[i]['mapping'][j]['value'] === value) {
          // console.log(props.tag[i]['mapping'][j]['value'])
          return {'label': props.tag[i]['mapping'][j]['label'], 'type': props.tag[i]['mapping'][j]['type']}
        }
      }
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