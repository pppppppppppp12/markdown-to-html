<template>
  <div class="left-wrapper">
    <div class="small-scroll-y">
      <router-link tag="ul" to="/index" class="item-list">
        <li class="item-title"><em class="icon-leftbar icon-fengniao"></em>文档</li>
        <li class="active">文档标题</li>
      </router-link>
    </div>
  </div>
</template>
<script>
  export default {
    methods: {
      setActive (str) {
        return this.$route.params.module ? this.$route.params.module.indexOf(str) == 0 : false
      },
    }
  }
</script>
<style lang="less">
  .left-wrapper {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 50%;
    margin-left: -600px;
    z-index: 1;
    height: 100%;
    color: #666;
    width: 200px;
    padding: 30px 0;
    font-size: 14px;
    pointer-events: none; // 左侧栏滚动区域外，也可以滚动文档内容（注意兼容性）
    .small-scroll-y {
      min-height: 200px;
      border-top: 0;
      max-height: 100%;
      overflow-y: auto;
      border: 1px solid #e8e4e4;
      pointer-events: auto; // 左侧栏滚动区域内，不可触发滚动文档内容
    }
    .item-list {
      padding: 15px 0;
      line-height: 35px;
      background-color: #fcfcfc;
      font-size: 14px;
      cursor: pointer; 
      color: #666; 
      &.active {
        background-color: #fff;
        border-right: none;
      }
      &:hover {
        background-color: #fff;
      }
      .item-title {
        font-size: 16px;
        font-weight: bold;
        position: relative;
        .icon-leftbar {
          position: absolute;
          top: 2px;
          left: 8px;
        }
      }
      li {
        padding-left: 40px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding-right: 5px;
      }
      .item {
        line-height: 28px;
        &.active, &:hover {
          color: #44a542;
        }
        &:hover {
          text-decoration: underline;
        }
      }
      + .item-list {
        border-top: 1px solid #e8e4e4;
      }
    }
  }
  .icon-leftbar {
    width: 30px;
    height: 30px;
    display: inline-block;
    background-position: center;
    background-repeat: no-repeat;
  }
  .icon-fengniao {
    background-image: url(../../assets/images/icon-fengniao.png);
  }
</style>