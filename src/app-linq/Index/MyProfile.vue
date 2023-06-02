<template>
    <div class="px-6-x">
        <div class="flex flex-wrap justify-start profile-bar">
          <div class="lg:w-4/12 px-4 lg:order-1x">
          </div>
          <div class="lg:w-4/12 px-4 lg:order-2x flex justify-start text-center " style="z-index: 1;"  > 
            <div class="relative" v-lazy-container="{ selector: 'img' }">
              <img :data-src="$formatters.https_thumburl(meta.profile.picture,150,150)"
                  :data-error="defaultCompanyLogo"
                class="defaultCompanyLogo shadow-xl rounded-cr h-auto align-middle border-none absolute lg:-ml-16 max-w-150-px"/>
            </div>
          </div>
          <div class="lg:w-4/12 px-4 lg:order-3x">
          </div>
        </div>
        <div class="text-center  pt-10 ">
          
        </div>
        <div class="section-wrapper1">
          <div class="social-tile-container ">
            <social-tile class="w-full lg:w-4/12" style="text-align-last:center"
              :title="meta.profile.name"  :subtitle="meta.profile.jobTitle" provider="google"> 
              <template #thumb>
                <social-icon :imgSrc="$formatters.https_thumburl(meta.profile.picture,50,50)"
                :imgError="defaultCompanyLogo"/>
              </template>  
            </social-tile>
          </div>  
        </div> 
        <div class="section-wrapper">
            <h4 class="section-divider">My Profiles</h4>
            <SocialBoxes :items="myProfiles" class="py-3 text-center" allowadd/>
        </div>  
        <div class="section-wrapper">
            <h4 class="section-divider">My Memberships</h4>
            <VerificationBoxes :items="memberships" class="py-3 text-center">
            </VerificationBoxes>
        </div>  
        <div class="section-wrapper" v-if="interested.length>0">
            <h4 class="section-divider">Suggestions</h4>
            <social-tile-container :items="interested">
            </social-tile-container>
        </div> 
        <div class="section-wrapper">
            <h4 class="section-divider">Profile/Settings</h4>
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
        <div class=" text-center">
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
import SocialTileContainer from '../components/SocialTileContainer.vue';
import mixin from '../mixin.js'

console.log("mixin",mixin)

export default {
  mixins : [mixin],
  data() {
    return {
      defaultCompanyLogo : defaultCompanyLogo,
      memberships :[],
      date: new Date().getFullYear(),
      interested : []
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
          link : profile.profileLink,
        }
      });
    }
  },
  methods : {
    async load(){
      this.loadMetaAndRecent();
      this.loadProfiles();
      this.loadMemberships();
    },
    async loadMetaAndRecent(){
        await this.loadMeta();
        if(this.meta.intentVerification){
            var resp = await this.$service.get('/pub/v1/verification',{
              verificationId : this.meta.intentVerification,
            });
            this.interested = this.interested.concat(resp.results.map(function(v){
              return {
                title : v.title,
                subtitle : "Click to complete your application ",
                provider : 'certificate',
                path : "/app/v/"+v.verificationId,
              }
            }));
        }
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
          status : 'user-' + membership.membershipType,
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
    SocialIcon,VerificationBoxes,
    SocialTileContainer
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
  min-width: 100px;
  max-width: 140px;
  margin-top: -29px;
  margin-left: -49px;

  &[lazy=loading]{
    padding: 14px;
    background-color: #304157;
  }
  &[lazy=loaded]{
    padding: 2px;
    background-image: linear-gradient(to top, #292f3f 55%, #fff );
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

      h4 {
            display: flex;
            flex-direction: row;
          }
          
        h4:before,
        h4:after {
            content: "";
            flex: 1 1;
            border-bottom: 2px solid #efefef;
            
         }
          
        img {
            height: 100px;
            width: 100px;
            border-radius: 50%;
        }



</style>
