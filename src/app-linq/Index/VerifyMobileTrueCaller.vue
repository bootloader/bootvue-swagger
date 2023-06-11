<template>
	<div class="container d-flex justify-content-center align-items-center">
		<div class="card text-center">
      <ValidationObserver ref="form" class="template-form"  v-slot="{handleSubmit}">
			<div class="card-header p-2">
        <div class="text-center">
          <div class="flex-font-wrapper-25">
              <div class="flex-font-container text-truecaller">
                <span class="fa-stack fa-3x flex-font">
                  <i class="fa-solid fa-circle fa-stack-2x"></i>
                  <i class="fa fa-phone fa-stack-1x fa-inverse"></i>
                </span>
              </div>  
          </div>
				  <h5 class="mb-2">Mobile Verification</h5>
          <h6 class="mb-2 text-xs">via TrueCaller</h6>
        </div>
			</div>
      </ValidationObserver>
      <form ref="idTokenForm" :action="redirectUrl" method="POST">
        <input name="idToken" v-model="idToken">
      </form>
		</div>
	</div>
</template>
<script>

import mixin from '../mixin.js'

export default {
  mixins : [mixin],
  data() {
    return {
      mobileImage : __webpack_public_path__ + '/_common/static/phoneverify/mobile.png',
      mobileAccepted : false,
      otpNumber : '',
      idToken : '',
      confirmationResult : null,
      recaptchaVerifier  : null,
      canEnterNumber : false,
      firebaseInitd : false,
      showCaptcha : true,
    };
  },
  mounted : function () {
        this.load();
  },
  created (){
  },
  watch : {
  },
  computed : {
    redirectUrl(){
      return  this.$route.query.redirect_uri;
    }
  },
  methods : {
    async goToFallback(reason){
      console.log("goToFallback",reason);
      let query = { ...this.$route.query, from: 'truecaller'};
      this.$router.push({ name : "fireBasePage",query: query});
    },
    async load(){
        try{
          if(!this.$global.isMobile) throw "ThisIsBrowser"; 
          let truecaller_url = `truecallersdk://truesdk/web_verify?_=_`
                              + `&requestNonce=${this.$route.query.nonce}`
                              +  `&partnerKey=${window.CONST.TCENV.truecaller.appKey}`
                              +  `&partnerName=${window.CONST.TCENV.truecaller.appName}`
                              + `&lang=en&title=TITLE_STRING_OPTION`;
          console.log('truecaller_url',truecaller_url);
          const handleDeepLinkFailure = () => {
              console.log("visibilitychange:hidden",document.hidden)
              document.removeEventListener('visibilitychange', handleDeepLinkFailure);
              if (document.hidden) {
                this.waitTrueCallerWebhook(0);
              } else {
                this.goToFallback("TrueCaller:noHidden");
              }
          };
          document.addEventListener('visibilitychange', handleDeepLinkFailure);
          this.open_deeplink(truecaller_url, (url,isopen)=>{
            if(!isopen){
              //this.goToFallback("TrueCaller:UnLoad");
            }
          });
        } catch(e){
          this.goToFallback("TrueCaller:Unable");
        }
    },
    async waitTrueCallerWebhook(counter){ 
      return await this.$service.poll("/pub/v1/connect/truecaller/mobile/webhook",{},{
        maxAttempts : 10,
        feed : (pollResult)=>{
          console.log('TrueCaller:poll',pollResult.results,pollResult.meta,pollResult.redirectUrl);
          if(pollResult.redirectUrl){
              window.location.href = pollResult.redirectUrl;
              return false;
          }
          return true;
        }, stop : (pollResult)=>{
          this.goToFallback("TrueCaller:MaxAttempts");
        }
      });
    },
  },
  components: {
  },
};
</script>
<style lang="scss">
</style>
