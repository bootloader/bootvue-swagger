
import Vue from 'vue';
import store from './../store';

import axios from "axios";

import DataProcessor from "./DataProcessor";
import { i18n } from "./i18n";


let myRespInterceptor = axios.interceptors.response.use(
  function(response) {
  	if(response.request.responseURL.endsWith("/auth/login")){
  	  //https://app.mehery.com/admin/auth/login
  	  console.log("===>",response.request.responseURL)
      var nextURL = new URL(response.request.responseURL);
      nextURL.searchParams.append("referer",encodeURIComponent(window.location.href))
  	  window.location.href = nextURL.toString();
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
    if(error.response.data.errors){
      error.response.data.veeErrors = error.response.data.errors.reduce(function(previousValue, currentValue){
        let path = [];
        if(currentValue.obzect) path.push(currentValue.obzect);
        if(currentValue.field) path.push(currentValue.field);
        let _path = path.join(".");
        let _field_key = "fields."+_path;
        let _field_ = i18n.t("fields."+_path);
        _field_ = (_field_ == _field_key) ? i18n.t("fields." + currentValue.field) : _field_;

        let _keys = [
          "errors." + currentValue.codeKey, 
          "errors." + currentValue.code, 
          "errors." + currentValue.description,
          currentValue.codeKey,
          currentValue.code,
          currentValue.description];
        
        let _message;
        for(var i in _keys){
          if(_keys[i]){
            _message = i18n.t(_keys[i],{
              ...currentValue,
              _field_ : _field_
            });
            //console.log("_message",_message)
            if(_message!= _keys[i]){
              break;
            }
          }
        }
        previousValue[_path] = _message;
        return previousValue;
      },{});
    }
    return Promise.reject(error);
  }
);

function path2key(path) {
  return path.replace(/\/$/, "").replace(/^\//,'').replace(/^api\//,'').split(/[\/\_]/).map(function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }).join("")
}

function processor(params,responseData) {
  var _processor = params?._processor;
  if(_processor && DataProcessor[_processor]){
    if(responseData.results){
      for(var i in responseData.results){
        responseData.results[i] = DataProcessor[_processor](responseData.results[i]);
      }
    }
  }
  return responseData;
}


const DataService = {
  async dispatch (a,b,c) {
  	return store.dispatch(a,b,c);
  },

  async getX(url,query) {
    var pathKey = path2key(url);
    if(store.getters.StateApi[pathKey]){
      return store.getters.StateApi[pathKey];
    }
    let response = await axios.get(url,{ params : query });
    
    let responseData = processor(query,response.data);
    if(url.indexOf('/api/') == 0){
      console.log("getX",response.data)
      store.dispatch('UpdateApiStore',{ pathKey : pathKey, data : responseData.results })
    }   
    return responseData;
  },

  async get(url,query) {
    let response = await axios.get(url,{ params : query });
    return processor(query,response.data);
  },
  async post(url,params) {
    let response = await axios.post(url, params);
    return processor(params,response.data);
  },
  async submit(url,params) {
    let SubmitForm = new FormData();
    for (var key in params) {
       SubmitForm.append(key, params[key]);
    }
    let response = await axios.post(url, SubmitForm);
    return processor(params,response.data);
  },
  async delete(url,query) {
    let response = await axios.delete(url,{
      params : query,
      data : query
    });
    return processor(query,response.data);
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
