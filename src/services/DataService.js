
import Vue from 'vue';
import store from './../store';

import axios from "axios";


axios.interceptors.response.use(
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
    return response;
  }, 
  function(error) {
    return Promise.reject(error);
  }
);

const DataService = {
  async dispatch (a,b,c) {
  	return store.dispatch(a,b,c);
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
};

Vue.prototype.$service = DataService;

export default  DataService