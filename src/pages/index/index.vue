<template>
  <!-- 超过1200px水平滚动条 -->
  <div class="doc-list-scroll small-scroll-8">
    <div class="doc-list-content">
      <leftBar></leftBar>
      <router-view></router-view>
      <rightBar></rightBar>
    </div>
  </div>
</template>
<script>
  import leftBar from './leftBar.vue'
  import rightBar from './rightBar.vue'

	export default {
    data() {
      return {
        loading: true
      }
    },
		components: {
      leftBar: leftBar,
      rightBar: rightBar
		},
    created () {
      this.loading = false;
    }
	}
</script>
<style lang="less">
  @green: #44a542;
  .index-wrapper {
    width: 100%;
    height: 100%;
    max-width: 100%;
    position: absolute;
    top: 70px;
    left: 0;
    overflow: hidden;
    padding-bottom: 70px;
    min-width: auto;
    .doc-list-scroll {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .doc-list-content {
      position: relative;
      min-width: 1200px;
      height: 100%;
    }
    .loading-wrapper {
      top: 70px;
      position: fixed;
    }
    .content {
      font-size: 0;
    }
  } 
</style>