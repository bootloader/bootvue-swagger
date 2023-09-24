<template>
	<div class="container d-flex justify-content-center align-items-center my-auto h-100">
		<div class="card text-center i-card flip-card bg-transparent" :class="{
      flipped : flipped
    }">
      <div class="flip-card-inner" @click="flipped=!flipped">
			<div class="card-header p-2 flip-card-front">
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
                <img :data-src="$formatters.https_thumburl(thisVerification.picture,150,150)"
                  :data-error="$formatters.https_thumburl(defaultCompanyLogo,150,150)"
                class="logo shadow-xl rounded-cr h-auto align-middle border-none max-w-150-px"/>
              </div>  
          </div>
        </div>
        <div class="mb-3 text-center">
            <b-row class="bg-darker mb-3 p-3 text-white">
              <b-col cols="6 text-left text-sm">
                <div v-for="p in profileContacts" v-bind:key="p.value">
                   <div>{{p.value}}</div>
                </div>
                <div>&nbsp;</div>
                <div class="text-right text-bold">{{thisVerification.title}}</div>
              </b-col>
              <b-col cols="6">
                  <qr-code :value="cardLink" :options="{
                      size : 150, padding : 22
                    }">
                  </qr-code>
              </b-col>  
            </b-row>  
             <b-row class="">
                <b-col cols="12" class="text-center" >
                      <a class="btn btn-evening btn-sm" @click.stop="" :href="cardLink">
                        <i class="fas fa-download"/>  Save</a>
                      <button class="btn btn-evening btn-sm" @click.stop="shareLink">
                         <i class="fas fa-share"/> Share</button>
                </b-col>  
             </b-row> 
        </div> 
			</div>

        <!---  bACK SIDE -->

      <div class="card-header p-2 flip-card-back">
        <div class="text-center text-black">
          <div class="picture-wrapper-x">
              <div class="picture-container-x" v-lazy-container="{ selector: 'img' }">
               <qr-code v-if="vCardData" :value="vCardData" :options="{
                      size : 300, padding : null
                    }">
                </qr-code>
              </div>  
          </div>
				  <h5 class="mb-2">{{thisUser.name}} </h5>
          <h6 class="mb-2 text-xs">{{membership.memberTitle}}</h6>
          <h6 class="mb-2 text-xs">{{membership.memberRole}}</h6>
          <h6 class="mb-2 text-xs">{{membership.membershipType}}</h6>
        </div>
        <div class="mb-3 text-center">
            <b-row class="bg-darker mb-3 p-3 text-white">
              <b-col cols="6 text-left text-sm">
                <div v-for="p in profileContacts" v-bind:key="p.value">
                   <div>{{p.value}}</div>
                </div>
                <div>&nbsp;</div>
                <div class="text-right text-bold">{{thisVerification.title}}</div>
              </b-col>
              <b-col cols="6">
                    <div class="logo-wrapper">
                      <div class="logo-container size-md" v-lazy-container="{ selector: 'img' }">
                      <img :data-src="$formatters.https_thumburl(thisVerification.picture,150,150)"
                        :data-error="$formatters.https_thumburl(defaultCompanyLogo,150,150)"
                      class="logo shadow-xl rounded-cr h-auto align-middle border-none size-md"/>
                    </div>  
                </div>
              </b-col>  
            </b-row>  
             <b-row class="">
                <b-col cols="12" class="text-center" >
                      <a class="btn btn-evening btn-sm" @click.stop="" :href="cardLink">
                        <i class="fas fa-download"/>  Save</a>
                      <button class="btn btn-evening btn-sm" @click.stop="shareLink">
                         <i class="fas fa-share"/> Share</button>
                </b-col>  
             </b-row> 
        </div> 
      </div>  
      </div>
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
      flipped : false, vCardData : "",
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
    //this.loadMeta();
    this.loadMembership();
    this.loadVCard();
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
    },
    profileContacts(){
      let unique = {};
      let lsts = [];
      this.membership?.profiles?.map(function(p){
        ['email','phone'].map(function(type){
            let value = p[type];
            if(!unique[value]){
                unique[value] = unique[value] || {'type' : type, value : value};
                lsts.push(unique[value]);
            }
        });
      });
      return lsts;
    },
  },
  methods : {
    async loadVCard(){
        let resp = await this.$service.get(`/pub/v1/card/${this.verificationId}/${this.membershipId}.text`,{
          download :  false
        });
        this.vCardData = resp;
    },
    shareLink(){
        if (navigator.share) {
          navigator.share({
              title: this.thisUser.name,
              text: 'VCard',
              url: `https://app.truelinq.com/linq/pub/v/${this.verificationId}/m/${this.membershipId}/card`,
            }).then(() => console.log('Successful share'))
              .catch((error) => console.log('Error sharing', error));
        } else {
          console.log('Share not supported on this browser, do it the old way.');
        }
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
            &.size-md{
              height: 10em;
              border-radius: 25px;
            }
            .logo {
                border-radius: 50%;
                max-width: 70px;
                max-height: 70px;
                padding: 5px;
              &.size-md{
                max-width: 150px;
                max-height: 150px;
              }  
            }
        }
    }
}

.flip-card {
  background-color: transparent;
  width: 300px;
  height: 200px;
  border: 1px solid #f1f1f1;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
}

/* Style the back side */
.flip-card-back {
  background-color: dodgerblue;
  color: white;
  transform: rotateY(180deg);
}

</style>
