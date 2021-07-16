import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default {
  options : {},
  route : function (options) {
      console.log(1,options,window.CONST.APP);
      if(options.app == window.CONST.APP){
        this.options = options;
      }
  },
  router : function (){
    console.log(2,this.options,window.CONST.APP);
    return new Router({
        mode: 'history',
        base : this.options.base,
        scrollBehavior() {
            return window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        routes: this.options.routes
    });
  }  
} 
