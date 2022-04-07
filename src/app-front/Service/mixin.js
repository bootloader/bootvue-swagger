
  import Vue from 'vue';

  export default {
    init : function(){
      Vue.mixin({
        computed: {
          front_domain : function () {
            return this.$route.query.domain || this.$route.params.domain || this.$global.MyConst.tenant
          }
        }
      });
    }
  };