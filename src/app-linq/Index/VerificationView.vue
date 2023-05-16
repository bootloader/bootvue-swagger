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

         <validation-observer v-slot="{handleSubmit}" ref="formValidator">
              <div class="section-wrapper styler-height-fix">
                    <div class="section-divider">Details</div>
                    <b-row>
                        <b-col cols="12" class="text-center">
                            <div class="verificationer-details">{{membership.verification.description}}</div> 
                        </b-col> 
                    </b-row>  
              </div>  
              <div class="section-wrapper" v-if="meta.loggedIn">
                  <div class="section-divider"></div>
                  <base-text-area name="Cover Letter" v-model="membership.coverLetter"
                    placeholder="Give us more information about you" :readonly="!canApply"
                              alternative question feedback  required  :rows="4"  rules="required|max:300"
                              helpMessage="It will help admin consider your request"
                                :textLimit="300"  />
              </div> 
              <div class="section-wrapper" v-if="meta.loggedIn">
                  <div class="section-divider">Profiles Required</div>
                  <social-tile class="w-full" 
                              title="Profiles Required"
                              subtitle="" >
                        <template #thumb>
                            <social-icon :provider="isMatchedProfiles ? 'tick' : 'cross'"
                            :variant="isMatchedProfiles ? 'green' : 'grey'"/>
                        </template>  
                        <template #details>
                          <span v-for="p in matchedProfiles"  v-bind:key="p.provider" >
                            <social-icon v-if="p.linked" ticksign :title="`${p.provider} is already linked`"
                                :provider="p.provider" />
                            <social-icon v-else variant="grey" addsign :title="`Add ${p.provider}`"
                                :href="`/linq/app/v1/connect/${p.provider}?_${nounce}&verificationId=${verificationId}`" 
                                :provider="p.provider" />
                          </span>  
                        </template>  
                  </social-tile>
                  <div class="section-divider-footer text-red text-center" v-if="!isMatchedProfiles">Link missing profiles</div>
              </div>  
              <div class="py-5 text-center">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full lg:w-9/12 px-4 flex flex-wrap justify-center"
                    v-if="membership && membership.verification">
                    <b-button variant="evening" v-if="canJoin && !meta.loggedIn"
                     :href="`/linq/app/v/${$route.params.verificationId}`">
                      Join
                    </b-button> 
                   <b-button variant="outline-danger" v-if="canLeave"
                      @click="cancelMembership">
                      Leave
                    </b-button>
                    <b-button variant="outline-evening" v-if="canCancel"
                      @click="cancelMembership">
                      Cancel
                    </b-button>
                    <b-button variant="evening" v-if="canApply" :disabled="!canApplyValid"
                      @click="handleSubmit(join)">
                      Apply
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
import BaseTextArea from '../../@common/argon/components/Inputs/BaseTextArea.vue';
import SocialBoxes from "./SocialBoxes.vue";
import mixin from '../mixin.js'

export default {
  mixins : [mixin],
  data() {
    return {
      profileTypes : {
        linkedin : false, outlook : false, whatsapp : false, twitter : false
      },
      membership : {
        membershipType : 'NONE',
        verification : {
          "title": "",
          "description": "",
          "profileTypes": [
          ],
          "verificationId": null
        },
        coverLetter : ''
      },
    };
  },
  mounted : function () {
  },
  created (){
    this.load();
  },
  computed : {
    canViewMembers(){
      return ['OWNER','ADMIN','MODERATOR'].indexOf(this.membership.membershipType) > -1
    },
    canEdit(){
      return ['OWNER'].indexOf(this.membership.membershipType) > -1
    },
    canApply(){
      return  (this.membership?.verification?.verificationId) &&  this.canJoin && this.meta.loggedIn;
    },
    matchedProfiles(){
      return this.membership.verification.profileTypes.map((p)=>{
        return {
          provider : p,
          linked : (!!this.profiles.filter((s)=>{
            return s.provider == p;
          })[0]) || false
        };
      }).sort(function(a,b){
        return b.linked - a.linked;
      })
    },
    isMatchedProfiles(){
      return !this.matchedProfiles.filter(function(a){
        return a.linked === false;
      })[0];
    },
    canApplyValid(){
      return  this.canApply && this.isMatchedProfiles;
    },
  },
  methods : {
    async load(){
      await this.loadMeta();
      await this.loadVerification();
      await this.loadProfiles();
    },
    async join(){
      var resp = await this.$service.submit('/api/v1/verification/membership',{
          verificationId : this.$route.params.verificationId,
          coverLetter : this.membership.coverLetter
      });
      this.$router.push("/")
    }
  },
  components: {
    SocialBoxes,BaseTextArea
  },
};
</script>
<style  lang="scss">

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
