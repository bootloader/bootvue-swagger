<template>
	<div class="container d-flex justify-content-center align-items-center">
		<div class="card text-center">
      <ValidationObserver ref="form" class="template-form"  v-slot="{handleSubmit}">
			<div class="card-header p-2">
        <div class="text-center">
          <div class="flex-font-wrapper-25">
              <div class="flex-font-container text-whatsapp" :class="{
                      'flex-font-busy' : is_module_busy
              }">
                <span class="fa-stack fa-3x flex-font">
                  <i class="fas fa-circle fa-stack-2x"></i>
                  <i class="fa fa-whatsapp fa-stack-1x fa-inverse"></i>
                </span>
              </div>  
          </div>
				  <h5 class="mb-2">WhatsApp Verification</h5>
          <h6 class="mb-2 text-xs">via otpless</h6>
        </div> 
			</div>
      </ValidationObserver>
		</div>
	</div>
</template>
<script>
import mixin from '../mixin.js'
export default {
    mixins : [mixin],
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
    this.module_busy(true);
    window.otpless = (otplessUser) => {
      this.otplessUser = otplessUser;
      this.verify();
    };
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
      } finally{
         this.module_busy(true);
      }
    },
  },
  components: {
  },
};
</script>
<style lang="scss">
</style>
