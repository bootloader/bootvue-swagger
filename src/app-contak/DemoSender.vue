<template>
  <div>
    <b-card header="Sender Panel">
      <base-input label="From" v-model="domain" layout="flushed" prelabel />
      <base-input label="APIKey" v-model="apiKey" prelabel/>
      <base-input label="To" :value="phone" readonly prelabel>
          <template #append>
              <span type="primary" @click="refresh" pointer >Refresh</span>
          </template> 
      </base-input>
      <base-input label="Title" v-model="title" prelabel/>
      <base-input label="Validity" v-model="validity" prelabel append="seconds"/>
      <base-input label="OTP" v-model="otp" prelabel>
          <template #append>
              <span type="primary" @click="send" pointer >Send</span>
          </template> 
      </base-input>
    </b-card>  
  </div>
</template>
<script>
import BaseInput from '@/@common/argon/components/Inputs/BaseInput.vue';
import BaseButton from '../@common/argon/components/BaseButton.vue';
export default {
  data() {
    return {
      domain : 'demo', otp : '', title : 'Login', apiKey : '*****************',validity : 60, otp : 321654
    };
  },
  computed : {
    phone (){
      return this.$store.getters.local.notp?.phone;
    }
  },
  mounted(){
  },
  methods: {
    async send(){
      this.$service.post('/notp/api/v1/messages/send',{
        domain : this.domain,apiKey : this.apiKey,
        phone : this.phone,
        otp : this.otp, title : this.title, validity : this.validity
      })
    },
    refresh(){
       this.$store.getters.local?.notp?.phone;
    }
  },
  components: {
    BaseInput,
    BaseButton
  },
};
</script>
