import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    name: 'Jhon',
    id: 1
  })

  const getUser = () => {
    return user.value
  }

  return { user, getUser }
})
