<template>
    <div class="px-6-x">
        <SectionWrapper header>
            <social-tile-container>
                <social-tile class="w-full lg:w-4/12"
                      title="Applications" icon="fa fa-cog" subtitle="My Memberships" >
                  </social-tile>
            </social-tile-container>
        </SectionWrapper>  
        <SectionWrapper>
            <VerificationBoxes :items="memberships" class="py-3 text-center">
            </VerificationBoxes>
        </SectionWrapper>  
        <SectionWrapper v-if="interested.length>0">
            <h4 class="section-divider linq-section-divider">Suggestions</h4>
            <social-tile-container :items="interested">
            </social-tile-container>
        </SectionWrapper> 
    </div>
</template>
<script>
import Navbar from "./ProfileNavbar.vue";
import FooterComponent from "./Footer.vue";
import SocialBoxes from "./SocialBoxes.vue";

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
          subtitle : profile.phone, subsubtitle : profile.email,
          provider : profile.provider,
          partner : profile.partner,
          link : profile.profileLink,
        }
      });
    }
  },
  methods : {
    async load(){
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
</style>