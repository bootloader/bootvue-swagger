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
      console.log("subrouter:beforeEach------->:" ,from,to.matched,to);
      next();
    };

    options.accessDenied = options.accessDenied || function(to, from, next){
      console.log("subrouter:accessDenied------->:" ,from,to.matched,to);
      next(false);
    };

    options.matchNotFound = options.matchNotFound || function(to, from, next){
      console.log("subrouter:matchNotFound------->:" ,from,to.matched);
      next();
    };


    router.beforeEach((to, from, next) => {
      console.log("router:beforeEach------->:" ,from,to.matched);
      if(!to.matched || to.matched.length == 0){
        console.log("router:matchNotFound------->:" ,from,to.matched,to);
        options.matchNotFound(to, from, next)
      } else if(!to.matched.some(function (record) {
        if(!record.meta || !window.CONST.APP_USER_ROLE) return true;
        let APP_USER_ROLE = Array.isArray(window.CONST.APP_USER_ROLE) ? window.CONST.APP_USER_ROLE : [window.CONST.APP_USER_ROLE];
        let role = Array.isArray(record.meta.role) ? (record.meta.role || []) : [record.meta.role];
        console.log("Required",role , "Assigned",APP_USER_ROLE)
        if(!role.length || !role[0]){
          return true;
        }
        for(var r in role){
          if(role[r] && APP_USER_ROLE.indexOf(role[r]) > -1){
            return true
          }
        }
        console.log("router:noRoleFound------->:" ,from,to.matched,to);
        return false;
      })){
        console.log("router:accessDenied------->:" ,from,to.matched,to);
        options.accessDenied(to, from, next);
      } else {
        console.log("router:beforeEach------->:",from,to.matched,to)
        options.beforeEach(to, from, next);
      }
      
    });

    return router;
  }  
} 
