<template>
  <el-autocomplete
      v-model="props.field"
      :fetch-suggestions="querySearch"
      popper-class="my-autocomplete"
      placeholder="请输入用户名"
      clearable
  >
    <template #default="{ item }">
      <div class="value">{{ item.value }}</div>
    </template>
  </el-autocomplete>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import Fuse from "fuse.js";
import useStore from "@/store";
import {storeToRefs} from "pinia";
import {getDemo} from "@/api/home";

const {user} = useStore()
const {id} = storeToRefs(user)
const links = ref([])
const props = defineProps({
  field: {
    type: String,
    required: true,
    default: ""
  }
})
const querySearch = (queryString, cb) => {
  if (queryString) {
    console.log(queryString)
    let resultList = []
    const fuse = new Fuse(links.value, {includeScore: false, keys: ["value"]})
    const result = fuse.search(queryString)
    console.log(result)
    result.forEach(function (item) {
      console.log(item.item)
      resultList.push(item.item)
    })
    cb(resultList)
  } else {
    cb(links.value)
  }
}
async function selectData() {
  let params = {'page': 1, 'size': 1000}
  let data = await getDemo(params)
  for (let i in data.results) {
    links.value.push(
        {
          'value': data.results[i]['username'],
          'account_id': data.results[i]['id']
        }
    )
  }
}

onMounted(() => {
  selectData()
})
</script>

<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
}
</style>
