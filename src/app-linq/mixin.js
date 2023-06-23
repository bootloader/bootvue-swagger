  var mixin  = {
    data() {
      return {
        nounce : Date.now(),
        loaderCounter : 0,
        loadProfilesLoading : false
      };
    },
    computed: {
      is_module_busy(){
        return this.loaderCounter > 0;
      },
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
      module_busy(is_busy){
        let isBusy = (is_busy === undefined) ? true : is_busy;
        if(isBusy) {
          this.loaderCounter++
        } else this.loaderCounter--;
      },
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
        this.loadProfilesLoading = true;
        await this.$service.getX('/api/v1/profiles',{
        });
        this.loadProfilesLoading = false;
      },
      async cancelMembership(){
        var resp = await this.$service.delete('/api/v1/membership',{
            verificationId : this.$route.params.verificationId,
            membershipId : this.$route.params.membershipId,
        });
        await this.loadMeta();
        this.$router.push("/")
      },
      onPostMessageWrapper : function (e) {
        if(!e || !e.data || typeof e.data != 'string' || e.data.trim().indexOf("{")!=0){
          return;
        }
        //console.log("onmessage====onPostMessage:data"+e.data);
        var data = JSON.parse(e.data);
        if(!data.payload){
          return;
        }
        var payload = data.payload;
        //console.log("onmessage====onPostMessage.data.payload"+JSON.stringify(payload));
        if(this.onPostMessage){
          this.onPostMessage(payload);
        }
      },
      onMessageAttach(){
        if (window.addEventListener) {
            window.addEventListener("message", this.onPostMessageWrapper, false);
        } else if (window.attachEvent) {
            window.attachEvent('onmessage', this.onPostMessageWrapper);
        }
      },
      onMessageRemove(){
        if (window.addEventListener) {
            window.removeEventListener("message", this.onPostMessageWrapper, false);
        } else if (window.attachEvent) {
            window.removeEventListener('onmessage', this.onPostMessageWrapper);
        }
      },
      reloadUrl(target_url){
        this.$router.push({ name : "reload", params : {
          reload : btoa(target_url),
        }});
      },
      onPostMessage(e){
        console.log("onPostMessage",e);
      },
      open_deeplink(targetUrl, callback){
          let target_url = window.location.origin+'/linq/pub/deeplink?deeplink='+btoa(targetUrl);
          let iframe = null;
          iframe = window.open(target_url,'deeplink');
          this.onMessageAttach((e)=>{
            console.log("ON_MESSAGE_ATTACH",e);
          });
          iframe.addEventListener('load', function(){
            console.log(" iframe.onload----",iframe);
            if(callback) callback(targetUrl,true);
            // iframe.close();
          }, false);
          iframe.addEventListener('unload', function(){
            console.log(" iframe.unload----",iframe);
            if(callback) callback(targetUrl,false);
            // iframe.close();
          }, false);

          return;
          //this.reloadUrl(target_url);
          console.log("target_url",target_url);
          iframe = document.createElement('iframe');
          iframe.id = "deep_link";
          iframe.name = "deep_link_"+Date.now();
          iframe.style.border = "none";
          iframe.style.width = "1px";
          iframe.style.height = "1px";
          iframe.width = 0;
          iframe.height = 0;
          iframe.frameBorder = 0;
          iframe.onload = function () {
            //iframe.src = targetUrl;
            //window.open(targetUrl,iframe.name);
            if(callback) callback(targetUrl);
          };
          iframe.setAttribute('src', target_url);
          iframe.src= target_url;
          // hide iframe visually
          document.body.appendChild(iframe);
          //window.open(target_url,"_blank");
           //window.open(target_url);
      }
    }
  };
  
  export default mixin;