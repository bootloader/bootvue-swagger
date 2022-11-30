<template>
  <div>
    <!-- Page content -->
    <b-container class="x-position-absolute">
      <!-- Table -->
      <b-row v-if="viewSignupForm"  class="justify-content-center">
        <b-col lg="6" md="8" >
          <b-card no-body class="bg-transparent border-0 " >
            <b-card-header class="px-lg-5 bg-transparent pb-2 d-none">
               <h2> Get started free </h2>
                <small> No credit card required</small>
            </b-card-header>
            <b-card-body class="px-lg-5 py-lg-2">
              <div class="text-muted mb-4">
               <h2> Get started free </h2>
                <small> No credit card required</small>
              </div>
              <div class="d-none">
                <div class="text-muted text-center mt-2 mb-4"><small>Sign up with</small></div>
                <div class="btn-wrapper text-center">
                  <a href="#" class="btn btn-neutral btn-icon">
                    <span class="btn-inner--icon"><img :src="$config.CDN_URL + '/argon/img/icons/common/github.svg'"></span>
                    <span class="btn-inner--text">Github</span>
                  </a>
                  <a href="#" class="btn btn-neutral btn-icon">
                    <span class="btn-inner--icon"><img :src="$config.CDN_URL +  '/argon/img/icons/common/google.svg'"></span>
                    <span class="btn-inner--text">Google</span>
                  </a>
                </div>
              </div>
              <div class="text-center text-muted mb-4 d-none">
                <small>Or sign up with credentials</small>
              </div>
              <validation-observer v-slot="{handleSubmit}" ref="signupContact">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input alternative question feedback
                              class="mb-3" 
                              label="Name" :name="$t('fields.name')" 
                              vid="signupContact.name"
                              :rules="{required: true}"  required
                              v-model="model.name">
                  </base-input>

                  <base-input alternative question feedback
                              class="mb-3"
                              :name="$t('fields.email')" 
                              vid="signupContact.email"
                              rules="required|emailz" required
                              :valid="true"
                              v-model="model.email">
                  </base-input>

                  <base-input alternative question feedback
                              class="mb-3"
                              :name="$t('fields.phone')" 
                              vid="signupContact.phone"
                              rules="required|phone" required
                              :valid="true"
                              v-model="model.phone">
                  </base-input>

                  <base-input alternative question feedback
                              class="mb-3"
                              :name="$t('fields.company')" 
                              vid="signupContact.company"
                              :rules="{required: true}"  required
                              v-model="model.company">
                  </base-input>

                <base-select alternative question feedback
                              class="mb-3"
                              :name="$t('fields.role')" 
                              vid="signupContact.role"
                              :rules="{required: true}"  required
                              v-model="model.role">
                  <option value="agency_partner_developer">Agency / Partner Developer</option>
                  <option value="professional_developer">Professional Developer</option>
                  <option value="technology_business_manager">Technology / Business Manager</option>
                  <option value="other">Other</option>
                </base-select>

                  <base-select  alternative question feedback
                        class="mb-3"
                        :name="$t('fields.country')" 
                        vid="signupContact.country"
                        :rules="{required: true}"  required
                        v-model="model.country"
                        options="data:countries">
                  </base-select>
                  
                  <b-row class=" my-4">
                    <b-col cols="12">
                      <base-input :rules="{ required: { allowFalse: false } }" name=Privacy Policy>
                        <b-form-checkbox v-model="model.agree">
                          <span class="text-muted">I agree with the <a target="_blank" href="https://www.mehery.com/privacy-policy/#page-content">Privacy Policy</a></span>
                        </b-form-checkbox>
                      </base-input>
                    </b-col>
                  </b-row>

                  <div class="text-center">
                    <b-button type="submit" variant="primary" class="mt-4">Create account</b-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>


      <!-- Register Done -->
      <b-row v-if="viewMailSent" class="justify-content-center">
        <b-col lg="6" md="8" >
          <b-card no-body class="bg-transparent border-0" >
            <b-card-header class="px-lg-5 bg-transparent pb-2 text-center ">
               <h2> Almost there … </h2>
                <small> Please check your email to confirm your account.</small>
            </b-card-header>
            <b-card-body class="px-lg-5 py-lg-4">
              
              <div class="text-center text-muted mb-4">
                <small>If {{model.email}} is not your email address, please go back and enter the correct one.</small>
              </div>
              
              <div class="text-center text-muted mb-4">
                <small>If you haven't received our email in 15 minutes, please check your spam folder.</small>
              </div>

            </b-card-body>
          </b-card>
        </b-col>
      </b-row>

    </b-container>
  </div>
</template>
<script>

  import "@fortawesome/fontawesome-free/css/all.css";
import BaseCheckbox from '../../@common/argon/components/Inputs/BaseCheckbox.vue';

  export default {
  components: { BaseCheckbox },
    name: 'register',
    data() {
      return {
        model: {
          name: '',
          email: '', phone : '',
          company: '', role: '',
          password: '',
          country: '',
          agree: false
        },
         products:[
          {label:"Web Chat",value:"web_chat",icon:"fas fa-globe-americas",checked:false},
          {label:"WhatsApp Chat",value:"whatsapp",icon:"fab fa-whatsapp",checked:false},
          {label:"Facebook Chat",value:"facebook",icon:"fab fa-facebook",checked:false},
          {label:"Twitter Chat",value:"twitter",icon:"fab fa-twitter",checked:false},
          {label:"Telegram Chat",value:"telegram",icon:"fab fa-telegram",checked:false},
          {label:"Instagram Chat",value:"instagram",icon:"fab fa-instagram",checked:false}
        ],
        view : {
          screen : null // NULL, MAILSENT
        }
      }
    },
    computed : {
      viewMailSent : function () {
          return this.view.screen == 'MAILSENT';
      },
      viewSignupForm : function () {
          return !this.view.screen;
      }
    },
    methods: {
      async onSubmit() {
        // this will be called only after form is valid. You can do an api call here to register users
        try {
          //this.model.email = "sds"
          let interestedProduct = this.products.filter(v=>v.checked);
            interestedProduct = interestedProduct.map(v=>v.value);
          let resp = await this.$service.post("/partner/pub/register",{...this.model,product:interestedProduct});
          console.log("resp",resp)
          this.view.screen = 'MAILSENT';
          // this.$router.push({ 
          //   name : "register-done",
          //   params : {email : this.model.email,name : this.model.name}
          // });
        } catch(e){
            console.log("error",e.response.data);
            this.$refs.signupContact.setErrors(e.response.data.veeErrors)
        }

      }
    }

  };
</script>
<style  lang="scss">





@-webkit-keyframes appear {
  100% {
    opacity: 1;
  }
}

@keyframes appear {
  100% {
    opacity: 1;
  }
}

</style>
