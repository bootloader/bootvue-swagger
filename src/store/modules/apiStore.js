//store/modules/auth.js

//import axios from "axios";

const state = {
	api : {
  }
};

const getters = {
	StateApi: (state) => state.api,
};

const actions = {
  async UPDATE_API_STORE({ commit },options) {
  	state.api[options.pathKey] = options.data;
  	commit('SET_API_STORE',state.api);
  },
};

const mutations = {
  SET_API_STORE(state, api) {
  	for(var key in api){
		  state.api[key] = api[key];
  	}
    state.api = Object.assign(state.api, api);
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
