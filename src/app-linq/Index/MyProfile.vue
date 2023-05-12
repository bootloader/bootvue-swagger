<template>
    <div class="px-6-x">
        <div class="flex flex-wrap justify-center profile-bar">
          <div class="lg:w-4/12 px-4 lg:order-1x">
          </div>
          <div class="lg:w-4/12 px-4 lg:order-2x flex justify-center text-center ">
            <div class="relative" v-lazy-container="{ selector: 'img' }">
              <img :data-src="$formatters.https_thumburl(meta.profile.picture,150,150)"
                  :data-error="defaultCompanyLogo"
                class="defaultCompanyLogo shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"/>
            </div>
          </div>
          <div class="lg:w-4/12 px-4 lg:order-3x">
          </div>
        </div>
        <div class="text-center mt-10 pt-10 ">
          
        </div>
        <div class="section-wrapper mt-20">
          <div class="social-tile-container ">
            <social-tile class="w-full lg:w-4/12"
              :title="meta.profile.name"  :subtitle="meta.profile.jobTitle" provider="google"> 
              <template #thumb>
                <social-icon href="/linq/auth/logout" icon="fa fa-power-off" variant="evening"/>
              </template>  
            </social-tile>
          </div>  
        </div> 
        <div class="section-wrapper">
            <div class="section-divider">My Profiles</div>
            <SocialBoxes :items="myProfiles" class="py-3 text-center" allowadd/>
        </div>  
        <div class="section-wrapper">
            <div class="section-divider">My Memberships</div>
            <VerificationBoxes :items="memberships" class="py-3 text-center">
            </VerificationBoxes>
        </div>  
        <div class="section-wrapper">
            <div class="section-divider">Profile/Settings</div>
            <div class="social-tile-container">
                <span class="w-full lg:w-4/12 d-inline-block">
                    <social-tile class="w-full" variant="danger" 
                            title="Delete My Profile" @click="deleteMyProfile"
                            subtitle="Completely erase your data" >
                      <template #thumb>
                          <social-icon provider="plus" icon="fa fa-trash-alt" variant="danger"
                            />
                      </template>   
                    </social-tile> 
                </span>  
            </div>
        </div> 
        <div class="py-5 text-center">
          <div class="flex flex-wrap justify-center">
            <div class="w-full lg:w-9/12 px-4 flex flex-wrap justify-center">
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import Navbar from "./ProfileNavbar.vue";
import FooterComponent from "./Footer.vue";
import SocialBoxes from "./SocialBoxes.vue";

const defaultCompanyLogo = __webpack_public_path__ + '/_common/static/person-profile.png';
//import defaultCompanyLogo from "@/assets/vendor/notus/img/company-profile-2.png";
import ProfileNoDomain from './ProfileNoDomain.vue';
import SocialIcon from '../components/SocialIcon.vue';
import VerificationBoxes from './VerificationBoxes.vue';

export default {
  data() {
    return {
      defaultCompanyLogo : defaultCompanyLogo,
      memberships :[],
      date: new Date().getFullYear(),
    };
  },
  mounted : function () {
  },
  created (){
    this.load();
  },
  computed : {
    myProfiles(){
      return (this.profiles || []).map(function(profile){
        return {
          title : profile.name,
          subtitle : profile.email || profile.phone,
          provider : profile.provider,
        }
      });
    }
  },
  methods : {
    async load(){
      this.loadMeta();
      this.loadProfiles();
      this.loadMemberships();
    },
    async loadMemberships(){
      var resp = await this.$service.get('/api/v1/user/membership',{
      });
      this.memberships = (resp.results || []).map(function(membership){
        return {
          title : membership.verification?.title,
          subtitle : membership.membershipType,
          provider : 'certificate',
          path : "/app/v/"+membership.verificationId + "/m/" + membership.membershipId ,
        }
      });
    },
    async deleteMyProfile(){
      if(confirm("All Your Data will be deleted, You Sure?")){
        var resp = await this.$service.delete('/auth/meta',{
        });
        window.location.reload()
      }
    }
  },
  components: {
    Navbar,SocialBoxes,
    FooterComponent,
    ProfileNoDomain,
    SocialIcon,VerificationBoxes
  },
};
</script>
<style lang="scss">

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
.h-300-px {
  height: 300px;
}

.social-tile-container {
  margin: auto;
  font-size: 0;
  text-align: center;
  left: 0;
  right: 0;
}

.profile-bar {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
}



</style>
