<template>
  <div>
    <!-- Page content -->
    <b-container class="x-position-absolute">
            <!-- Table -->
      <b-row class="justify-content-center">
        <b-col lg="6" md="8">
          <b-card no-body class="bg-secondary border-0">
            <b-card-header class="bg-transparent pb-5 d-none"  >
               <h2> Get started free </h2>
                <small> No credit card required</small>
            </b-card-header>
            <b-card-body class="px-lg-5 py-lg-2">
              <div class="text-muted mb-4">
                <h2> Sign in </h2>
                <small> Use your registered details </small>
              </div>
              <div class="d-none" >
                <div class="text-muted text-center mt-2 mb-3"><small>Sign in with</small></div>
                <div class="btn-wrapper text-center">
                  <a href="#" class="btn btn-neutral btn-icon">
                    <span class="btn-inner--icon"><img :src="$config.CDN_URL + '/argon/img/icons/common/github.svg'"></span>
                    <span class="btn-inner--text">Github</span>
                  </a>
                  <a href="#" class="btn btn-neutral btn-icon">
                    <span class="btn-inner--icon"><img :src="$config.CDN_URL +  '/argon/img//icons/common/google.svg'"></span>
                    <span class="btn-inner--text">Google</span>
                  </a>
                </div>
              </div>
              <div class="text-center text-muted mb-4 d-none">
                <small>Or sign in with credentials</small>
              </div>
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input alternative feedback question
                              class="mb-3"
                              name="Email" label="Email"
                              :rules="{required: true, email: true}"
                              placeholder="Email"
                              v-model="model.email">
                  </base-input>

                  <base-input alternative feedback question
                              class="mb-3"
                              name="Password" label="Password"
                              :rules="{required: true, min: 6}"
                              type="password"
                              placeholder="Password"
                              v-model="model.password">
                  </base-input>

                  <b-form-checkbox class="d-none" v-model="model.rememberMe">Remember me</b-form-checkbox>
                  <div class="text-center">
                    <base-button type="primary" native-type="submit" class="my-4">Sign in</base-button>
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
  export default {
    data() {
      return {
        model: {
          email: '',
          password: '',
          rememberMe: false
        }
      };
    },
    methods: {
      async onSubmit() {
        this.$service.submit('/account/pub/login',{
          email : this.model.email,
          password : this.model.password,
          newpass : this.model.password
        });
        window.location.href = "/account/app/"
      },
    }
  };
</script>
