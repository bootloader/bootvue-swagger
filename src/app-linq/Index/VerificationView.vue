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

         <validation-observer v-slot="{handleSubmit}" ref="formValidator" v-if="isReady">
              <div class="section-wrapper styler-height-fix">
                    <div class="section-divider">Details</div>
                    <b-row>
                        <b-col cols="12" class="text-center">
                            <div class="verificationer-details">{{membership.verification.description}}</div> 
                        </b-col> 
                    </b-row>  
              </div>  
              <div class="section-wrapper" v-if="meta.loggedIn && !isOwner && form_ques.length">
                  <div class="section-divider">Answer below questions</div>
                  <!-- <div class="mb-2">&nbsp;</div> -->
                  <b-row>
                    <!-- <b-col>
                  <base-text-area name="Cover Letter" v-model="membership.coverLetter"
                    placeholder="Give us more information about you" :readonly="!canApply"
                              alternative question feedback  required  :rows="3"  rules="required|max:300"
                              helpMessage="It will help admin consider your request"
                                :textLimit="300"  />
                    </b-col> -->
                    <!-- <b-col cols="12" v-for="field in form_ques" v-bind:key="'form_'+field.key">
                            <base-input :name="field.title" v-model="field.title"
                              alternative question feedback required rules="required|max:30" >
                            </base-input>
                    </b-col>    -->
                    <b-col cols="12">
                          <my-model-form size="sm" class="mt-3 d-block"
                            :configs="form_ques"
                            :model="membership.form">
                          </my-model-form> 
                    </b-col>  
                  </b-row>  
              </div> 
              <div class="section-wrapper" v-if="meta.loggedIn && !isOwner">
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
              <div class="section-wrapper">
                  <div class="section-divider"></div>
                   <base-input label="Share Link" copy readonly v-model="verificationSharelink"
                        variant="outline-evening"
                        prelabel alternative required rules="required|max:90" />
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
                    <b-button variant="outline-evening" v-if="canEdit"
                     :to="`/app/v/${$route.params.verificationId}/edit`">
                      Edit
                    </b-button> 
                    <b-button variant="greyer" v-if="canViewMembers"
                      :to="`/app/v/${$route.params.verificationId}/m/${membership.membershipId}/members`">
                      Members
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
import MyModelForm from '../../@common/custom/components/MyModelForm.vue';

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
          "verificationId": null,
          form : {
              "ques" : []
          }
        },
        form : { key : "0" },
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
    isReady(){
      return this.meta && this.membership?.verification?.verificationId;
    },
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
      var resp = await this.$service.post('/api/v1/verification/membership',{
          verificationId : this.$route.params.verificationId,
          coverLetter : this.membership.coverLetter,
          form : this.membership.form
      });
      this.$router.push(`/app/v/${this.$route.params.verificationId}/m/${resp.results[0].membershipId}`)
    }
  },
  components: {
    SocialBoxes,BaseTextArea,MyModelForm
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
