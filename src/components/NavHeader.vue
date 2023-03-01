<template>
  <header class="header-bar">
    <div class="header-bar__main">
      <router-link to="/" class="header-bar__index am-flex-rc-center">
        <el-link :underline="false">build cdn from cdnjs</el-link>
      </router-link>
      <div class="header-bar__con">
        <slot></slot>
      </div>
    </div>
  </header>
  <div class="header-bar__place"></div>
</template>

<script>
export default {
  name: 'NavHeader'
}
</script>

<style scoped lang="scss">
.header-bar {
  position: fixed;
  z-index: 500;
  left: 0;
  top: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 6px 6px 6px rgba(#000,0.03);
}

.header-bar__place {
  height: $do-header-bar-hei;
}

.header-bar__main {
  display: flex;
  max-width: $do-main-wd;
  flex-direction: row;
  margin: 0 auto;
}

.header-bar__index {
  flex-shrink: 0;
  height: $do-header-bar-hei;
}

.header-bar__con {
  flex: 1;
  width: 0;
  margin-left: 45px;
}
@media  (max-width: 1200px) {
.header-bar__main{
  padding-left: 15px;
  padding-right: 15px;
}
}
</style>
