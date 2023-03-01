<template>
  <div class="page-footer-place"></div>
  <div class="page-footer am-flex-rc-center">
    <a href="https://cdnjs.com/api" rel="nofollow noopener noreferrer" target="_blank"
      class="footer-list footer-link">cdnjs open api</a>
    <span class="footer-list">Powered by <a href="https://github.com/lei-mu/build-cdn-from-cdnjs" class="footer-link">build-cdn-from-cdnjs</a></span>
    <a href="https://www.quanzhan.co" target="_blank" class="footer-list footer-link">我的博客</a>
  </div>
</template>

<script>
export default {
  name: 'PageFooter'
}
</script>

<style scoped lang="scss">
$footer-height: 80px;

.page-footer-place {
  height: $footer-height;
  margin-top: $do-header-bar-mb;
}

.page-footer {
  position: absolute;
  height: $footer-height;
  width: 100%;
  bottom: 0;
  flex-wrap: wrap;
  background-color: #fff;
}

.footer-list {
  display: inline-block;

  &+.footer-list {
    margin-left: 15px;
  }
}

.footer-link {
  display: inline-block;

  &:hover {
    color: #666;
  }
}

@media screen and (max-width: 1200px) {
  .page-footer {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
