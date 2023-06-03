<template>
	<div class="container d-flex justify-content-center align-items-center">
		<div class="card text-center" style="max-width:350px;min-width:40%;">
      <ValidationObserver ref="form" class="template-form"  v-slot="{handleSubmit}">
			<div class="card-header p-2">
        <div class="text-center">
				  <img :src="mobileImage" class="d-inline" style="max-width:200px;"/>
				  <h5 class="mb-2">Mobile Verification</h5>
        </div> 
				<div class="mb-3">
              <div class="text-center">
                <span id="recaptcha-container" class="recaptcha-container d-inline-block" ref="recaptchaContainer">
                </span>
              </div>
              <span v-if="!mobileAccepted">
                <base-input @keydown="isNumber" :readonly="!canEnterNumber"
                    class="mt-1 d-block" prependClass="btn btn-outline-success" variant="outline-success"
                    prelabel name="Mobile" prependIcon="fas fa-phone pointer"
                    v-model="mobileNumber" 
                    rules="required|phone"  inputClasses="border-success" @commit="handleSubmit(commit)"
                    appendIcon="fas fa-arrow-right" appendClass="border-success btn btn-outline-success">
                </base-input>
                <div class="mt-3 mb-5">
                  <b-button variant="success" class="px-4 verify-btn"
                    :disabled="!canEnterNumber"
                    @click="handleSubmit(commit)">Send OTP</b-button>
                </div>
              </span>
               <span v-if="mobileAccepted">
                  <small>code has been send to {{mobileNumber}}</small>
                  <div class="mt-3 mb-5">
                  <b-button variant="outline-success" size="sm" class="px-4 verify-btn"
                     @click="mobileAccepted=false" >Change Number</b-button>
                  </div>
               </span> 
				</div>
			</div>
      <span v-if="mobileAccepted">
        <div class="input-container d-flex flex-row justify-content-center mt-2">
          <base-input  @keydown="isOTPLetter" label="OTP" placeholder="------" 
              class="mt-1 d-block" variant="outline-success"
              v-model="otpNumber"  inputClasses="text-center rounded otp-box"
              @commit="handleSubmit(commit)"
            />
        </div>
        <div class="">
          <small>
            Didn't get the otp? <span href="#" class="text-decoration-none btn btn-link" @click="commit" >Resend</span>
          </small>
        </div>
        <div class="mt-3 mb-5">
          <button class="btn btn-success px-4 verify-btn" :disabled="!isOTPValid" @click="verify">verify</button>
        </div>
      </span>
      </ValidationObserver>
      <form ref="idTokenForm" :action="redirectUrl" method="POST">
        <input name="idToken" v-model="idToken">
      </form>
		</div>
	</div>
</template>
<script>
import firebase from 'firebase/compat/app';
import { getAuth, getRedirectResult, OAuthProvider } from "firebase/auth";
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import SocialBoxes from "./SocialBoxes.vue";

firebase.initializeApp(window.CONST.FBENV.firebase);

