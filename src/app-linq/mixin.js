  var mixin  = {
    data() {
      return {
        nounce : Date.now(),
        loaderCounter : 0
      };
    },
    computed: {
      meta(){
        return this.$store.getters.StateRest?.AuthMeta || { profile : {}};
      },
      verificationId(){
        return  (this.membership?.verification?.verificationId) ||  this.$route.params.verificationId;
      },
      verificationSharelink(){
        return  `${document.location.origin}/linq/pub/v/${this.$route.params.verificationId}`;
      },
      isOwner(){
        return ['OWNER'].indexOf(this.membership?.membershipType) >= 0;
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
      form_ques(){
        return this.membership.verification.form.ques || [];
      },
      form_ques_count(){
        return this.form_ques.length
      }
    },
    methods : {
      setMembership(membership){
        this.membership = membership || { form : {}};
        this.membership.form =  {
          ...this.membership.form
        }
      },
      setVerification(verification){
        this.membership.verification = verification  || { form : { ques : [] }};
        this.membership.verification.form =  {
          ques : [],
          ...this.membership.verification.form,
        }
        console.log("setverification",this.membership.verification.form.ques);
        if(this.profileTypes){
          this.membership.verification.profileTypes.map((profileType)=>{
            this.profileTypes[profileType] = true;
          });
        }
      },
      async loadMeta (refresh){
        return await this.$service.getX('/auth/meta#0',{
        },{  refresh : true });
      },
      async loadMembership(){
        var resp = await this.$service.get('/api/v1/verification/membership',{
          verificationId : this.$route.params.verificationId,
          membershipId : this.$route.params.membershipId
        });
        this.setMembership(resp.results[0]);
        this.setVerification(this.membership.verification);
      },
      async loadVerification(){
        var resp = await this.$service.get('/pub/v1/verification',{
          verificationId : this.$route.params.verificationId,
        });
        this.setMembership(resp.meta)
        this.setVerification(resp.results[0]);
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
  };
  
  export default mixin;