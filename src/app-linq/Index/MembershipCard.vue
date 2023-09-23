<template>
	<div class="container d-flex justify-content-center align-items-center my-auto h-100">
		<div class="card text-center i-card">
      <ValidationObserver ref="form" class="template-form"  v-slot="{handleSubmit}">
			<div class="card-header p-2">
        <div class="text-center">
          <div class="picture-wrapper">
              <div class="picture-container" v-lazy-container="{ selector: 'img' }">
                <img :data-src="$formatters.https_thumburl(thisProfile.picture,150,150)"
                  :data-error="defaultPersonLogo"
                class="picture shadow-xl rounded-cr h-auto align-middle border-none max-w-150-px"/>
              </div>  
          </div>
				  <h5 class="mb-2">{{thisUser.name}} </h5>
          <h6 class="mb-2 text-xs">{{membership.memberTitle}}</h6>
          <h6 class="mb-2 text-xs">{{membership.memberRole}}</h6>
          <h6 class="mb-2 text-xs">{{membership.membershipType}}</h6>
          <div class="logo-wrapper">
              <div class="logo-container" v-lazy-container="{ selector: 'img' }">
                <img :data-src="$formatters.https_thumburl(thisVerification.picture || thisProfile.picture,150,150)"
                  :data-error="$formatters.https_thumburl(defaultCompanyLogo,150,150)"
                class="logo shadow-xl rounded-cr h-auto align-middle border-none max-w-150-px"/>
              </div>  
          </div>
        </div>
        <div class="mb-3 text-center">
            <b-row class="bg-darker mb-3 p-3 text-white">
              <b-col cols="6 text-left text-sm">
                <div v-for="p in membership.profiles" v-bind:key="p.profileId">
                   <div>{{p.phone}}</div>
                   <div>{{p.email}}</div>
                </div>
                <div>{{thisVerification.title}}</div>
              </b-col>
              <b-col cols="6">
                  <qr-code :value="cardLink" :options="{
                      size : 150, padding : 22
                    }">
                  </qr-code>
              </b-col>  
            </b-row>  
             <b-row class="">
                <b-col cols="12" class="text-center">
                      <a class="btn btn-evening btn-sm" :href="cardLink">Save Contact</a>
                </b-col>  
             </b-row> 
        </div> 
			</div>
      </ValidationObserver>
		</div>
	</div>
</template>
<script>
import mixin from '../mixin.js'
 import QrCode from '@/@common/custom/components/QrCode.vue';
const defaultPersonLogo = __webpack_public_path__ + '/_common/static/person-profile.png';
const defaultCompanyLogo = __webpack_public_path__ + '/_common/static/company-profile-1.png';

export default {
  mixins : [mixin],
  data() {
    return {
      defaultPersonLogo,
      defaultCompanyLogo,
      verificationSecret : "",
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
    },
    config(){
      return {
        ...this.membership.verification.config || {},
        ...this.membership.config || {}
      }
    },
    thisVerification(){
      return this.membership?.verification || {
      }
    },
    thisUser(){
      return this.membership?.user || {
      }
    },
    thisProfile(){
      return this.thisUser?.profile || {
      }
    },
    cardLink(){
      return `https://app.truelinq.com/linq/pub/v1/card/${this.verificationId}/${this.membershipId}.vcf`;
    }
  },
  methods : {
    async saveVerification(){
    },
    async resetKey(){
      let resp = await this.$service.submit("api/v1/verification/key",{
        verificationId : this.verificationId
      });
      console.log("resp",resp);
      this.verificationSecret = resp.meta.verificationSecret;
    }
  },
  components: {
    QrCode
  },
};
</script>
<style lang="scss">
.i-card {
    min-width: 350px !important; 
    min-height: 570px !important;
    max-width: 95vw !important; 
    max-height: 95vh !important; 
    .picture-wrapper {
        .picture-container {
            height: 9em;
            display: flex;
            align-content: center;
            flex-wrap: nowrap;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            .picture{
                max-width: 100px;
                max-height: 100px;
            }
        }
    }
    .logo-wrapper {
        .logo-container {
            height: 6em;
            display: flex;
            align-content: center;
            flex-wrap: nowrap;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            .logo {
                border-radius: 50%;
                max-width: 70px;
                max-height: 70px;
                padding: 5px;
            }
        }
    }
}
.bg-cover-x {
  background-image: url('~@/assets/vendor/notus/img/social-bg-bottom.png');
  background-position: bottom;
}
.h-300-px {
  height: 300px;
}
</style>
