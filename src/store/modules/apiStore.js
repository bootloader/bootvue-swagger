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
  	var path = options.path.replace(/\/$/, "").replace(/^\//,'').replace(/^api\//,'').split(/[\/\_]/).map(function(string) {
  		return string.charAt(0).toUpperCase() + string.slice(1);
  	}).join("");
  	var api = {};
  	api[path] = options.data;
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
