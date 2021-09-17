<template>
  <div class="container mx-auto px-4 h-full">
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-4/12 px-4">
        <div
          class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0"
        >
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
              <h6 class="text-blueGray-500 text-sm font-bold">
                Sign in to your domain
              </h6>
            </div>
            <div class="btn-wrapper text-center hidden">
              <button
                class="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                type="button"
              >
                <img alt="..." class="w-5 mr-1" :src="github" />
                Github
              </button>
              <button
                class="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                type="button"
              >
                <img alt="..." class="w-5 mr-1" :src="google" />
                Google
              </button>
            </div>
            <hr class="mt-6 border-b-1 border-blueGray-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div class="text-blueGray-400 text-center mb-3 font-bold hidden">
              <small>Or sign in with credentials</small>
            </div>

            <form v-if="!domain">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Enter your domain URL
                </label>
                <div class="domain-box border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                  <input id="domain"
                    type="text" v-model="domainInput" autocomplete="off"
                    class="domain-input" :style="{
                      'width' : domainSize + 'px'
                    }"
                    :placeholder="domainPlaceholder" />
                    <label for="domain" class="font-bold">.{{$config.PROP_SERVICE_DOMAIN}}</label>
                    <div class="domain-width-wrapper">
                      <div class="domain-width" ref="domainWidth"><div>{{domainInput || domainPlaceholder}}</div></div>
                    </div> 
                </div>  

              </div>

              <div class="text-center mt-6">
                <button
                  class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="button"
                >
                  Continue
                </button>
              </div>
            </form>

            <form v-else-if="domain">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Email
                </label>
                <input
                  type="email"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Email"
                />
              </div>

              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Password
                </label>
                <input
                  type="password"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Password"
                />
              </div>
              <div>
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    id="customCheckLogin"
                    type="checkbox"
                    class="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  />
                  <span class="ml-2 text-sm font-semibold text-blueGray-600">
                    Remember me
                  </span>
                </label>
              </div>

              <div class="text-center mt-6">
                <button
                  class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="button"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="flex flex-wrap mt-6 relative" v-if="domain">
          <div class="w-1/2">
            <a href="javascript:void(0)" class="text-blueGray-200">
              <small>Forgot password?</small>
            </a>
          </div>
          <div class="w-1/2 text-right">
            <router-link to="/auth/register" class="text-blueGray-200">
              <small>Create new account</small>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import github from "@/assets/vendor/notus/img/github.svg";
import google from "@/assets/vendor/notus/img/google.svg";

var domain = "";

export default {
  data() {
    return {
      github,
      google,
      domain,
      domainInput : "",
      domainPlaceholder : "yourdomain",
      domainWidth : 0
    };
  },
  computed : {
    domainSize : function () {
        //return this.this.domainWidth;
        //return this.$refs.domainWidth.clientWidth;
        return Math.max(this.domainWidth || this.domainInput.length || this.domainPlaceholder.length,22) +1;
    }
  },
  mounted () {
    const that = this;
    if(this.$global.MyConst.appDomain){

    }
    that.$nextTick(function () {
      that.getDomainWidth()
    });
  },
  updated(){
    const that = this
    that.$nextTick(function () {
      that.getDomainWidth()
    });
  },
  methods : {
    getDomainWidth() {
      this.domainWidth = this.$refs.domainWidth ? this.$refs.domainWidth.clientWidth : 0;
    }
  }
};
</script>
<style scoped>
  .domain-box, .domain-box input::-webkit-input-placeholder,.domain-box input {
    font-size: 16px;
  }
  .domain-input, .domain-input:focus {
    outline-style: none;
    box-shadow: none;
    border-color: transparent;
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom :0px;
  }
  .domain-width {
    background-color: red;
    float: left;
  }
  .domain-width-wrapper {
    height: 1px;
    overflow: hidden;
  }
</style>
