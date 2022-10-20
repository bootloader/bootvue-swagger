<template>
  <div>
    <navbar />
    <profile-no-domain  v-if="!domainProfile">
      
    </profile-no-domain> 
    <main  v-else class="profile-page">
      <section class="relative block h-500-px">
        <div
          class="absolute top-0 w-full h-full bg-center bg-cover bg-blueGray-700"
        >
          <span hidden
            id="blackOverlay"
            class="w-full h-full absolute opacity-50 bg-black"
          ></span>
        </div>
        <div
          class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
          style="transform: translateZ(0);"
        >
          
          <svg
            class="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              class="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>
      <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
          <div
            class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64"
          >
            <div class="px-6">
              <div class="flex flex-wrap justify-center">
                <div
                  class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center"
                >
                  <div class="relative" v-lazy-container="{ selector: 'img' }">
                    <img 
                        :data-src="$formatters.https_thumburl(domainProfile.social.logo,150,150)"
                        :data-error="defaultCompanyLogo"
                      class="defaultCompanyLogo shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                    />
                  </div>
                </div>
                <div
                  class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center"
                >
                  <div class="py-6 px-3 mt-32 sm:mt-0" hidden>
                    <button
                      class="bg-emerald-500 active:bg-emerald-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                      type="button"
                    >
                      Connect
                    </button>
                  </div>
                </div>
                <div class="w-full lg:w-4/12 px-4 lg:order-1">
                  <div class="flex justify-center py-4 lg:pt-4 pt-8">
                    <div class="mr-4 p-3 text-center" hidden>
                      <span
                        class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
                      >
                        22
                      </span>
                      <span class="text-sm text-blueGray-400">Friends</span>
                    </div>
                    <div class="mr-4 p-3 text-center" hidden>
                      <span
                        class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
                      >
                        10
                      </span>
                      <span class="text-sm text-blueGray-400">Photos</span>
                    </div>
                    <div class="lg:mr-4 p-3 text-center" hidden>
                      <span
                        class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
                      >
                        89
                      </span>
                      <span class="text-sm text-blueGray-400">Comments</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center mt-12">
                <h3
                  class="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2"
                >
                  {{domainProfile.company.businessName}}
                </h3>
                <div
                  class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase" hidden
                >
                  <i
                    class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"
                  ></i>
                  <span>
                    <span class="text-comma">{{domainProfile.company.conactAddress}}</span>
                    <span class="text-comma">{{domainProfile.company.conactCity}}</span>
                     <span class="text-comma">{{domainProfile.company.conactCountry}}</span>
                  </span> 
                </div>
                <div class="mb-2 text-blueGray-600 mt-10">
                  <i
                    class="fas fa-briefcase mr-2 text-lg text-blueGray-400"
                  ></i>
                  {{domainProfile.company.businessType}}
                </div>
                <div class="mb-2 text-blueGray-600">
                  <i
                    class="fas fa-globe-americas mr-2 text-lg text-blueGray-400"
                  ></i>
                  <a :href="domainProfile.company.websiteUrl">{{domainProfile.company.websiteUrl | stripslash}}</a>
                </div>
              </div>
              <div class="mt-10 py-10 border-t border-blueGray-200 text-center" hidden>
                <div class="flex flex-wrap justify-center">
                  <div class="w-full lg:w-9/12 px-4">
                    <p class="mb-4 text-lg leading-relaxed text-blueGray-700">
                      {{domainProfile.company.businessAbout}}
                    </p>
                    <a hidden
                      href="javascript:void(0)"
                      class="font-normal text-emerald-500"
                    >
                      Show more
                    </a>
                  </div>
                </div>
              </div>
              <div class="py-5 text-center">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full lg:w-9/12 px-4 flex flex-wrap justify-center">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SocialBoxes :channels="channels" class="py-5 text-center type-1"/>

      </section>

      <footer class="relative bg-blueGray-200 pt-1 pb-6">
          <div class="container mx-auto px-4">
            <hr class="my-6 border-blueGray-300" />
            <div
              class="flex flex-wrap items-center md:justify-between justify-center"
            >
              <div class="w-full md:w-4/12 px-4 mx-auto text-center">
                <div class="text-sm text-blueGray-500 font-semibold py-1">
                  Copyright © {{ date }}
                  <a
                    :href="$config.PROP_SERVICE_WEBSITE_LINK"
                    class="text-blueGray-500 hover:text-blueGray-800"
                  >
                    {{$config.PROP_SERVICE_NAME}}
                  </a>
                  .
                </div>
              </div>
            </div>

          </div>
      </footer>

    </main>
  </div>
