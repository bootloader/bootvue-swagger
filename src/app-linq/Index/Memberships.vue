<template>
    <div class="px-6-x">
        <div class="section-wrapper">
          <div class="social-tile-container ">
            <social-tile class="w-full lg:w-4/12"
              :title="membership.verification.title" :subtitle="membership.membershipType" provider="google"> 
              <template #thumb>
                <social-icon icon="fas fa-certificate"></social-icon>
              </template>  
            </social-tile>
          </div>  
        </div> 

         <validation-observer v-slot="{}" ref="formValidator">
              <div class="section-wrapper styler-height-fix">
                    <div class="section-divider">Details</div>
                    <div class="mb-1">&nbsp;</div>
                    <b-row>
                        <b-col cols="12" class="text-center">
                           {{membership.verification.description}}
                        </b-col> 
                    </b-row>  
              </div>  
              <div class="section-wrapper">
                  <div class="section-divider">Profiles Shared</div>
                  <SocialBoxes :items="membership.profiles" class="py-5 text-center type-1"/>
              </div>  
              <div class="py-5 text-center">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full lg:w-9/12 px-4 flex flex-wrap justify-center">
                    <b-button variant="outline-greyer" v-if="canEdit"
                     :to="`/app/v/${$route.params.verificationId}/edit`">
                      Edit Details
                    </b-button> 
                    <b-button variant="greyer" v-if="canViewMembers"
                      :to="`/app/v/${$route.params.verificationId}/members`">
                      View Members
                    </b-button> 
                  </div>
                </div>  
              </div>
         </validation-observer> 

    </div>
</template>
<script>
import SocialBoxes from "./SocialBoxes.vue";
export default {
  data() {
    return {
      membership : {
        membershipType : 'NONE',
        verification : {
          "title": "",
          "description": "",
          "profileTypes": [
          ],
          "verificationId": null
        },
      },
    };
  },
  mounted : function () {
  },
  created (){
    this.loadMembership();
  },
  computed : {
    canViewMembers(){
      return ['OWNER','ADMIN','MODERATOR'].indexOf(this.membership.membershipType) > -1
    },
    canEdit(){
      return ['OWNER'].indexOf(this.membership.membershipType) > -1
    }
  },
  methods : {
    async loadMembership(){
      var resp = await this.$service.get('/api/v1/verification/membership',{
        verificationId : this.$route.params.verificationId
      });
      this.membership = resp.results[0];
    },
    async loadMemberships(){
      var resp = await this.$service.get('/api/v1/verification/membership',{
        verificationId : this.$route.params.verificationId
      });
      this.membership = resp.results[0];
    }
  },
  components: {
    SocialBoxes
  },
};
</script>
<style lang="scss">

.bg-cover-x {
  background-image: url('~@/assets/vendor/notus/img/social-bg-bottom.png');
  background-position: bottom;
}
.type-1 {
  min-width: 300px;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
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
