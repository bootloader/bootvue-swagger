<template>
  <div>
    <!-- Page content -->
    <b-container v-if="viewResetForm" class="x-position-absolute">
      <!-- Table -->
      <b-row class="justify-content-center">
        <b-col lg="6" md="8" >
          <b-card no-body class="bg-secondary border-0">
            <b-card-header class="bg-transparent pb-5 d-none">
              <div class="text-muted text-center mt-2 mb-4"><small>Sign up with</small></div>
              <div class="text-center">
                <a href="#" class="btn btn-neutral btn-icon mr-4">
                  <span class="btn-inner--icon"><img src="/argon/img//icons/common/github.svg"></span>
                  <span class="btn-inner--text">Github</span>
                </a>
                <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"><img src="/argon/img//icons/common/google.svg"></span>
                  <span class="btn-inner--text">Google</span>
                </a>
              </div>
            </b-card-header>
            <b-card-body class="px-lg-5 py-lg-2">
              <div class="text-muted mb-4">
                <h2> Forgot your password? </h2>
                <small> No worry, we will send password reset link on your registered email.</small>
              </div>
              <div class="text-center text-muted mb-4 d-none">
                <small>Or sign up with credentials</small>
              </div>
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input alternative question feedback
                              class="mb-3" 
                              label="Email"
                              name="Email"
                              :rules="{required: true, email: true}" required
                              v-model="model.email">
                  </base-input>                  
                  
                  <div class="text-center">
                    <b-button type="submit" variant="primary" class="mt-4">Send Reset Link</b-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>

      <!-- Reset Done -->
      <b-row v-if="viewMailSent" class="justify-content-center">
        <b-col lg="6" md="8" >
          <b-card no-body class="bg-secondary border-0" >
            <b-card-header class="px-lg-5 bg-transparent pb-2 text-center ">
                <h2> Email sent … </h2>
                <small> Please check your email to reset your password.</small>
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

  export default {
    name: 'register',
    data() {
      return {
        model: {
          name: '',
          email: '',
          password: '',
          agree: false
        },
        view : {
          screen : null // NULL, MAILSENT
        }
      }
    },
    computed : {
      viewMailSent : function (params) {
          return this.view.screen == 'MAILSENT';
      },
      viewResetForm : function (params) {
          return !this.view.screen;
      }
    },
    methods: {
      async onSubmit() {
        // this will be called only after form is valid. You can do an api call here to register users
        try {
          //this.model.email = "sds"
          let resp = await this.$service.submit("/partner/pub/forgot/pass",{
            email : this.model.email
          });
          console.log("resp",resp);
          this.view.MAILSENT = 'MAILSENT';
        } catch(e){
            console.log("error",e.response.data);
            this.$refs.signupContact.setErrors(e.response.data.veeErrors)
        }
      }
    }

  };
</script>
<style></style>
