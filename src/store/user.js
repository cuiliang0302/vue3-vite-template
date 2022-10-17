import {defineStore} from 'pinia'

const useUserStore = defineStore('user', {
  state: () => ({
    name: 'zs',
    age: 100,
  })
})

export default useUserStore