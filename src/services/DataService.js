
import Vue from 'vue';
import store from './../store';

import axios from "axios";


let myRespInterceptor = axios.interceptors.response.use(
  function(response) {
  	if(response.request.responseURL.endsWith("/auth/login")){
  	  //https://app.mehery.com/admin/auth/login
  	  console.log("===>",response.request.responseURL)
  	  window.location.href = response.request.responseURL;
  	}

    if(response.data && response.data.message){
      //Vue.toaster.success(response.data.message);
      console.log("===>",response.data.message)
      if(Vue.$toast && Vue.$toast.success)
        Vue.$toast.success(response.data.message)
    }
    //console.log("myRespInterceptor:success")
    return response;
  }, 
  function(error,s) {
    //console.log("myRespInterceptor:error",error.response,s);
    let response  = error.response;
    if(response.data && response.data.message){
      console.log("===>",response.data.message)
      if(Vue.$toast && Vue.$toast.error)
        Vue.$toast.error(response.data.message)
    }

    return Promise.reject(error);
  }
);

const DataService = {
  async dispatch (a,b,c) {
  	return store.dispatch(a,b,c);
  },

  async getX(url,query) {
    let response = await axios.get(url,{ params : query });
    if(url.indexOf('/api/') == 0){
      console.log("getX",response.data)
      store.dispatch('UpdateApiStore',{ path : url, data : response.data.results })
    }   
    return response.data;
  },

  async get(url,query) {
    let response = await axios.get(url,{ params : query });
    return response.data;
  },
  async post(url,params) {
    let response = await axios.post(url, params);
    return response.data;
  },
  async submit(url,params) {
    let SubmitForm = new FormData();
    for (var key in params) {
       SubmitForm.append(key, params[key]);
    }
    let response = await axios.post(url, SubmitForm);
    return response.data;
  },
  async delete(url,query) {
    let response = await axios.delete(url,{
      params : query,
      data : query
    });
    return response.data;
  },
  config (argument) {
    switch (argument) {
      case "DISABLE_RESPONSE_INTERCEPTOR" :
        axios.interceptors.response.eject(myRespInterceptor);
        break;
    };
  }
};

Vue.prototype.$service = DataService;

export default  DataService
