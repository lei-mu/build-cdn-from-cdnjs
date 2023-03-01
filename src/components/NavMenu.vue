<template>
  <el-menu
    :default-active="activeIndex"
    class="menu"
    router
    mode="horizontal"
  >
    <template v-for="item in state.navData" :key="item.id">
      <el-menu-item :index="item.id" :route="item.path" v-if="!item.children">{{ item.navName }}</el-menu-item>
      <el-sub-menu :index="item.id" v-else>
        <template #title>{{ item.navName }}</template>
        <el-menu-item :index="list.id" :route="list.path" v-for="list in item.children" :key="list.id">
          {{ list.navName }}
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const NavMenu = () => import('@/components/NavMenu.vue')

const state = reactive({
  navData: []
})

// 菜单的id 集合
const menusIds = computed(() => {
  let ids = []
  state.navData.forEach(p1 => {
    ids.push(p1.id)
    if (p1.children) {
      p1.children.forEach(x1 => {
        ids.push(x1.id)
      })
    }
  })
  return ids
})
// 当前激活的菜单id
const activeIndex = computed(() => {
  const route = useRoute()
  let matched = route.matched
  let val = ''
  let menuIdsArr = menusIds.value
  for (let i = matched.length - 1; i > -1; i--) {
    let metaId = matched[i].meta.id
    if (menuIdsArr.includes(metaId)) {
      val = metaId
      break
    }
  }
  return val
})
// 格式化菜单数据
const formatNavData = () => {
  const options = useRouter().options.routes
  const menuRouters = options.find(p1 => p1.name === 'layout')

  const handleRouter = (data) => {
    let itemRouter = []
    data.forEach(p1 => {
      let itemMeta = p1.meta
      if (itemMeta && itemMeta.isMenu) {
        let menuItem = {
          id: itemMeta.id,
          navName: itemMeta.navName,
          path: p1.path
        }
        if (p1.children) {
          const itemChildren = handleRouter(p1.children)
          if (itemChildren.length) {
            menuItem.children = menuItem
          }
        }
        itemRouter.push(menuItem)
      }
    })
    return itemRouter
  }
  state.navData = handleRouter(menuRouters.children)
}
formatNavData()
</script>
<script>
export default {
  name: 'NavMenu'
}
</script>

<style scoped lang="scss">
.menu {
  flex-wrap: nowrap;
  border-bottom: none;
}

</style>
