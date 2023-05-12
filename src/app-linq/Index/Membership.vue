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
                  <social-tile-container :items="sharedProfiles"/> 
              </div>  
              <div class="section-wrapper">
                  <div class="section-divider"></div>
                   <base-input label="Share Link" copy readonly v-model="sharelink" size="sm"
                        variant="outline-evening"
                        prelabel alternative required rules="required|max:90" />
              </div> 
              <div class="py-5 text-center">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full lg:w-9/12 px-2 flex flex-wrap justify-center">
                    <b-button variant="outline-danger" v-if="canLeave"
                      @click="cancelMembership">
                      Leave
                    </b-button>
                    <b-button variant="outline-evening" v-if="canCancel"
                      @click="cancelMembership">
                      Cancel
                    </b-button>
                    <b-button variant="outline-evening" v-if="canEdit"
                     :to="`/app/v/${$route.params.verificationId}/edit`">
                      Edit
                    </b-button> 
                    <b-button variant="evening" v-if="canViewMembers"
                      :to="`/app/v/${$route.params.verificationId}/m/${$route.params.membershipId}/members`">
                      Members
                    </b-button> 
                  </div>
                </div>  
              </div>
         </validation-observer> 

    </div>
</template>
<script>
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
    this.loadMeta();
    this.loadMembership();
  },
  computed : {
    canViewMembers(){
      return ['OWNER','ADMIN','MODERATOR'].indexOf(this.membership.membershipType) > -1
    },
    canEdit(){
      return ['OWNER'].indexOf(this.membership.membershipType) > -1
    },
    sharelink(){
      return  `${document.location.origin}/linq/pub/v/${this.$route.params.verificationId}`;
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
