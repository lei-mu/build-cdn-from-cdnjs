<template>
  <keep-alive>
    <router-view class="view-router" v-if="$route.meta.keepAlive"/>
  </keep-alive>
  <router-view class="view-router" v-if="!$route.meta.keepAlive"/>
</template>

<style lang="scss">
@import "@/styles/common";
</style>
