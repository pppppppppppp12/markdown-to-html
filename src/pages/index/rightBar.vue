<template>
  <ul class="catalog-list" :class="{'fix': fixFlag}" :style="styleObj">
    <ul class="small-scroll-y" id="J_scroll_bar" v-if="titleList.length">
      <li class="text-overflow" 
          v-for="(title, index) in titleList" 
          :class="{'active': (nowItem == title.index||(nowItem>title.index&&nowItem<=title.index+title.subCount))}" 
          @click="toTitlePos(title.index)">
        <span class="text-overflow" :title="title.name">{{title.name}}</span>
      </li></ul>
    <span class="back-to-top" @click="toTitlePos(0, true)" v-show="titleList.length!=0 && fixFlag"></span>
  </ul>
</template>
<script>
  export default {
    data() {
      return {
        fixFlag: false, // 右侧导航是否固定，超出 title1 位置时，true 固定
        nowItem: 0, // 当前 title
        distance: 150, // 滚动时离标题的 150px 的距离时，导航变化 active
        beforeScrollTop: 0, // 用于储存上一次的滚动位置，判断滚动方向
        scrollItem: null,
        clickFlag: [],
        clickFlagIndex: 0,
      }
    },
    computed: {
      titleList () {
        var titleObj = [],
          anchorArr = this.$store.state.anchor.anchorList,
          titleIndex = 0,
          subCount = 0;
        for( let i = 0; i < this.$store.state.anchor.titleList.length; i++) {
          let title = {
            name: this.$store.state.anchor.titleList[i],
            index: i,
            subtitle: []
          }
          titleObj.push(title)
        } 
        return titleObj
      },
      dom () {
        // 处理标题数据
        return this.$store.state.anchor.anchorList;
      },
      styleObj () {
        return {
          'width': '120px'
        }
      }
    },
    mounted () {
      this.firstFix = 0;
      // 添加滚动事件监听
      this.scrollItem = document.getElementById('J_scroll');
      this.scrollItem.addEventListener('scroll', this.scrollEvent);
      this.scrollItem.addEventListener('scroll', this.scrollFix);
    },
    destroyed () {
      // 取消滚动事件监听
      if(!this.scrollItem) return;
      this.scrollItem.removeEventListener('scroll', this.scrollEvent);
      this.scrollItem.removeEventListener('scroll', this.scrollFix);
    },
    methods: {
      getWinHeight () {
        return window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
      },
      scrollTop (pos) {
        if(pos == 0 || pos) {
          this.scrollItem.scrollTop = pos;
          // if(window.pageYOffset) window.pageYOffset = pos;  //用于FF(window)
        }else {
          // console.log(this.scrollItem.scrollTop)           
          return this.scrollItem.scrollTop
        }
      },
      // 滚动监听事件
      scrollEvent (e) {
        
        if(this.dom.length == 0 || this.getWinHeight() == this.scrollItem.scrollHeight) return;
        if(this.clickFlag[this.clickFlag.length - 1]) return;

        var currItem = 0,
          activeFlag = false;
        let direct = this.scrollTop() - this.beforeScrollTop,
          lastPagePos = this.scrollItem.scrollHeight - this.getWinHeight(),
          firstFix = this.firstFix;
        this.distance = firstFix > this.distance ? this.distance : 70;

        if(this.scrollTop() > firstFix) { // 位置大于标题1时
          for(let i = 0; i <= this.dom.length - 1; i++) {
            let domPos = this.dom[i].offsetTop + 40, // 40 为active 的 范围
              domText = this.dom[i].innerText;
            ((pos, text) => {
              if(text && !text.replace(/\n/,'')) return; // 处理空行的active -> 停留在上一个
              if(!pos) return;
              if((pos >= lastPagePos) && (this.scrollTop() > lastPagePos - 20)) { // 标题在最后一页，且滚动到最后一页
                if(this.scrollTop() >= lastPagePos && (this.nowItem == (this.dom.length - 1))) { // 滚动到最底部的定位
                  this.nowItem = this.dom.length - 1;
                }else {
                  this.nowItem = (this.nowItem >= this.dom.length - 1) ? (this.dom.length - 1) : (parseInt(this.nowItem) + 1);
                }
              }else if((this.scrollTop() <= lastPagePos - 20) && this.scrollTop() > pos - this.distance) { // 判断是否滚动到各标题的位置
                currItem = i;
                activeFlag = true;
              }
            })(domPos, domText);
          } 
        }else {
          currItem = 0;
          activeFlag = true;
        }
        this.beforeScrollTop = this.scrollTop();
        if(activeFlag) this.nowItem = currItem;
        this.setTitleActive(this.nowItem);

      },
      // 右侧栏底部 icon
      scrollFix () {
        let flag = this.scrollTop() > this.firstFix;
        this.fixFlag = flag;
      },
      // 右侧导航 active
      setTitleActive (index) {
        for(let i = 0; i <= this.dom.length - 1; i++) {
          if(!!this.dom[i].style) {
            this.dom[i].style.color = '#000000';
          }
        }
        if(this.dom[index] && this.dom[index].style) {
          this.dom[index].style.color = '#44a542';
        }
      },
      // 触发导航定位
      toTitlePos (index, backToTop, firstLoad) {

        if(this.titleList.length == 0) return;
        this.clickFlag[this.clickFlagIndex] = true;
        let total = backToTop ? 0 : this.dom[index].offsetTop,
          distance = this.scrollTop();
        this.titlePosScroll(index, total, this.clickFlagIndex);
        this.clickFlagIndex ++;
      },
      // 导航定位
      titlePosScroll (index, total, clickFlagIndex) {
        this.nowItem = index;
        this.setTitleActive(index);
        $(this.scrollItem).stop().animate({
          'scrollTop': total - 40
        }, 200, 'linear', () => {
          setTimeout (() => {
            this.clickFlag[clickFlagIndex] = false;
            if(!this.clickFlag[this.clickFlag.length  - 1]) {
              this.clickFlag = [];
              this.clickFlagIndex = 0;
            }
            this.scrollItem.addEventListener('scroll', this.scrollEvent);
          }, 500)
        })
      }
    },
  }
