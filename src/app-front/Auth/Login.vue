<template>
  <div class="container mx-auto px-4 h-full">
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-4/12 px-4">
        <div
          class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0"
        >
          <div class="rounded-t mb-0 px-6 py-5">
            <div class="text-center mb-3">
              <h6 class="text-blueGray-500 text-sm font-bold">
                Sign in to your domain
              </h6>
            </div>
            <div v-if="domain" class="btn-wrapper text-center">
                <h6 class="text-blueGray-500 text-sm">
                  <span class="text-emerald-600">https://</span>
                  <span class="text-blueGray-600  font-bold">{{domain}}</span>
                  <span class="text-blueGray-500  font-bold">.{{$config.PROP_SERVICE_DOMAIN}}</span>
                </h6>
            </div>
            <hr class="mt-2 border-b-1 border-blueGray-300" />
          </div>

          <div class="flex-auto px-4 lg:px-10 py-10 pt-0 pb-1">
            <div class="text-blueGray-400 text-center mb-3 font-bold hidden">
              <small>Or sign in with credentials</small>
            </div>
            <validation-observer ref="formValidator">
            <form v-if="!domain" ref="domainForm" :action="`https://app.${$config.PROP_SERVICE_DOMAIN}/front/auth/login`">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Enter your domain URL
                </label>
                <div class="domain-box border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                  <input name="app" type="hidden" v-model="app" />
                  <input id="domain"
                    type="text" v-model="domainInput" autocomplete="off" name="domain"
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
                  @click="domainSubmit"
                >
                  {{domainPreFilled ? 'Continue' : 'Submit'  }}
                </button>
              </div>
            </form>

            <form v-else-if="domain">
              <div class="btn-wrapper text-center">
                <a href="/front/auth/?app=agent"
                  class="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 
                  rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md 
                  inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                  :class="{'border-2 border-blueGray-600' : $route.query.app=='agent' || !$route.query.app}"
                  type="button">
                  <i class="w-5 mr-1 fa fa-user-secret" />
                  Agent
                </a>
                <a href="/front/auth/?app=admin"
                  class="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2
                  rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md 
                  inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                  :class="{'border-2 border-blueGray-600' : $route.query.app=='admin' }"
                  type="button">
                  <i class="w-5 mr-1 fa fa-user-shield" />
                  Admin
                </a>
              </div>

              <div class="relative w-full mb-3">
                 <validation-provider rules="required|emailz" 
                 vid="login.username" v-slot="{errors}"> 
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Email
                </label>
                <input
                  type="email" name="email"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white 
                  rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Email"
                  v-model="model.email"
                />
                  <span v-if="errors[0]" class="text-red-500 text-sm">
                        {{ errors[0] }}
                  </span>
                </validation-provider>
              </div>

              <div class="relative w-full mb-3">
                <validation-provider rules="required" name="Password" 
                vid="login.password"  v-slot="{errors}"> 
                  <label
                    class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Password
                  </label>
                  <input
                    type="password" name="password"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Password"
                    v-model="model.password"
                  />
                  <span v-if="errors[0]" class="text-red-500 text-sm">
                        {{ errors[0] }}
                  </span>
                </validation-provider>
              </div>

              <div class="hidden">
                <label class="inline-flex items-center cursor-pointer hidden">
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
                  @click="loginSubmit"
                >
                  Sign In
                </button>
              </div>
            </form>
            </validation-observer>
            <div>
              <form :action="'https://' + model.domainName + '.' + $config.PROP_SERVICE_DOMAIN + '/' + model.app + '/auth/direct'" method="POST" ref="loginForm">
                <input name="domainName" :value="model.domainName" type="hidden"/>
                 <input name="domainId" :value="model.domainId" type="hidden"/>
                 <input name="domainToken" :value="model.domainToken" type="hidden"/>
                  <input name="domainUser" :value="model.domainUser" type="hidden"/>
              </form>
            </div>
          </div>

          <div class="flex flex-wrap mt-1 mb-3 relative justify-center text-bold" v-if="domain">
            <div class="w-1/2 text-center font-bold">
              <a href="javascript:void(0)" class="text-blueGray-600" @click="domain=''">
                <small>Switch domain?</small>
              </a>
            </div>
            <div class="w-1/2 text-center font-bold hidden">
              <router-link to="/auth/register" class="text-blueGray-600">
                <small>Forgot password?</small>
              </router-link>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap mt-0 relative justify-center">
          <div class="text-center mt-1">
            <a href="/partner/auth"
              class="bg-white text-blueGray-600 active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 
              rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
              type="button"
              @click="loginSubmit"
            >
               Business Manager Login
            </a>
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
      app : "agent",
      domainInput : "",
      domainPlaceholder : "yourdomain",
      domainWidth : 0,
      model : {
        email : null, password : null,
        domainName : null, 
        domainId : null, 
        domainToken : null, 
        domainUser :  null
      }
    };
  },
  computed : {
    domainSize : function () {
        //return this.this.domainWidth;
        //return this.$refs.domainWidth.clientWidth;
        return Math.max(this.domainWidth || this.domainInput.length || this.domainPlaceholder.length,22) +1;
    },
    domainPreFilled :  function(){
      return (this.$global.MyConst.appDomainId && (this.$global.MyConst.appDomain == this.domainInput));
    }
  },
  watch : {
      '$route.query.app': function (app) {
        this.updateTarget();
      },
      '$route.query.domain': function (domain) {
        this.updateTarget();
      },
  },
  mounted () {
    const that = this;
    this.updateTarget();
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
    updateTarget(){
      if(this.$global.MyConst.appDomainId){
        this.domainInput = this.$global.MyConst.appDomain;
      }
      if(this.$route.query.app){
        this.app = this.$route.query.app;
      }
      if(this.$route.query.domain || 
        ( 
          this.$global.MyConst.tenant == this.$global.MyConst.appDomain
          && this.$global.MyConst.tenant != 'app'
        )){
        this.domainSubmit();
      }
    },
    domainSubmit(){
      if(this.domainPreFilled){
        this.domain = this.domainInput;
      } else if(this.domainInput) {
        this.$refs.domainForm.submit();
      }
    },
    async loginSubmit(){
        try {
          var resp = await this.$service.submit('/user/pub/login?tnt='+this.domain,{
            username : this.model.email,
            password : this.model.password,
            app : this.app, 
            domainId : this.$global.MyConst.appDomainId,
          },{
            ref : this.$refs.formValidator,
            toast : false
          });
          this.model.app = resp.data.app;
          this.model.domainName = resp.data.domainName;
          this.model.domainId = resp.data.domainId;
          this.model.domainToken = resp.data.domainToken;
          this.model.domainUser = resp.data.domainUser;
          var THAT = this;
          if(this.model.domainToken){
            setTimeout(function(){
               THAT.$refs.loginForm.submit();
            },100)
          }
          //window.location.href = "/partner/app/"
        } catch(e){
          //console.log(e.response);
        }
    },
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
