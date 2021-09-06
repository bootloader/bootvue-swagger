<template>
  <div>
    <!-- Page content -->
    <b-container class="x-position-absolute">
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
            <b-card-body class="px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4 d-none">
                <small>Or sign up with credentials</small>
              </div>
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">


                  <base-input alternative question feedback
                              class="mb-3"
                              label="New Password"
                              type="password"
                              name="New Password" ref="new_password" vid="new_password"
                              :rules="'required|min:6|max:35'" required
                              v-model="model.newpass">
                  </base-input>

                  <base-input alternative question feedback
                              class="mb-3"
                              label="Confirm Password" 
                              type="password" 
                              name="Confirm Password"
                              :rules="'required|confirmed:new_password'" required 
                              v-model="model.confirmpass">
                  </base-input>
                  
                  <password-meter :password="model.newpass" @score="onScore" />
                  <div class="text-muted font-italic"><small>password strength: <span
                    class="text-success font-weight-700">{{model.strength}}</span></small></div>
                  
                  
                  <div class="text-center">
                    <b-button type="submit" variant="primary" class="mt-4">Save</b-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>

 import passwordMeter from "vue-simple-password-meter";

  export default {
    components: { passwordMeter },
    name: 'register',
    data() {
      return {
        model: {
          code : this.$route.query.code,
          account : this.$route.query.account,
          newpass: '',
          confirmpass: '',
          strength : null,
          agree: false
        }
      }
    },
    methods: {
      async onSubmit() {
        this.$service.submit('/account/pub/set/pass',{
          account : this.model.account,
          code : this.model.code,
          newpass : this.model.newpass,
          confirmpass : this.model.confirmpass,
          agree : this.model.agree
        });
        window.location.href = "/account/app/"
      },
      onScore(evt) {
        this.model.strength = evt.strength
      }
    }

  };
</script>
<style></style>
