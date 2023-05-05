<template>
  <div>
    <profile-no-domain  v-if="!domainProfile">
      
    </profile-no-domain> 
    <main  v-else class="profile-page">
      <section class="relative block h-300-px">
        <div
          class="absolute top-0 w-full h-full bg-center bg-cover bg-blueGray-200"
        >
          <span
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
                <div class="lg:w-4/12 px-4 lg:order-1">
                </div>
                <div class="lg:w-4/12 px-4 lg:order-2 flex justify-center text-center ">
                  <div class="relative" v-lazy-container="{ selector: 'img' }">
                    <img :data-src="$formatters.https_thumburl(domainProfile.profile.picture,150,150)"
                        :data-error="defaultCompanyLogo"
                      class="defaultCompanyLogo shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"/>
                  </div>
                </div>
                <div class="lg:w-4/12 px-4 lg:order-3">
                </div>
              </div>
              <div class="text-center mt-10 pt-10 ">
                <h6
                  class="text-3xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2 pt-5"
                >
                  {{domainProfile.profile.name}}
                </h6>
                <div v-if="domainProfile.profile.jobTitle"
                  class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
                >
                  <i
                    class="fas fa-briefcase mr-2 text-lg text-blueGray-400"
                  ></i>
                  <span>
                    <span class="text-comma">{{domainProfile.profile.jobTitle}}</span>
                  </span> 
                </div>
              </div>
              <SocialBoxes :channels="channels" class="py-5 text-center type-1"/>
              <div class="py-5 text-center">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full lg:w-9/12 px-4 flex flex-wrap justify-center">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


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
         userId : "-----------",
         userName : "---- ----",
         loggedIn : true,
         intentVerification :null,
         profile : {
            name : "- -",
            email :"-.-@-.-",
            phone :"",
            jobTitle : "",
            picture :"",
            provider :"----",
            profileId :"------",
            profileUUId :"----:----",
            userId:"-------",
            verified :false
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
      var resp = await this.$service.get('/auth/meta',{
      });
      this.domainProfile = resp.results[0];
    },
    async loadChannels(){
      var resp = await this.$service.get('/api/v1/profiles',{
      });
      this.channels = resp.results || [];
    },
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
.h-300-px {
  height: 300px;
}


</style>
