import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

import router from './router'
import store from './store'

import Axios from 'axios'
Vue.$http = Vue.prototype.$http = Axios

import $ from 'jquery'
window.jQuery = window.$ = $;

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App),
  components: { App },
}).$mount('#app')
