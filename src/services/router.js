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

    options.beforeEachFail = options.beforeEachFail || function(to, from, next){
      next(false);
    };

    router.beforeEach((to, from, next) => {
      if(to.matched.some(function (record) {
        if(!record.meta) return true;
        if(record.meta.role && record.meta.role.indexOf(window.CONST.APP_USER_ROLE) < 0){
          return false
        }
        return true;
      })){
        console.log("NextDone")
        options.beforeEach(to, from, next);
      } else {
        console.log("NextFailed")
        options.beforeEachFail(to, from, next);
      }
      
    });

    return router;
  }  
} 