export default {
  data() {
    return {
      mobileImage : __webpack_public_path__ + '/_common/static/phoneverify/mobile.png',
      mobileNumber : '+91',
      mobileAccepted : false,
      otpNumber : '',
      idToken : '',
      confirmationResult : null,
      recaptchaVerifier  : null,
      canEnterNumber : false,
      firebaseInitd : false
    };
  },
  mounted : function () {
        this.load();
  },
  created (){

  },
  watch : {
    mobileNumber (oldValue,newValue){
        if(this.mobileNumber == "" || this.mobileNumber == null || this.mobileNumber.indexOf("+")!=0){
          this.mobileNumber = "+91"
        }
    },
    otpNumber (newValue, oldValue){
        if(this.otpNumber && this.otpNumber.length>6){
          this.otpNumber = oldValue;
        }
    }
  },
  computed : {
    isOTPValid(){
      return this.otpNumber && this.otpNumber.length==6
    },
    canEdit(){
      return ['OWNER'].indexOf(this.membership.membershipType) > -1
    },
    redirectUrl(){
      return  this.$route.query.redirect_uri;
    }
  },
  methods : {
    async load(){
        try {
          //if(!this.ALWAYS_FALSE) return this.initFirebaseFlow();
          if(!this.$global.isMobile) throw "ThisIsBrowser"; 
          let truecaller_url = `truecallersdk://truesdk/web_verify?_=_`
                              + `&requestNonce=${this.$route.query.nonce}`
                              +  `&partnerKey=${window.CONST.TCENV.truecaller.appKey}`
                              +  `&partnerName=${window.CONST.TCENV.truecaller.appName}`
                              + `&lang=en&title=TITLE_STRING_OPTION`;
          console.log('truecaller_url',truecaller_url)
          setTimeout(()=>{
              this.waitTrueCallerWebhook(0);
          }, 600);
           window.open(truecaller_url,"_blank");
        } catch(e){
          console.log("TrueCaller:Unable",e);
          this.initFirebaseFlow();
        }
    },
    async waitTrueCallerWebhook(counter){ 
        try {
            if(counter > 9) throw "RetryLimitExceeded:5";
            let pollResult =  await this.$service.get("/pub/v1/connect/truecaller/mobile/webhook");
            console.log('TrueCaller:poll',pollResult.results,pollResult.meta,pollResult.redirectUrl);
            if(pollResult.redirectUrl){
                  window.location.href = pollResult.redirectUrl;
            }
            setTimeout(()=>{
                this.waitTrueCallerWebhook(++counter);
            },3000)
        } catch(e){
          this.initFirebaseFlow();
        }
    },
    async commit(){
      this.mobileAccepted =  true;
      this.sendOTP();
    },
    async verify(){
      this.verifyOTP();
    },
    isNumber(evt){
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (evt.shiftKey || ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46)) {
          evt.preventDefault();;
        } else {
          return true;
        }
    },
    isOTPLetter(evt){
      return this.isNumber(evt);
    },
    async sendOTP(){
        try {
          let confirmationResult = await firebase.auth().signInWithPhoneNumber(this.mobileNumber, this.recaptchaVerifier);
          this.confirmationResult = confirmationResult;
        } catch(e){
            console.log("sendOTP :  FAIELD",e)
            this.recaptchaVerifier.render().then(function(widgetId) {
              grecaptcha.reset(widgetId);
            });
        }
    },
    async verifyOTP(){
      try {
          let result =  await this.confirmationResult.confirm(this.otpNumber);
          console.log("Login Done",result)
          let idToken = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
          let profileSubmit = await this.$service.submit("/app/v1/connect/mobile/callback",{
            idToken : idToken
          },{ put : true });
          if(profileSubmit.redirectUrl){
            window.location.href = profileSubmit.redirectUrl;
          }
      } catch(e){
          console.log("verifyOTP :  FAIELD",e)
      }
    },
    /**
     * 
     * 
     * Firebase login
     * 
     * 
     * 
     */
    async initFirebaseFlow(){
      if(this.firebaseInitd) return;
      return this.loadFirebase();
    },
    async loadFirebase(){
        this.firebaseInitd = true;
        firebase.auth().useDeviceLanguage();
        console.log("loadFireBase", this.$refs.recaptchaContainer)
        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(this.$refs.recaptchaContainer, {
          'size': '300px',
          'callback': (response) => {
            console.log("CaptchaSolved",response )
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            this.canEnterNumber = true;
            //onSignInSubmit();
          }
        });
        await this.recaptchaVerifier.render();
          return;
        firebase.auth().settings.appVerificationDisabledForTesting = true;
        var phoneNumber = "+16505554567";
        var testVerificationCode = "123456";
        // This will render a fake reCAPTCHA as appVerificationDisabledForTesting is true.
        // This will resolve after rendering without app verification.
        this.appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        // signInWithPhoneNumber will call appVerifier.verify() which will resolve with a fake
        // reCAPTCHA response.

    },
    
  },
  components: {
    SocialBoxes
  },
};
</script>
<style lang="scss">
  .otp-box {
    margin: 5px 20px !important;
    letter-spacing: 19px !important;
    padding-left: 27px !important;
  }
</style>
