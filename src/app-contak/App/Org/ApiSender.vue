<template>
  <div>
    <b-card header="Reset Key" class="styler-20-80">
      <base-input variant="outline-oa-blue" label="From" v-model="domain" layout="flushed" prelabel />
      <base-input variant="outline-oa-blue" label="APIKey" v-model="apiKey" prelabel copy reset>
            <template #actions>
               <b-button class="w-20" @click="resetCDN"
                  variant="outline-oa-blue">
                  Reset</b-button>
          </template> 
      </base-input>
      <base-input variant="outline-oa-blue" label="To" :value="phone" readonly prelabel>
          <template #append>
              <span type="primary" @click="refresh" pointer >Refresh</span>
          </template> 
      </base-input>
      <base-input variant="outline-oa-blue" label="Title" v-model="title" prelabel/>
      <base-input variant="outline-oa-blue" label="Validity" v-model="validity" prelabel append="seconds"/>
      <base-input variant="outline-oa-blue" label="OTP" v-model="otp" prelabel>
          <template #append>
              <span type="primary" @click="send" pointer >Send</span>
          </template> 
      </base-input>
    </b-card>  
  </div>
</template>
<script>
import BaseInput from '@/@common/argon/components/Inputs/BaseInput.vue';
import BaseButton from '@/@common/argon/components/BaseButton.vue';
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
