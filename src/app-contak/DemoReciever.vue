<template>
  <div>
    <b-card v-if="deviceToken" header="Messages">
        <ul class="list-unstyled">
          <b-media tag="li" v-for="message in validMessages" v-bind:key="message.noteId" class="m-1">
            <template #aside>
              <b-img blank blank-color="#abc" width="64" alt="placeholder" class="mr-2"></b-img>
            </template>
            <h5 class="mt-0 mb-1">{{message.otp}}</h5>
            <p class="mb-0"><i class="bi bi-stopwatch"></i>
              {{message.domain}} : {{message.title}}
            </p>
            <b-progress 
              :value="message.life"
              height="3px" variant="blue"></b-progress>
          </b-media>
        </ul>
    </b-card>  
    <b-card v-else-if="otpPrefix && otpNounce" header="Sign Up - Verify">
        <base-input v-bind:key="`signup.otp`" :label="otpPrefix" v-model="otp" placeholder="Enter OTP" prelabel>
          <template #append>
              <span type="primary" @click="login" pointer >Verify</span>
          </template> 
        </base-input>
    </b-card>  
    <b-card v-else header="Sign Up - Enter Phone">
        <base-input v-bind:key="`signup.phone`" label="Phone No" v-model="phone" prelabel >
          <template #append>
              <span type="primary" @click="login" pointer >Send</span>
          </template>  
        </base-input>
    </b-card>
    <b-card>
<pre class="text-red" v-if="error">
{{error}}
</pre>  
      <pre>
  DeviceId : {{deviceId}}
  Phone : {{phone}}
  Nounce : {{otpNounce}}
  Prefix : {{otpPrefix}}
  DeviceToken : {{deviceToken}}
      </pre>  
    </b-card> 
  </div>
</template>
<script>
import BaseInput from '@/@common/argon/components/Inputs/BaseInput.vue';
import BaseButton from '../@common/argon/components/BaseButton.vue';
import ProfileApp from '../app-front/Index/ProfileApp.vue';
export default {
  data() {
    return {
      navbarOpen: false,
      deviceId : '', phone : '',
      domain : '', otp : '', title : '',
      otpPrefix : '', otpNounce : '',
      deviceToken : '',
      error : '',
      messages : []
    };
  },
  computed : {
    validMessages(){
      return this.messages.filter(function(message){
        let validty = message.expiredAt.stamp - message.createdAt.stamp;
        let expiry = message.expiredAt.stamp - Date.now();
        message.life = 100*(expiry/validty);
        return message.life > 0;
      });
    }
  },
  mounted(){
      this.$global.Event.fp(async (fp) => {
          this.deviceId = fp;
          await this.reloadCreds();
          await this.login();
          await this.fetchMessage();
      });
  },
  methods: {
    reloadCreds(){
      this.phone = this.$store.getters.local?.notp?.phone;
      this.deviceToken = this.$service.localStorage.get('deviceToken');
    },
    async login(){
        if(!this.phone) return;
        this.$service.store('notp','phone',this.phone);
        this.error = null;
        try {
            let {meta,results} = await this.$service.post('/notp/api/v1/login',{
                deviceId : this.deviceId, phone : this.phone,
                deviceToken : this.deviceToken,
                otpNounce :  this.otpNounce,
                otp : this.otp, title : this.title
              });
              console.log("meta==",meta)
              if(meta.otpPrefix && meta.otpNounce){
                this.otpPrefix = meta.otpPrefix;
                this.otpNounce = meta.otpNounce;
              } else if(meta.deviceToken){
                this.$service.localStorage.set('deviceToken',meta.deviceToken);
                this.reloadCreds();
                this.fetchMessage();
              }
        } catch(e){
          this.error = `${e.response.data.status} ${e.response.data.statusKey}`;
        }
    },
    async fetchMessage(){
      this.reloadCreds();
      if(!this.deviceToken) return;
      let {meta,results} = await this.$service.post('/notp/api/v1/messages/fetch',{
        deviceId : this.deviceId, phone : this.phone,
        deviceToken : this.deviceToken
      });
      this.messages = [...this.messages, ...results];
      setTimeout(()=>this.fetchMessage(),300)
    }
  },
  components: {
    BaseInput,
    BaseButton,
    ProfileApp
  },
};
</script>
