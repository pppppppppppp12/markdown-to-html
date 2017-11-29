<template>
  <!-- 文档纵向滚动条 -->
  <div class="doc-wrapper small-scroll-y small-scroll-8" id="J_scroll">
    <!-- 文档内容 -->
    <div class="doc-content" id="J_descript_wrapper">
      <h1>文档标题</h1>
      <div class="editor-txt editormd" id="J_descript">
        <textarea cols="30" rows="10" v-html="this.descript" hidden></textarea>
      </div>
    </div>
  </div>
</template>
<script>
  // editormd中生成<script>来按需加载依赖文件，此处用$script
  import $script from 'scriptjs'
  // 防止xss攻击，initmd中传入，在md解析成html后进行过滤，渲染html前执行
  import xss from 'xss'
  import '../../plugins/editormd/css/editormd.css'

  export default {
    data () {
      return {
        descript: ''
      }
    },
    props: {
      'dataPath': {
        type: String,
        default: '/static/data/', // md文档 模拟数据
      },
      'editorPath': {
        type: String,
        default: '/static/js/editormd/', // 插件放在static，不打包在库文件中，按需加载
      },
    },
    mounted () {
      // md渲染依赖文件
      let scriptArr = [
        [
          `${this.editorPath}lib/marked.min.js`,
          // `${this.editorPath}lib/marked.js`, // 修改过，需要单独打包成marked.min，原版见marked_bd
          `${this.editorPath}lib/prettify.min.js`,
          `${this.editorPath}lib/raphael.min.js`,
          `${this.editorPath}lib/flowchart.min.js`
        ],
        [
          `${this.editorPath}lib/underscore.min.js`,
          `${this.editorPath}lib/sequence-diagram.min.js`,
          `${this.editorPath}lib/jquery.flowchart.min.js`,
        ],
        [
          `${this.editorPath}js/editormd.min.js`
          // `${this.editorPath}js/editormd.js` // 修改过，需要单独打包成editormd.min，原版见editormd_bd
        ]
      ];
      // 避免插件中scriptList重复加载
      this.initLoadScript(scriptArr);
    },
    methods: {
      loadScript (loadList, callback) {
        if(loadList.length) {
          $script(loadList, callback)
        }else {
          callback();
        }
      },
      initLoadScript (scriptArr) {
        let scriptList = document.getElementsByTagName('script');
        for (let i = scriptList.length - 1; i >= 0; i--) {
          if(!scriptList[i] || !scriptList[i].src) continue;
          scriptArr.forEach((val, index) => {
            val.forEach((val1, index1) => {
              if(scriptList[i].src.includes(val1)) {
                val = val.splice(index1, 1);
              }
            })
          })
        }
        this.loadScript(scriptArr[0], () => {
          this.loadScript(scriptArr[1], () => {
            this.loadScript(scriptArr[2], () => {
              this.getDocDetail();
            })
          })
        })
      },
      // 获取md文档详情
      getDocDetail () {
        this.$http.get(`${this.dataPath}md-demo.txt`).then((data) => {
          this.descript = data.data;
          this.initMd(this.descript);
        })
      },
      // 初始化md解析
      initMd (data) {
        let $_this = this;
        $_this.$nextTick((editormd = window.editormd) => {
          document.getElementById('J_descript').innerHTML = ''; // 重置文本内容
          let descript = editormd.markdownToHTML('J_descript', {
            markdown        : data ,//+ "\r\n" + $("#append-test").text(),
            htmlDecode      : "style,script,iframe",  // you can filter tags decode
            tocm            : true,    // Using [TOCM]
            markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
            emoji           : true,
            taskList        : true,
            // tex             : true,  // 默认不解析
            flowChart       : true,  // 默认不解析
            sequenceDiagram : true,  // 默认不解析
            xss: xss,
            path: '/static/js/editormd/lib/',
            onload: function () { // 初始化渲染完毕，回调
              // 初始化右侧栏
              $_this.initRight(); 

              let $dom = $('#J_descript'),
                  titleIndexToc = 0, // 处理md中toc、tocm链接跳转
                  titleIndexTocm = 0,
                  firstTitle = undefined;
              // 处理链接新窗口打开
              $dom.find('a').each(function () {
                let url = $(this).attr('href');
                if(url) {
                  let level = $(this).attr('level'),
                    titleFlag = ($(this).parents('.markdown-toc').length || $(this).parents('.editormd-toc-menu').length) 
                    && (level && (level < 4)) ? true : false;
                  $(this).attr('target', '_blank')
                  if(firstTitle === undefined && titleFlag) {
                    firstTitle = true;
                    if(level >= 2) {
                      titleIndexTocm = level - 2;
                      titleIndexToc = level - 2;
                    }
                  }
                }
              }) // 处理表格（修复 在最后一个单元格为空的情况下会缺块）
              .end().find('table').each(function () {
                let $this = $(this);
                if ($this.find('tr').width() >= $dom.width()) {
                  $this[0].className = 'overflow-table';
                }
                let cellsIndex = $this.find('tr').eq(0)[0].cells.length;
                $this.find('tr').each(function() {
                  if(this.cells.length < cellsIndex) {
                    let td = document.createElement('td');
                    this.appendChild(td)
                  }
                })
              })
            },
          })
        })
      },
      initRight () {
        // 获取详情后，初始化右侧导航标题
        let childArr = document.getElementById('J_descript').children,
          titleDomArr = [document.getElementById('J_descript_wrapper').children[0]], // 文档导航对应dom 先插入文档最顶部标题
          titleArr = []; // 文档导航文字
        // 初始化标题信息（只有一级标题的情况）
        for( let i = 0; i < childArr.length; i++ ) {
          if(childArr[i].tagName == 'H1') {
            titleDomArr.push(childArr[i]);
          }
        }
        for(let i = 0; i <= titleDomArr.length - 1; i++) {
          let text = titleDomArr[i].innerText;
          titleArr.push(text);
        }
        this.$store.state.anchor.anchorList = titleDomArr;
        this.$store.state.anchor.titleList = titleArr;
      },
    }
  }
</script>
<style lang="less">
  @green: #44a542;
  .doc-wrapper {
    display: inline-block;
    vertical-align: top;
    z-index: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow-y: scroll;
  }
  // 编辑器外层样式
  .editor-txt {
    padding: 0;
    width: 100%;
    word-break: break-all;
    height: auto;
    border: 0;
    margin-bottom: 0;
    position: static;
    padding-bottom: 30px;
    h1, h2, h3, h4, h5, h6 {
      font-weight: normal;
    }
  }
  .doc-content {
    position: absolute;
    top: 0;
    left: 50%;
    width: 820px;
    margin-left: -370px;
    padding-top: 30px;
  }
</style>