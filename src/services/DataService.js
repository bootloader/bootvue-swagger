
import Vue from 'vue';
import store from './../store';

import axios from "axios";

import DataProcessor from "./DataProcessor";
import { i18n } from "./i18n";
import formatter from "./formatters";
import tunnel from './/tunnel';
import storage from 'local-storage-fallback';
import jskeeper from '@/services/jskeeper';

let myRespInterceptor = axios.interceptors.response.use(
  function(response) {
    let config = response.config;
  	if(response.request.responseURL.endsWith("/auth/login")){
  	  //https://app.mehery.com/admin/auth/login
      var nextURL = new URL(response.request.responseURL);
      nextURL.searchParams.append("referer",encodeURIComponent(window.location.href))
      window.location.reload();
  	  //window.location.href = nextURL.toString();
  	}

    if(config.toast!==false && response.data && response.data.message){
      //Vue.toaster.success(response.data.message);
      if(Vue.$toast && Vue.$toast.success)
        Vue.$toast.success(response.data.message)
    }
    //console.log("myRespInterceptor:success")
    return response;
  }, 
  function(error,s) {
    let response  = error.response;
    let config = error.config;
    if(config.toast!==false && response.data && response.data.message){
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

function processor(params,responseData,config) {
  var dataType = config?.dataType || params?._processor;
  if(dataType && DataProcessor[dataType]){
    if(responseData.data){
      responseData.data = DataProcessor[dataType](responseData.data);
    }
    if(responseData.results){
      for(var i in responseData.results){
        responseData.results[i] = DataProcessor[dataType](responseData.results[i]);
      }
    }
  }
  var metaType = config?.metaType;
  if(metaType && DataProcessor[metaType]){
    if(responseData.meta){
      responseData.meta = DataProcessor[metaType](responseData.meta);
    }
    if(responseData.details){
      for(var i in responseData.details){
        responseData.details[i] = DataProcessor[metaType](responseData.details[i]);
      }
    }
  }
  return responseData;
}

function slashUrl(url){
  return formatter.clean_url(url);
  return url.replace(/\/\/+/g, '/');
}


const DataService = {
  async dispatch (a,b,c) {
  	return store.dispatch(a,b,c);
  },

  _GET_X : {},
  async setX(url,responseData,query,config) {
    url = slashUrl(url);
    var pathKey = path2key(url);
    let _config = config || {};
    let results = responseData.results ? responseData.results : responseData;
    if(url.indexOf('/api/') == 0 || url.indexOf('api/') == 0){
      console.log("submitX",pathKey,results, responseData)
      await store.dispatch('UPDATE_API_STORE',{ pathKey : pathKey, data : results });
    } else {
      await store.dispatch('UPDATE_REST_STORE',{ pathKey : pathKey, data : results });
    }
    return results;
  },
  async get(url,query,config) {
    let urls = url.split("#");
    url = slashUrl(urls[0]);
    let _config = config || {};
    _config.params = query;
    let response = null;
    if(_config.first){
      response  = await jskeeper.first(function(){
        return axios.get(url,_config);
      }, "getfirst:" + _config.first);
    } else {
      response = await axios.get(url,_config);
    }
    return processor(query,response.data,_config);
  },
  async getX(url,query,config) {
    let urls = url.split("#");
    url = slashUrl(urls[0]);
    var pathKey = path2key(url);
    let _config = config || {};

    if(this._GET_X[pathKey]){
      await this._GET_X[pathKey];
    }

    if(store.getters.StateApi[pathKey] && !_config.refresh){
      return store.getters.StateApi[pathKey];
    }

    let proms = axios.get(url,{ params : query });
    this._GET_X[pathKey] = proms;
    let response = await proms;
    delete this._GET_X[pathKey];
    let responseData = processor(query,response.data,_config);
    let results = responseData.results ? responseData.results : responseData;
    if(url.indexOf('/api/') == 0 || url.indexOf('api/') == 0){
      console.log("getX",pathKey,results, response.data)
      store.dispatch('UPDATE_API_STORE',{ pathKey : pathKey, data : results,target : urls[1]});
    } else {
      store.dispatch('UPDATE_REST_STORE',{ pathKey : pathKey, data : results, target : urls[1] });
    }
    return results;
  },
  async post(url,params,config) {
    url = slashUrl(url);
    let _config = config || {};
    let response = await axios.post(url, params,_config);
    return processor(params,response.data,_config);
  },
  async put(url,params,config) {
    url = slashUrl(url);
    let _config = config || {};
    let response = await axios.put(url, params,_config);
    return processor(params,response.data,_config);
  },
  async patch(url,params,config) {
    url = slashUrl(url);
    let _config = config || {};
    let response = await axios.patch(url, params,_config);
    return processor(params,response.data,_config);
  },
  async submit(url,params,config) {
    url = slashUrl(url);
    let _config = config || {};
    let SubmitForm = new URLSearchParams();
    for (var key in params) {
        if((params[key] !== null) && (params[key] !== undefined)){
          SubmitForm.append(key, params[key]);
        }
    }
    try{
      let response = null;
      if(_config.put){
        response = await axios.put(url, SubmitForm,_config);
      } else {
        response = await axios.post(url, SubmitForm,_config);
      }
      return processor(params,response.data,_config);
    } catch(e){
        if(_config && _config.ref && typeof _config.ref.setErrors == 'function'){
          _config.ref.setErrors(e.response.data.veeErrors);
        }
        return Promise.reject(e);
    }
  },
  async submitX(url,params,config) {
    url = slashUrl(url);
    var pathKey = path2key(url);
    let _config = config || {};
    let responseData = await this.submit(url,params,_config);
    let results = responseData.results ? responseData.results : responseData;
    if(url.indexOf('/api/') == 0 || url.indexOf('api/') == 0){
      console.log("submitX",pathKey,results, responseData)
      store.dispatch('UPDATE_API_STORE',{ pathKey : pathKey, data : results });
    }
    return results;
  },
  async delete(url,query,config) {
    url = slashUrl(url);
    let _config = config || {};
    _config.params = query;
    //_config.data = query;
    let response = await axios.delete(url,_config);
    return processor(query,response.data,_config);
  },
  async deleteX(url,query,config) {
    url = slashUrl(url);
    var pathKey = path2key(url);
    let _config = config || {};

    let responseData = await this.delete(url,query,_config);
    let results = responseData.results ? responseData.results : responseData;
    if(url.indexOf('/api/') == 0 || url.indexOf('api/') == 0){
      console.log("deleteX",pathKey,results, responseData)
      store.dispatch('UPDATE_API_STORE',{ pathKey : pathKey, data : results });
    }
    return results;
  },
  config (argument) {
    switch (argument) {
      case "DISABLE_RESPONSE_INTERCEPTOR" :
        axios.interceptors.response.eject(myRespInterceptor);
        break;
    };
  },
  async store( namespace,key,item){
    store.dispatch('UpdateLocalStore',{ namespace : namespace, key : key, data : item })
  },
  async local(){
    store.dispatch('UpdateLocalStore',{ 
      namespace : arguments.length > 2 ? arguments[0] : 'default', 
      key : arguments.length > 2 ? arguments[1] : arguments[0], 
      data : arguments.length > 2 ? arguments[2] : arguments[1]
   });
  },
  localStorage : {
    get(key){
      return JSON.parse(storage.getItem('service.storage.'+key) || '{}').value;
    },
    set(key,value){
      storage.setItem('service.storage.'+key,JSON.stringify({
        value : value
      }));
    }
  }
};

Vue.prototype.$service = DataService;
Vue.prototype.$tunnel = tunnel;

export default  DataService
