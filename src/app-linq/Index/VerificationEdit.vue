<template>
    <div class="px-6-x">
        <div class="section-wrapper">
          <div class="social-tile-container ">
            <social-tile class="w-full lg:w-4/12" v-if="isEditing"
              :title="`-- Edit Verification --` " subtitle="Update details" provider="google"> 
              <template #thumb>
                <social-icon icon="fas fa-certificate"></social-icon>
              </template>  
            </social-tile>
            <social-tile class="w-full lg:w-4/12" v-else
              :title="`-- Create Verification --` " subtitle="Start your own Verification" provider="google"> 
              <template #thumb>
                <social-icon icon="fas fa-certificate"></social-icon>
              </template>  
            </social-tile>
          </div>  
        </div> 

         <validation-observer v-slot="{handleSubmit}" ref="formValidator">
              <div class="section-wrapper styler-height-fix">
                    <div class="section-divider">Details</div>
                    <div class="mb-1">&nbsp;</div>
                    <b-row>
                        <b-col cols="12">
                            <base-input name="Title" v-model="verification.title" :disabled="isEditing"
                              alternative question feedback  required rules="required|max:30" />
                        </b-col>  
                        <b-col cols="12">
                            <base-text-area name="Note" v-model="verification.description" 
                              alternative question feedback  required  :rows="4" 
                                :textLimit="300"  />
                        </b-col> 
                    </b-row>  
              </div>  
              <div class="section-wrapper">
                  <div class="section-divider">Required Profiles</div>
                  <social-tile class="w-full" 
                              title="Create new Verification"
                              subtitle="Start your own Verification" >
                        <template #thumb>
                            <social-icon provider="google" 
                              @click="profileTypes.google=true"
                              :variant="profileTypes.google ? 'google' : 'greyed'"/>
                        </template>  
                        <template #details>
                            <social-icon provider="linkedin" 
                              @click="profileTypes.linkedin=!profileTypes.linkedin"
                              :variant="profileTypes.linkedin ? 'linkedin' : 'greyed'"/> 
                            <social-icon provider="facebook" 
                              @click="profileTypes.facebook=!profileTypes.facebook"
                              :variant="profileTypes.facebook ? 'facebook' : 'greyed'"/> 
                            <social-icon provider="outlook" 
                              @click="profileTypes.outlook=!profileTypes.outlook"
                              :variant="profileTypes.outlook ? 'outlook' : 'greyed'"/>
                             <social-icon provider="mobile" 
                              @click="profileTypes.mobile=!profileTypes.mobile"
                              :variant="profileTypes.mobile ? 'mobile' : 'greyed'"/> 
                             <social-icon provider="whatsapp" 
                              @click="profileTypes.whatsapp=!profileTypes.whatsapp"
                              :variant="profileTypes.whatsapp ? 'whatsapp' : 'greyed'"/>
                        </template>  
                  </social-tile>
              </div>  
              <div class="py-5 text-center">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full lg:w-9/12 px-4 flex flex-wrap justify-center">
                    <b-button variant="outline-greyer" to="/linq">
                      Cancel
                    </b-button> 
                    <b-button variant="greyer" @click="handleSubmit(saveVerification)">
                      Save
                    </b-button> 
                  </div>
                </div>  
              </div>
         </validation-observer> 

    </div>
</template>
<script>
import Navbar from "./ProfileNavbar.vue";
import FooterComponent from "./Footer.vue";
import SocialBoxes from "./SocialBoxes.vue";

export default {
  data() {
    return {
      verification : {
        "title": "",
        "description": "",
        "profileTypes": [
          'google'
        ],
        "verificationId": null
      },
      profileTypes : {
        google : true, linkedin : false, outlook : false, whatsapp : false, twitter : false, mobile : false,facebook : false,
      },
      domainProfile : {
         userId : "-----------",
         userName : "---- ----",
         loggedIn : true,
         intentVerification :null,
         profile : {
            name : "- -",
            email :"-.-@-.-",
            phone :"",
            jobTitle : "",
            picture :"",
            provider :"----",
            profileId :"------",
            profileUUId :"----:----",
            userId:"-------",
            verified :false
         }
      },
      profiles :[],
      memberships :[],
      date: new Date().getFullYear(),
    };
  },
  mounted : function () {
  },
  created (){
    this.loadDomainProfile();
    if(this.isEditing){
      this.loadMembership();
    }
  },
  computed : {
    isEditing(){
      return !!this.$route.params.verificationId;
    }
  },
  methods : {
    async loadDomainProfile (){
      var resp = await this.$service.get('/auth/meta',{
      });
      this.domainProfile = resp.results[0];
    },
    async loadMembership(){
      var resp = await this.$service.get('/api/v1/verification/membership',{
        verificationId : this.$route.params.verificationId
      });
      this.verification = resp.results[0].verification;
      this.verification.profileTypes.map((profileType)=>{
        this.profileTypes[profileType] = true;
      })

    },
    async saveVerification(){
      this.verification.profileTypes = Object.keys(this.profileTypes).filter((profileType)=>this.profileTypes[profileType])
      var resp = await this.$service.post('/api/v1/verification',{
        ... this.verification
      });
      this.$router.push("/")
    }
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
