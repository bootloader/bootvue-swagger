<template>
    <div class="px-6-x">
        <SectionWrapper header>
            <social-tile-container>
                <social-tile class="w-full lg:w-4/12"
                      title="Settings" icon="fa fa-certificate" subtitle="Manage Profile" >
                  </social-tile>
            </social-tile-container>
        </SectionWrapper>  
        <SectionWrapper>
            <social-tile-container>
                <social-tile class="w-full lg:w-4/12" variant="danger" 
                      title="Delete" @click="deleteMyProfile" 
                      subtitle="Erase complete data" 
                      provider="plus" icon="fa fa-trash" >
                </social-tile>
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
  },
  methods : {
    async load(){
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