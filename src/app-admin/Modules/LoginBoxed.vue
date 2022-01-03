<template>
    <div>
        <div class="h-100 bg-animation bg-full" >
            <div class="d-flex h-100 justify-content-center align-items-center">
                <b-col md="8" class="mx-auto app-login-box">
                    <div class="mx-auto mb-3 log-wrapper">
                      <img src="@/assets/images/logo.png"">
                    </div>


                    <div class="modal-dialog w-100 mx-auto">
                        
                        <div class="modal-content">

                            <form @submit.prevent="submit">
                                <div class="modal-body">
                                    <div class="h5 modal-title text-center">
                                        <h4 class="mt-2">
                                            <div>Welcome back,</div>
                                            <span>Please sign in to your account below.</span>
                                        </h4>
                                    </div>

                                    <b-form-group id="exampleInputGroup1"
                                                  label-for="exampleInput1"
                                                  description="Do not share your credentials with anyone else.">
                                        <b-form-input id="exampleInput1" 
                                                      type="text" name="username" v-model="form.username"
                                                      required
                                                      placeholder="Enter username...">
                                        </b-form-input>
                                    </b-form-group>

                                    <b-form-group id="exampleInputGroup2"
                                                  label-for="exampleInput2">
                                        <b-form-input id="exampleInput2"
                                                      type="password" name="password" v-model="form.password"
                                                      required
                                                      placeholder="Enter password...">
                                        </b-form-input>
                                    </b-form-group>

                                    <p v-if="showError" id="error" v-text="error" ></p>

                                    <b-form-checkbox name="check" id="exampleCheck">
                                        Keep me logged in
                                    </b-form-checkbox>
                                    <div class="divider"/>
                                    <h6 class="mb-0" hidden>
                                        No account?
                                        <a href="javascript:void(0);" class="text-primary">Sign up now</a>
                                    </h6>
                                </div>
                                <div class="modal-footer clearfix">
                                    <div class="float-left" hidden>
                                        <a href="javascript:void(0);" class="btn-lg btn btn-link">Recover
                                            Password</a>
                                    </div>
                                    <div class="float-right">
                                        <b-button type="submit" variant="primary" size="lg">Login to Dashboard</b-button>
                                    </div>
                                </div>
                             </form>
                        </div>
                    </div>
                    <div class="text-center text-white opacity-8 mt-3">
                        Copyright &copy; MeherY SocCom 2021
                    </div>
                </b-col>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";

 export default {
    name: "Login",
    data() {
        return {
          form: {
            username: "",
            password: "",
          },
          error : "",
          showError: false
        };
    },

    methods: {
        ...mapActions(["LogIn"]),
        async submit() {
          const User = new URLSearchParams();
          User.append("username", this.form.username);
          User.append("password", this.form.password);
          try {
              await this.LogIn(User);
              this.$router.push("/");
              this.showError = false
          } catch (error) {
             console.log(error)
            this.error = error.message;
            this.showError = true
          }
        },
      },

 }
</script>

<style scoped>
    #error {
      color: red;
    }
    .log-wrapper {
      text-align: center;
    }
    .bg-full{
      background-color: #292d79;
    }
</style>
