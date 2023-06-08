<template>
	<div class="container d-flex justify-content-center align-items-center">
		<div class="card text-center" style="max-width:350px;min-width:40%;">
      <ValidationObserver ref="form" class="template-form"  v-slot="{handleSubmit}">
			<div class="card-header p-2">
        <div class="text-center">
          <div class="flex-font-wrapper">
              <div class="flex-font-container text-truecaller'">
                <span class="fa-stack fa-3x flex-font">
                  <i class="fa-solid fa-circle fa-stack-2x"></i>
                  <i class="fa fa-phone fa-stack-1x fa-inverse"></i>
                </span>
              </div>  
          </div>
				  <h5 class="mb-2">Mobile Verification</h5>
          <h6 class="mb-2 text-xs">via TrueCaller</h6>
        </div> 
				<div class="mb-3">
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
    async goToFallback(){
      let query = { ...this.$route.query, from: 'truecaller'};
      this.$router.push({ name : "fireBasePage",query: query});
    },
    async load(){
        try{
          console.log("MOBILE_VERIFICATION:TRUECALLER")
          if(!this.$global.isMobile) throw "ThisIsBrowser"; 
          let truecaller_url = `truecallersdk://truesdk/web_verify?_=_`
                              + `&requestNonce=${this.$route.query.nonce}`
                              +  `&partnerKey=${window.CONST.TCENV.truecaller.appKey}`
                              +  `&partnerName=${window.CONST.TCENV.truecaller.appName}`
                              + `&lang=en&title=TITLE_STRING_OPTION`;
          console.log('truecaller_url',truecaller_url);

          const handleDeepLinkFailure = () => {
            console.log("visibilitychange")
            // Remove the event listener
            document.removeEventListener('visibilitychange', handleDeepLinkFailure);
            // Check if the page is visible
             console.log("visibilitychange:hidden",document.hidden)
            if (!document.hidden) {
              // Handle the deep link failure here
              // You can display an error message or provide an alternative action
              this.goToFallback();
            } else {
              this.waitTrueCallerWebhook(0);
            }
          };
          // Add an event listener to handle deep link failure
          document.addEventListener('visibilitychange', handleDeepLinkFailure);
          // setTimeout(()=>{
          //    if(!document.hasFocus())  this.waitTrueCallerWebhook(0);
          //    else this.initFirebaseFlow();
          // }, 600);
          //this.reloadUrl(truecaller_url);
          let recaptchaScript = document.createElement('iframe')
          recaptchaScript.setAttribute('src', truecaller_url)
          this.$refs.idTokenForm.appendChild(recaptchaScript);
          window.open(truecaller_url,"_blank");
           window.open(truecaller_url);

        } catch(e){
          console.log("TrueCaller:Unable",e);
          this.goToFallback();
        }
    },
    async waitTrueCallerWebhook(counter){ 
        try {
            if(counter > 5) throw "RetryLimitExceeded:5";
            let pollResult =  await this.$service.get("/pub/v1/connect/truecaller/mobile/webhook");
            console.log('TrueCaller:poll',pollResult.results,pollResult.meta,pollResult.redirectUrl);
            if(pollResult.redirectUrl){
                window.location.href = pollResult.redirectUrl;
            }
            setTimeout(()=>{
                this.waitTrueCallerWebhook(++counter);
            },3000)
        } catch(e){
          this.goToFallback();
        }
    },
  },
  components: {
  },
};
</script>
<style lang="scss">
  .otp-box {
    margin: 5px 20px !important;
    letter-spacing: 19px !important;
    padding-left: 27px !important;
  }

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
