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
    let router =  new Router({
        mode: 'history',
        base : this.options.base,
        scrollBehavior : this.options.scrollBehavior || function() {
            return window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        routes: this.options.routes
    });

    var options = this.options;
    options.beforeEach = options.beforeEach || function(to, from, next){
      next();
    };

    router.beforeEach((to, from, next) => {
      if(to.matched.some(function (record) {
        if(!record.meta) return true;
        if(record.meta.role && record.meta.role.indexOf(window.CONST.APP_USER_ROLE) < 0){
          return false
        }
        return true;
      })){
        options.beforeEach(to, from, next);
      } else {
        next(false);
      }
      
    });

    return router;
  }  
} 