</script>
<style lang="less">
  @green: #44a542;
  .catalog-list {
    position: absolute;
    top: 0;
    left: 50%;
    text-align: left;
    z-index: 1;
    width: 100%;
    height: 100%;
    line-height: 35px;
    font-size: 14px;
    color: #666;
    margin-left: 470px;
    padding: 26px 0 100px 0;
    pointer-events: none;
    > ul {
      overflow-y: auto;
      pointer-events: auto;
      max-height: 100%;
    } 
    li {
      position: relative;
      padding-left: 20px;
      cursor: pointer;
      white-space: nowrap;
      p {
        padding-left: 8px;
        display: none;
        color: #666;
        &.active {
          color: @green;
          position: relative;
          &:before {
            content: "";
            display: inline-block;
            width: 5px;
            height: 5px;
            background-color: @green;
            border-radius: 100%;
            position: absolute;
            top: 16px;
            left: -15px;
          }
        }
        > span {
          display: inline-block;
          vertical-align: top;
          width: 100%;
        }
        > span:first-child:hover {
          text-decoration: underline;
          color: @green;
        }
      }
      &.active > span {
        color: @green;
      }
      > span:after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 100%;
        background-color: #e5e5e5;
        border-radius: 100%;
        position: absolute;
        top: 25px;
        left: 7px;
      }
      &.active:before {
        background-color: @green;
      }
      &:before {
        content: "";
        display: inline-block;
        width: 5px;
        height: 5px;
        background-color: #e5e5e5;
        border-radius: 100%;
        position: absolute;
        top: 16px;
        left: 5px;
      }
      + li:after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 23px;
        background-color: #e5e5e5;
        border-radius: 100%;
        position: absolute;
        top: -10px;
        left: 7px;
      }
    }
    .icon-arrow {
      height: 35px;
      width: 35px;
      background-size: 15px;
      float: none;
    }
    .back-to-top {
      margin-top: 20px;
      margin-left: 8px;
      pointer-events: auto;
    }
    .small-scroll-y::-webkit-scrollbar-thumb {
      background: rgba(204, 204, 204, 0.4);
    }
    .small-scroll-y::-webkit-scrollbar-track {
      background: rgba(204, 204, 204, 0.4);
    }
  }
  .back-to-top {
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 3px;
    background: url(../../assets/images/icon-arrow.png) center no-repeat; 
    background-color: #e5e5e5;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
</style>