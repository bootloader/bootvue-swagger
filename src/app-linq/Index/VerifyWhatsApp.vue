<template>
	<div class="container d-flex justify-content-center align-items-center">
		<div class="card text-center" style="max-width:350px;min-width:40%;height:500px">
      <ValidationObserver ref="form" class="template-form"  v-slot="{handleSubmit}">
			<div class="card-header p-2">
        <div class="text-center">
				  <img :src="mobileImage" class="d-inline" style="max-width:200px;"/>
				  <h5 class="mb-2">WhatsApp Verification</h5>
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
      }
    },
  },
  components: {
  },
};
</script>
<style lang="scss">
</style>
