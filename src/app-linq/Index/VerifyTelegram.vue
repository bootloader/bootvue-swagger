<template>
	<div class="container d-flex justify-content-center align-items-center">
		<div class="card text-center">
      <ValidationObserver ref="form" class="template-form"  v-slot="{handleSubmit}">
			<div class="card-header p-2">
        <div class="text-center">
          <div class="flex-font-wrapper-25">
              <div class="flex-font-container text-telegram">
                <span class="fa-stack fa-3x flex-font">
                  <i class="fa fa-telegram fa-stack-2x"></i>
                  <i class="fa fa-phone-x fa-stack-1x fa-inverse"></i>
                </span>
              </div>  
          </div>
				  <h5 class="mb-2">Telegram Verification</h5>
          <h6 class="mb-2 text-xs">via telegram</h6>
        </div>
        <div class="mb-3 text-center">
            <!-- <script async src="https://telegram.org/js/telegram-widget.js?22"
              data-telegram-login="TrueLinQBot" data-size="large"
              data-auth-url="https://app.truelinq.com/linq/app/v1/connect/telegram/callback" 
              data-request-access="write"></script> -->
              <vue-telegram-login class="d-inline-block"
                  mode="redirect"  request-access="write"
                  telegram-login="TrueLinQBot"
                  :redirect-url="redirectUrl" />
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
import {vueTelegramLogin} from 'vue-telegram-login'

export default {
  data() {
    return {
      mobileImage : __webpack_public_path__ + '/_common/static/phoneverify/whatsapp.png',
      mobileNumber : '+91',
      mobileAccepted : false,
      otpNumber : '',
      idToken : '',
      confirmationResult : null,
      recaptchaVerifier  : null,
      canEnterNumber : false,
      otplessUser : {}
    };
  },
  mounted : function () {
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
    async verify(){
      try {
          let profileSubmit = await this.$service.submit("/app/v1/connect/whatsapp/callback",{
            credential : btoa(JSON.stringify(this.otplessUser))
          },{ put : true });
          if(profileSubmit.redirectUrl){
            window.location.href = profileSubmit.redirectUrl;
          }
      } catch(e){
          console.log("verifyOTP :  FAIELD",e)
      }
    },
  },
  components: {vueTelegramLogin},
};
</script>
<style lang="scss">
</style>
