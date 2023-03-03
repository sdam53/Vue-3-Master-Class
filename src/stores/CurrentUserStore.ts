import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import sourceData from '@/data.json'

export const useCurrentUserStore = defineStore('CurrentUserStore', () => {
  const authId = ref('VXjpr2WHa8Ux4Bnggym8QFLdv5C3')
  const authUser = computed(() => sourceData.users.find((user) => user.id === authId.value))

  return { authId, authUser }
})
