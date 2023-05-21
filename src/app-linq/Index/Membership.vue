<template>
    <div class="px-6-x">
        <div class="section-wrapper">
          <div class="social-tile-container ">
            <social-tile class="w-full lg:w-4/12" v-if="membership"
              :title="membership.verification.title" :subtitle="membership.membershipType || 'You are not member yet'" provider="google"> 
              <template #thumb>
                <social-icon icon="fas fa-certificate"></social-icon>
              </template>  
            </social-tile>
          </div>  
        </div> 

         <validation-observer v-slot="{}" ref="formValidator" v-if="isReady">
              <div class="section-wrapper styler-height-fix">
                    <div class="section-divider">Details</div>
                    <b-row>
                        <b-col cols="12" class="text-center">
                           <div class="verificationer-details">{{membership.verification.description}}</div> 
                        </b-col> 
                    </b-row>  
              </div>  
              <div class="section-wrapper">
                  <div class="section-divider">Profiles Shared</div>
                  <social-tile-container :items="sharedProfiles"/> 
              </div>  
              <div class="section-wrapper">
                  <div class="section-divider"></div>
                   <base-input label="Share Link" copy readonly v-model="verificationSharelink"
                        variant="outline-evening"
                        prelabel alternative required rules="required|max:90" />
              </div> 
              <div class="section-wrapper">
                <div class="social-tile-container ">
                    <social-button class="w-full lg:w-4/12" variant="outline-danger" v-if="canLeave"
                      icon="fas fa-arrow-right-from-bracket" 
                      title="Leave" :subtitle="`from '${membership.verification.title}'`"
                      @click="cancelMembership">
                      Leave
                    </social-button>
                    <social-button class="w-full lg:w-4/12" variant="outline-evening" v-if="canCancel"
                      icon="fa fa-circle-xmark" 
                      title="Leave" :subtitle="`from '${membership.verification.title}'`"
                      @click="cancelMembership">
                      Cancel
                    </social-button>
                    <social-button  class="w-full lg:w-4/12" variant="outline-evening" v-if="canEdit"
                      icon="fas fa-edit" 
                      title="Edit" :subtitle="`details of '${membership.verification.title}'`"
                      :path="`/app/v/${$route.params.verificationId}/edit`">
                      Edit
                    </social-button> 
                    <social-button  class="w-full lg:w-4/12" variant="evening" v-if="canViewMembers"
                      icon="fas fa-users" 
                      title="Members" :subtitle="`of '${membership.verification.title}'`"
                      :path="`/app/v/${$route.params.verificationId}/m/${$route.params.membershipId}/members`">
                      Members
                    </social-button> 
                </div> 
              </div>
              <div class="py-5 text-center">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full lg:w-9/12-xx lg:w-4/12 px-2 flex flex-wrap justify-center">
 
                  </div>
                </div>  
              </div>
         </validation-observer> 

    </div>
</template>
<script>
import mixin from '../mixin.js'
export default {
  mixins : [mixin],
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
    this.loadMeta();
    this.loadMembership();
  },
  computed : {
    isReady(){
      return this.meta && this.membership?.membershipId;
    },
    canViewMembers(){
      return ['OWNER','ADMIN','MODERATOR'].indexOf(this.membership.membershipType) > -1
    },
    canEdit(){
      return ['OWNER'].indexOf(this.membership.membershipType) > -1
    },
    sharedProfiles(){
      return this.membership?.profiles?.map(function(p){
        return {
          provider : p.provider,
          title : p.name,
          subtitle : p.email ||  p.phone 
        }
      })
    }
  },
  methods : {
    async saveVerification(){
    },
  },
  components: {
  },
};
</script>
<style lang="scss">

.bg-cover-x {
  background-image: url('~@/assets/vendor/notus/img/social-bg-bottom.png');
  background-position: bottom;
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
