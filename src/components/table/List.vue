<template>
  <el-card shadow="hover">
    <el-table :data="props.data" border style="width: 100%">
      <el-table-column v-for="(item,index) in config" :key="index"
                       :prop="item.model" :label="item.label" sortable align="center">
        <!--        {{item.is_show}}-->
        <template #default="scope" v-if="props.tag.prop===item.model">
          <el-tag
              :type="props.tag.mapping[scope.row[item.model]]"
              disable-transitions>{{ scope.row[item.model] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button v-if="props.option.edit===true" size="small" @click="editClick(scope.row.id)">编辑</el-button>
          <el-popconfirm title="确定要删除吗?" @confirm="deleteClick(scope.row.id)">
            <template #reference>
              <el-button v-if="props.option.delete===true" size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import {onMounted, ref} from "vue";

const emits = defineEmits(['submitDelete', 'submitEdit'])
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: []
  },// 表格数据
  config: {
    type: Array,
    required: true,
    default: []
  }, // 列表字段配置
  tag: {
    type: Object,
    required: false,
    default: {}
  },// tag标签显示配置
  option: {
    type: Object,
    required: false,
    default: {}
  }// 操作选项配置
})
// 表格显示配置
const config = ref([])
// 点击编辑按钮事件
const editClick = (value) => {
  emits('submitEdit', value)
}
// 点击删除按钮事件
const deleteClick = (value) => {
  emits('submitDelete', value)
}
onMounted(() => {
  for (const i in props.config) {
    // console.log(props.config[i].is_search)
    if (props.config[i].is_show) {
      // console.log(props.config[i].is_search)
      config.value.push(props.config[i])
    }
  }
  console.log(config.value)
})
</script>

<style scoped>

</style>