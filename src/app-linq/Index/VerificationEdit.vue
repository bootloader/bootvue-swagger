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
                    <h4 class="section-divider linq-section-divider">Details</h4>
                    <div class="mb-1">&nbsp;</div>
                    <b-row>
                        <b-col cols="11">
                            <base-input name="Title" v-model="membership.verification.title" :disabled="isEditing"
                              alternative question feedback  required rules="required|max:30" />
                        </b-col>

                        <b-col cols="12">
                            <base-text-area name="Note" v-model="membership.verification.description" 
                              alternative question feedback  required  :rows="4" 
                                :textLimit="300"  />
                        </b-col> 
                        <b-col cols="12" v-for="field in form_ques" v-bind:key="'form_'+field.key">
                            <base-input :name="field.keyName" v-model="field.title"
                              alternative question feedback required rules="required|max:30" >
                              <template #actions>
                                  <b-button variant="outline-red" class="fa fa-trash" 
                                  v-tooltip="'Delete Question'" @click="removeQues(field.key)"
                                  ></b-button>
                              </template>  
                              </base-input>
                        </b-col> 
                        <b-col cols="12" class="text-center">
                            <b-button variant="outline-greyer" size="sm" @click="addQues">
                               <i class="fa fa-plus"/>  Add Question / {{form_ques_count}}
                            </b-button> 
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
                    <my-button variant="greyer" @click="handleSubmit(saveVerification)">
                      Save
                    </my-button> 
                  </div>
                </div>  
              </div>
         </validation-observer> 

    </div>
</template>
<script>
import mixin from '../mixin.js'

  function create_UUID(){
      var dt = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (dt + Math.random()*16)%16 | 0;
          dt = Math.floor(dt/16);
          return (c=='x' ? r :(r&0x3|0x8)).toString(16);
      });
      return uuid;
  }

export default {
  mixins : [mixin],
  data() {
    return {
      membership : {
        verification : {
          "title": "",
          "description": "",
          "profileTypes": [
            'google'
          ],
          "verificationId": null,
          form : {
            ques : []
          }
        },
      },
      profileTypes : {
        google : true, linkedin : false, outlook : false, whatsapp : false, twitter : false, mobile : false,facebook : false,
      },
      memberships :[],
      date: new Date().getFullYear(),
    };
  },
  mounted : function () {
  },
  created (){
    this.loadMeta();
    if(this.isEditing){
      this.loadVerification();
    }
  },
  computed : {
    isEditing(){
      return !!this.$route.params.verificationId;
    },
    form_ques(){
      return this.membership?.verification?.form?.ques || [];
    }
  },
  methods : {
    async saveVerification(){
      this.membership.verification.profileTypes = Object.keys(this.profileTypes).filter((profileType)=>this.profileTypes[profileType])
      var resp = await this.$service.post('/api/v1/verification',{
        ... this.membership.verification
      });
      this.$router.push("/app/v/"+resp.results[0].verificationId)
    },
    addQues(){
      let form_ques = this.form_ques;
      let qindex = form_ques.length+1;
      form_ques.push({
        title : '',
        keyName : `Question ${qindex}`,
        key : `ques_${Date.now()}_${create_UUID()}`
      });
      this.membership.verification.form.ques = form_ques;
    },
    removeQues(key){
      this.membership.verification.form.ques = this.membership.verification.form.ques.filter((ques)=>{
        return ques.key != key;
      }).map(function(ques,index){
        ques.keyName =  `Question ${index+1}`;
        return ques;
      });
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
