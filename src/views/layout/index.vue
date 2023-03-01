<template>
  <NavHeader>
    <NavMenu></NavMenu>
  </NavHeader>
  <router-view class="layout-main"></router-view>
  <PageFooter></PageFooter>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const NavMenu = defineAsyncComponent(() => import('@/components/NavMenu'))
const NavHeader = defineAsyncComponent(() => import('@/components/NavHeader'))
const PageFooter = defineAsyncComponent(() => import('@/components/PageFooter'))
</script>

<style scoped lang="scss">
.layout-main {
  margin-top: $do-header-bar-mb;
}
</style>
