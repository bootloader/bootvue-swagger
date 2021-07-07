//store/modules/auth.js


import axios from "axios";

const state = {
	api : {}
};

const getters = {
	StateApi: (state) => state.api,
};

const actions = {
  async UpdateApiStore({ commit },options) {
  	var api = {};
  	api[options.pathKey] = options.data;
  	commit('setApiStore',api);
  },

};

const mutations = {
  setApiStore(state, api) {
  	for(var key in api){
		state.api[key] = api[key];
  	}
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
