<template>
  <header class="header-wrapper">

    <div class="content clearfix">

      <router-link class="logo-wrapper pull-left" :to="'/index'">
        <span class="logo"></span>开放平台
      </router-link>
      <ul class="list-inline pull-right">
        <li><span class="search-wrapper"><i class="icon-search"></i><input type="text" placeholder="输入关键词搜索" id="J_search_input" maxlength="50" v-model="content"></span></li>
        <router-link tag="li" to="/index"><a href="javascript:;">平台首页</a></router-link>
        <router-link tag="li" to="/doc"><a href="javascript:;">文档中心</a></router-link>
        <router-link tag="li" to="/about"><a href="javascript:;">关于我们</a></router-link>
        <li>
          <a class="btn btn-white" @click.stop.prevent="showLogin($event)">
            登录
          </a>
        </li>
      </ul>
    </div>

  </header>
</template>

<script>
export default {
  name: 'pageHeader',
  data () {
    return {
      name: '',
      pwd: '',
      content: ''
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less">
  .header-wrapper {
    // min-width: 1200px;
    height: 70px;
    background-color: #000;
    color: #fff;
    line-height: 70px;
    font-size: 16px;
    .content{
      position: relative;
      min-width: inherit;
      ul li {
        padding: 0 30px;
        &:last-child {
          padding: 0;
          font-size: 0;
          vertical-align: top;
        }
        a {
          line-height: 66px;
          color: #fff;
          display: inherit;
          border-top: 2px solid transparent;
          &:hover {
            text-decoration: underline;
          }
        }
        &.active a {
          border-top: 2px solid #fff;
        }
        .btn-white {
          margin: 0 0 0 30px;
          font-weight: bold;
          font-size: 16px;
          padding: 0 14px;
          line-height: 31px;
          color: #000;
          border-top: none;
          &:hover {
            text-decoration: none;
          }
        }
      }
      .login-modal{
        top: 70px;
        right: 0;
        padding: 20px;
        width: 270px;
        color: #666;
        input{
          height: 42px;
          display: block;
          margin-bottom: 20px;
        }
        button{
          height: 42px;
          display: block;
          width: 100%;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .login-modal.menu-modal{
        right: 3px;
        padding: 0;
        width: 100px;
      }
      .login-modal:before{
        right: 36px;
        left: auto;
      }
      .login-modal.menu-modal:before{
        right: 40px;
        left: auto;
      }
    }
  }
  .logo-wrapper {
    font-size: 24px;
    cursor: pointer;
    color: #fff;
    .logo {
      display: inline-block;
      width: 28px;
      height: 28px;
      background-size: 100% auto;
      background: url('../../assets/images/logo.png') center no-repeat;
      vertical-align: text-bottom;
      margin-right: 15px;
    }
  }
  @media(max-width: 1200px) {
    .logo-wrapper {
      padding-left: 15px;
    }
    .header-wrapper .content ul li .btn-white {
      margin-right: 15px;
    }
  }
  .search-wrapper {
    display: block;
    padding: 0 10px;
    margin-right: -30px;
    cursor: pointer;
    padding: 0 20px;
    input {
      // width: 0;
      background-color: transparent;
      border: none;
      padding: 0;
      color: #f2f2f2;
      // transition: width .2s ease-out;
      font-size: 16px;
      width: 150px;
      margin-left: 10px;
    }
      background-color: rgba(255, 255, 255, 0.1);
    // &:hover {
    //   input {
    //     // width: 150px;
    //     // margin-left: 10px;
    //   }
    // }
    .icon-search {
      width: 25px;
      height: 25px;
      display: inline-block;
      position: relative;
      top: 2px;
      left: 2px;
      cursor: pointer;
      vertical-align: middle;
      &:before {
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        width: 50%;
        height: 50%;
        border: 2px #f2f2f2 solid;
        border-radius: 50%;
        display: block;
      }
      &:after {
        position: absolute;
        top: 60%;
        left: 50%;
        width: 35%;
        height: 2px;
        display: inline-block;
        content: "";
        background-color: #f2f2f2;
        border-radius: 20%;
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
      }
    }
  }
</style>