import Vue from 'vue'
import Vuex from 'vuex'

import anchor from './modules/anchor'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  modules: {
    anchor,
  }
});