</template>
<script>
import Navbar from "./ProfileNavbar.vue";
import FooterComponent from "./Footer.vue";
import SocialBoxes from "./SocialBoxes.vue";

const defaultCompanyLogo = __webpack_public_path__ + '/_common/static/company-profile-1.png';
//import defaultCompanyLogo from "@/assets/vendor/notus/img/company-profile-2.png";
import ProfileNoDomain from './ProfileNoDomain.vue';

export default {
  data() {
    return {
      defaultCompanyLogo : defaultCompanyLogo,
      domainProfile : {
        domain : null,
        company : {
          businessAbout: "",
          businessName: "",
          businessType: "",
          conactAddress: null,
          conactCity: null,
          conactCountry: "",
          conactEmail: "",
          conactPostalCode: null,
          websiteUrl : null
        },
        social : {
          logo : defaultCompanyLogo
        }
      },
      channels :[],
      date: new Date().getFullYear(),
    };
  },
  mounted : function () {
  },
  created (){
    this.loadDomainProfile();
    this.loadChannels();
  },
  computed : {
  },
  methods : {
    async loadDomainProfile (){
      var resp = await this.$service.get('/partner/pub/domain',{
        domain : this.front_domain,
        tnt : "app"
      });
      this.domainProfile = resp.results[0];
      if(this.domainProfile){
        this.loadWebChat();
      }
    },
    async loadChannels(){
      console.log("this.$config.APP_DOMAIN",this.$config.APP_DOMAIN)
      var resp = await this.$service.get('/api/options/channels',{
        tnt : this.front_domain,
      });
      this.channels = resp.results || [];
    },
    async loadWebChat(){
            let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', this.$global.MyConst.cdn + '/plugins/customer.js?theme=bubble');
      recaptchaScript.innerHTML = JSON.stringify({
          "domain" : [this.$global.MyConst.appDomain,this.$global.MyConst.config.PROP_SERVICE_SERVER].join("."),
          //"channelId" :  this.$global.MyConst.config.SETUP.POSTMAN_CHAT_WEB_CHANNEL,
          //"channelKey" : this.$global.MyConst.config.SETUP.POSTMAN_CHAT_WEB_CHANNEL_KEY,
          "config" : {
                "header.bg.color" : "#1e293b",
                "header.text.color" : "#ffffff",
                //"header.icon.url" : this.$global.MyConst.cdn + "/_common/static/support.png",
                //"header.title.text" : "Support",
                //"header.disabled" : true,

                "launcher.bg.color" : "#1e293b",
                //"launcher.open" : true,

                "messageList.bg.color" : "#ffffff",

                "sentMessage.bg.color" : "#4e8cff",
                "sentMessage.text.color" : "#ffffff",

                "receivedMessage.bg.color" : "#eaeaea",
                "receivedMessage.text.color" : "#222222",

                "userInput.bg.color" : "#f4f7f9",
                "userInput.text.color" : "#565867"
            }
        });
      document.body.appendChild(recaptchaScript);
    }
  },
  components: {
    Navbar,SocialBoxes,
    FooterComponent,
    ProfileNoDomain,
  },
};
</script>
<style scoped lang="scss">

.bg-cover-x {
  background-image: url('~@/assets/vendor/notus/img/social-bg-bottom.png');
  background-position: bottom;
}
.defaultCompanyLogo {
  background-color: rgb(239, 239, 239);
  min-width: 130px;
  max-width: 140px;
  &[lazy=loading]{
    padding: 14px;
    background-color: #304157;
  }
  &[lazy=loaded]{
    padding: 1px;
    background-color: #304157;
  }
  &[lazy=error]{
    background-color: #f9f9f9;
    padding: 14px;
  }
}
.type-1 {
  min-width: 300px;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
}



</style>
