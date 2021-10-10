import Vuex from 'vuex';
import Vue from 'vue';
import createPersistedState from "vuex-persistedstate";
import apiStore from './modules/apiStore';
import localStore from './modules/localStore';

// Load Vuex
Vue.use(Vuex);
// Create store
export default new Vuex.Store({
  modules: {
    apiStore,localStore
  },
  plugins: [createPersistedState({
    paths : ['localStore']
  })]
});
