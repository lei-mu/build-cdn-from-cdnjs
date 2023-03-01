import { defineStore } from 'pinia'

const mainStore = defineStore({
  id: 'main', // 命名，唯一
  state: () => {
    return {
      userInfo: {}
    }
  },
  actions: {
    setUserInfo (data) {
      // 可直接通过this访问state属性
      this.userInfo = data
    }
  }
})

export default mainStore
