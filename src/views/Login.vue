<template>
  <div class="relative min-h-screen flex">
    <div
        class=" flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg">
      <div
          class="sm:w-1/2  xl:w-3/5  h-full  hidden  md:flex  flex-auto  items-center  justify-center  p-10  overflow-hidden  bg-purple-900  text-white  bg-no-repeat bg-cover  relative  bgi ">
        <div
            class=" absolute bg-gradient-to-b from-indigo-600 to-blue-500 opacity-75 inset-0 z-0  "></div>
        <div class="w-full max-w-md z-10">
          <div class="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">XXXX管理系统</div>
          <div class="sm:text-1xl xl:text-md text-gray-200 font-normal mb-3">
            这是一段说明文字
          </div>
        </div>
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div
          class="  md:flex md:items-center md:justify-center  w-full  sm:w-auto  md:h-full  w-2/5  xl:w-2/5  p-8  md:p-10  lg:p-14  sm:rounded-lg  md:rounded-none  auto-bg ">
        <div class="max-w-md w-full mx-auto space-y-8">
          <form class="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" value="true">
            <div class="relative">
              <label class="ml-3 text-sm font-bold text-gray-700 tracking-wide">账号</label>
              <input
                  class="w-full  text-base  px-4  py-2  border-b border-gray-300  focus:outline-none  rounded-2xl  focus:border-indigo-500      "
                  placeholder="请输入账号" v-model="loginForm.username">
            </div>
            <div class="mt-8 content-center">
              <label class="ml-3 text-sm font-bold text-gray-700 tracking-wide">密码</label>
              <input
                  class="  w-full  content-center  text-base  px-4  py-2  border-b  rounded-2xl  border-gray-300  focus:outline-none focus:border-indigo-500      "
                  placeholder="请输入密码" v-model="loginForm.password" type="password">
            </div>
            <div class="flex items-center justify-between"></div>
            <div>
              <a type="submit" @click="login"
                 class="  w-full  flex  justify-center  bg-gradient-to-r  from-indigo-500  to-blue-600  hover:bg-gradient-to-l  hover:from-blue-500  hover:to-indigo-600  text-gray-100  p-4  rounded-full  tracking-wide  font-semibold  shadow-lg  cursor-pointer  transition  ease-in  duration-500      ">
                登 录
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue";
import {useRouter} from "vue-router";
import {ElMessage} from 'element-plus'
import useStore from "@/store";
import {postLogin} from "@/api/home";
import {storeToRefs} from "pinia";
const {user} = useStore();
const {token} = storeToRefs(user)
const router = useRouter()
// 登录表单
const loginForm = reactive({
  username: 'demo',
  password: '!QAZ3edc'
})
// 登录表单验证规则
const login = () => {
  postLogin(loginForm).then((response) => {
    console.log(response)
    user.changeUser(response)
    ElMessage.success({
      message: '登录成功，正在跳转至平台主页！',
      type: 'success',
    })
    router.push('/index')
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    if (response.status === 400){
      ElMessage.error('账号或密码错误！')
      loginForm.username = ''
      loginForm.password = ''
      user.reset()
    }
  });
}
</script>

<style scoped lang="scss">
@import "/src/assets/style/tailwind.min.css";
@import "/src/assets/style/login.css";

.bgi {
  background-image: url("/src/assets/images/login.jpg");
}

.auto-bg {
  background-color: var(--el-bg-color-page);
}

</style>
