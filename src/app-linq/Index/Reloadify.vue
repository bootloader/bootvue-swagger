<template>
	<div class="container d-flex justify-content-center align-items-center">
		<div class="card text-center" style="max-width:350px;min-width:40%;">
			<div class="card-header p-2">
        <div class="text-center">
          <div class="flex-font-wrapper">
              <div class="flex-font-container">
                <span class="fa-stack fa-3x flex-font">
                  <i class="fa fa-circle-o-notch fa-stack-2x fa-spin"></i>
                  <i class="fas fa-link fa-stack-1x"></i>
                </span>
              </div>  
          </div>
				  <h5 class="mb-2">...</h5>
          <h6 class="mb-2 text-xs">{{reloadDecoded}}</h6>
          <form ref="redirectForm" method="POST">
          </form>
        </div> 
			</div>
		</div>
	</div>
</template>
<script>
import mixin from '../mixin.js'

function isBase64(str) {
    if (str ==='' || str.trim() ===''){ return false; }
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}

export default {
    mixins : [mixin],
  props : {
    reload : {}
  },
  data() {
    return {
    };
  },
  mounted : function () {
    console.log("ReloadFiy:mounted")
    this.open(this.reloadDecoded);
  },
  created (){
    console.log("ReloadFiy:created")
  },
  watch : {
    '$route.params.reload' :  function(neval){
        console.log("ReloadFiy:reload",neval)
    }
  },
  computed : {
    reloadDecoded(){
      try{
        if(isBase64(this.$route.query.title)){
          return window.atob(this.$route.params.reload);
        }
      } finally {
        return this.$route.params.reload;
      }
    },
    titleDecoded(){
      try{
        if(isBase64(this.$route.query.title)){
          return window.atob(this.$route.query.title);
        }
      } finally {
        return this.$route.query.title;
      }
    }
  },
  methods : {
    open(targte_url){
      window.fullloader.busy(this.titleDecoded);
      let iframe = document.createElement('a');
      iframe.setAttribute('href', targte_url);
      this.$refs.redirectForm.appendChild(iframe);
      iframe.click();
    },
  },
  components: {
  },
};
</script>
<style lang="scss">
.flex-font-wrapper {
   font-size: 25px;
  .flex-font-container {
    .flex-font {
    }
    height : 12em;
    padding: 1em;
    line-height: 10em;
  }
}
</style>
