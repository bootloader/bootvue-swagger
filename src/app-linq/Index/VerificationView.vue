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
              <div class="section-wrapper" v-if="meta.loggedIn">
                  <div class="section-divider"></div>
                  <base-text-area name="Cover Letter" v-model="membership.coverLetter"
                    placeholder="Give us more information about you" 
                              alternative question feedback  required  :rows="4" 
                                :textLimit="300"  />
              </div> 
              <div class="section-wrapper" v-if="meta.loggedIn">
                  <div class="section-divider">Profiles Required</div>
                  <social-tile class="w-full" 
                              title="Profiles Required"
                              subtitle="" >
                        <template #thumb>
                            <social-icon provider="google"/>
                        </template>  
                        <template #details>
                          <span v-for="p in membership.verification.profileTypes"  v-bind:key="p" >
                            <social-icon v-if="p!='google'"
                              :provider="p" />
                          </span>  
                        </template>  
                  </social-tile>
              </div>  
              <div class="py-5 text-center">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full lg:w-9/12 px-4 flex flex-wrap justify-center"
                    v-if="membership && membership.verification">
                    <b-button variant="evening" v-if="canJoin && !meta.loggedIn"
                     :href="`/linq/app/v/${$route.params.verificationId}`">
                      Join
                    </b-button> 
                    <b-button variant="outline-evening" v-if="canJoin && meta.loggedIn"
                      @click="join(true)">
                      Cancel
                    </b-button>
                    <b-button variant="evening" v-if="canJoin && meta.loggedIn"
                      @click="join()">
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
export default {
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
    this.loadDomainProfile();
    this.loadVerification();
  },
  computed : {
    canViewMembers(){
      return ['OWNER','ADMIN','MODERATOR'].indexOf(this.membership.membershipType) > -1
    },
    canEdit(){
      return ['OWNER'].indexOf(this.membership.membershipType) > -1
    },
    canJoin(){
       return ['OWNER','ADMIN','MODERATOR','MEMBER','PENDING'].indexOf(this.membership.membershipType) < 0
    },
    meta(){
      return this.$store.getters.StateRest?.AuthMeta || {};
    }
  },
  methods : {
    async loadDomainProfile (refresh){
      return await this.$service.getX('/auth/meta#0',{
      },{  refresh : true });
    },
    async loadVerification(){
      var resp = await this.$service.get('/pub/v1/verification',{
        verificationId : this.$route.params.verificationId,
      });
      this.membership = resp.meta || {};
      this.membership.verification = resp.results[0];
      this.membership.verification.profileTypes.map((profileType)=>{
        this.profileTypes[profileType] = true;
      })
    },
    async join(cancel){
      if(cancel){
        var resp = await this.$service.delete('/api/v1/membership',{
            verificationId : this.$route.params.verificationId,
            membershipId : this.$route.params.membershipId,
        });
        await this.loadDomainProfile();
      } else {
        var resp = await this.$service.submit('/api/v1/verification/membership',{
            verificationId : this.$route.params.verificationId,
            coverLetter : this.membership.coverLetter,
            cancel : cancel
        });
      }
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
