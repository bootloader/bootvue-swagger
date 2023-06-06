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
                    <h4 class="section-divider linq-section-divider">Details</h4>
                    <b-row>
                        <b-col cols="12" class="text-center">
                           <div class="verificationer-details">{{membership.verification.description}}</div> 
                        </b-col> 
                    </b-row>  
              </div>  
              <div class="section-wrapper">
                  <h4 class="section-divider linq-section-divider">Profiles Shared</h4>
                  <social-tile-container :items="sharedProfiles"/> 
              </div>  
              <div class="section-wrapper share-bar">
                  <div class="section-divider"></div>
                   <base-input label="Share Link" copy readonly v-model="verificationSharelink"
                        prependIcon="fas fa-share-nodes"
                        variant="outline-evening"
                        helpMessage="Share this link with people to join this."
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
              <div class=" text-center">
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

  .share-bar .input-group  {

    .input-group-prepend .btn {
      margin-top: 0px ;
      border: solid 1px #263d64;
      height: 36px;
      background-color: #233152;
      color: #d1cdcd;
    }

    .input-group-append .btn {
      margin-top: 0px ;
      border: solid 1px #263d64;
      height: 36px;
    }

    .input-group-append .btn-outline-evening:not(:disabled):not(.disabled):active, .btn-outline-evening:not(:disabled):not(.disabled).active, .btn-outline-evening:not(:disabled):not(.disabled):hover, .show > .btn-outline-evening.dropdown-toggle {
      color: #FFF;
      background-color: #233152;
      border-color: #525f7f;
}
    .form-control{
      height: 36px;
      
    }
    
  } 
  
</style>
