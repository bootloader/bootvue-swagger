<template>
  <div>
    <navbar />
    <main class="profile-page">
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
                  <div class="relative">
                    <img
                      alt="..."
                      :src="domainProfile.social.logo"
                      class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
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
                  class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
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
              <div class="mt-10 py-10 border-t border-blueGray-200 text-center">
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
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer-component />
  </div>
</template>
<script>
import Navbar from "../Auth/AuthNavbar.vue";
import FooterComponent from "./Footer.vue";

import team2 from "@/assets/vendor/notus/img/company-profile-2.png";

export default {
  data() {
    return {
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
          logo : team2
        }
      }
    };
  },
  mounted : function () {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', this.$global.MyConst.cdn + '/plugins/customer.js?theme=bubble');
      recaptchaScript.innerHTML = JSON.stringify({
          "domain" : [this.$global.MyConst.appDomain,this.$global.MyConst.config.PROP_SERVICE_DOMAIN].join("."),
          "channelId" : "MeheryProfile",
          "channelToken" : "<channelToken>",
          "config" : {
                "header.bg.color" : "#1e293b",
                "header.text.color" : "#ffffff",
                "header.icon.url" : "https://cdn.jsdelivr.net/gh/mehery-soccom/mehery-web-dist@834bfa2c3b8060cac2ebcd7778758d6021be2dca/dist/logo/logo-tiny-o.png",
                "header.title.text" : "Support",

                "launcher.bg.color" : "#1e293b",

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
  },
  created (){
    this.loadDomainProfile();
  },
  methods : {
    async loadDomainProfile (){
      var resp = await this.$service.get('/partner/pub/domain',{
        domain : this.$route.params.domain || this.$global.MyConst.tenant,
        tnt : "app"
      });
      this.domainProfile = resp.results[0];
    }
  },
  components: {
    Navbar,
    FooterComponent,
  },
};
</script>
<style scoped>

.bg-cover {
  background-image: url('~@/assets/vendor/notus/img/social-bg-to-center.png');
}

</style>
