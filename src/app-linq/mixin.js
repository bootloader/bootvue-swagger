  import Vue from 'vue';

  export default {
    init : function(){
      Vue.mixin({
        data() {
          return {
            nounce : Date.now()
          };
        },
        computed: {
          meta(){
            return this.$store.getters.StateRest?.AuthMeta || { profile : {}};
          },
          canJoin(){
            return ['OWNER','ADMIN','MODERATOR','MEMBER','PENDING'].indexOf(this.membership?.membershipType) < 0
          },
          canCancel(){
            return  (this.membership?.verification?.verificationId && this.meta.loggedIn) 
                && ['NONE'].indexOf(this.membership?.membershipType) > -1
          },
          canLeave(){
            return (this.membership?.verification?.verificationId && this.meta.loggedIn) 
                &&  ['OWNER','ADMIN','MODERATOR','MEMBER','PENDING'].indexOf(this.membership?.membershipType) > -1
          },
          profiles(){
            return this.$store.getters.StateApi.V1Profiles || [];
          },
        },
        methods : {
          async loadMeta (refresh){
            return await this.$service.getX('/auth/meta#0',{
            },{  refresh : true });
          },
          async loadMembership(){
            var resp = await this.$service.get('/api/v1/verification/membership',{
              verificationId : this.$route.params.verificationId,
              membershipId : this.$route.params.membershipId
            });
            this.membership = resp.results[0];
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
          async loadProfiles(){
            await this.$service.getX('/api/v1/profiles',{
            });
          },
          async cancelMembership(){
            var resp = await this.$service.delete('/api/v1/membership',{
                verificationId : this.$route.params.verificationId,
                membershipId : this.$route.params.membershipId,
            });
            await this.loadMeta();
            this.$router.push("/")
        },
        }
      });
    }
  };