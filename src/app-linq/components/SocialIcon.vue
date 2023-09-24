<template>
  <span class="social-btn " @click="onClick" v-lazy-container="{ selector: 'img' }">
      <span v-if="imgSrc" class="social-btn-box ">
           <img class="d-inline" :data-src="imgSrc" :data-error="imgError"/>
      </span>  
      <component v-else  :is="tag" :href="href"
          class="social-btn-box " :class="[ provider ,`bg-${myVariant}:before`, `size-${size}`]">
          <i class="social-btn-icon" :class="[ myIcon, `text-${myVariant}`]"></i>
      </component>
      <i v-if="addsign" class="social-btn-status fa fa-plus bg-grey text-white"></i>
      <i v-if="ticksign" class="social-btn-status fa fa-check bg-green text-white"></i>
      <i v-if="status" class="social-btn-status text-white" :class="[ myStatusIcon, `bg-${myStatusVariant}`]"></i>
  </span>
</template>
<script>

const DEFAULT_PROVIDERS = {
  google : { icon : "fab fa-google"},
  linkedin : { icon : "fab fa-linkedin-in"},
  outlook : { icon : " fab fa-microsoft", variant : "microsoft"},
  facebook : { icon : "fab fa-facebook-f"},
  twitter : { icon : "fab fa-twitter"},
  whatsapp : { icon : "fab fa-whatsapp"},
  telegram : { icon : "fab fa-telegram-plane"},
  instagram : { icon : "fab fa-instagram"},
  certificate : { icon : "fas fa-certificate", variant : 'evening'},
  mobile : { icon : "fas fa-phone-square", variant : 'mobile'},
  phone : { icon : "fas fa-phone-square", variant : 'mobile'},
  truecaller : { icon : "fas fa-phone-square", variant : 'truecaller'},
  tick : { icon : "fas fa-check", variant : 'green'},
  cross : { icon : "fas fa-times", variant : 'danger'},
  'user-OWNER' : { icon : "fas fa-crown", variant : 'evening'},
  'user-ADMIN' : { icon : "fas fa-user-secret", variant : 'evening'},
  'user-MODERATOR' : { icon : "fas fa-user-nurse", variant : 'evening'},
  'user-MEMBER' : { icon : "fas fa-user-graduate", variant : 'evening'},
  'user-PENDING' : { icon : "far fa-user", variant : 'evening'},
  'user-NONE' : { icon : "far fa-user", variant : 'greyed'},
  'user-REJECTED' : { icon : "fas fa-user-xmark", variant : 'evening'},
  'user-BLOCKED' : { icon : "fas fa-user-slash", variant : 'evening'},
}

export default {
  props : {
    provider : {}, partner : {},
    href : {
      default : "" 
    },
    variant : {}, 
    icon : {},
    path : {},  link : {}, reload : {}, goto : {},
    imgSrc : {},
    imgError : {},
    addsign : {
      type : Boolean,
      default : false
    },
    ticksign : {
      type : Boolean,
      default : false
    },
    status : {
    },
    size : { default : 'md'},
    c : {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data() {
    return {
      navbarOpen: false,
    };
  },
  computed : {
    myPartner(){
      return this.partner ? this.partner.toLowerCase() :this.partner;
    },
    myProvider(){
      return this.provider ? this.provider.toLowerCase() :this.provider;
    },
    myVariant(){
      return this.variant 
      || DEFAULT_PROVIDERS[this.myPartner]?.variant
      || DEFAULT_PROVIDERS[this.myProvider]?.variant || this.myProvider  || "evening"
    },
    myIcon(){
      return this.icon || DEFAULT_PROVIDERS[this.myProvider]?.icon || this.myProvider  || ("fab fa-" + this.myProvider);
    },
    myStatusIcon(){
      return  DEFAULT_PROVIDERS[this.status]?.icon || this.status  || ("fab fa-" + this.status);
    },
    myStatusVariant(){
      return DEFAULT_PROVIDERS[this.status]?.variant || this.status  || "evening"
    },
    tag(){
      return this.href ? 'a' : 'span'
    }
  },
  methods: {
    onClick(e){
      if(this.path){
          console.log("this.path",this.path)
          this.$router.push( this.path)
      } else if(this.link){
          console.log("this.link",this.link)
          window.open(this.link,'_blank');
      } else if(this.reload){
          console.log("this.reload",this.reload)
          this.$router.push({ name : "reload", params : {
            reload : btoa(this.reload),
          }});
      } else if(this.goto){
          window.fullloader.busy(this.$attrs.title || true);
          let iframe = document.createElement('a');
          iframe.setAttribute('href', this.goto);
          document.body.appendChild(iframe);
          iframe.click();
      }
      this.$emit('click',e);
    }
  },
  components: {
  },
};
</script>
<style lang="scss">
.social-btn  {
  cursor : pointer;
  position: relative;
  display: inline-block;
}


.social-btn2  {
  cursor : pointer;
  position: relative;
  display: inline-block;
  width: 30px !important;
  height: 30px !important;
  border-left: ridge;
}
.social-btn .social-btn-box {
    position: relative;
}
.social-btn .social-btn-box,
.social-btn .social-btn-box:before,
.social-btn .social-btn-box .social-btn-icon {
  transition: all 0.35s;
  transition-timing-function: cubic-bezier(0.31, -0.105, 0.43, 1.59);
}
.social-btn .social-btn-box:before {
  top: 90%;
  left: -110%;
}
.social-btn .social-btn-box .social-btn-icon {
  transform: scale(0.8);
}

.social-btn .social-btn-box:focus:before,
.social-btn .social-btn-box:hover:before {
  top: -10%;
  left: -10%;
}
.social-btn .social-btn-box:focus .social-btn-icon,
.social-btn .social-btn-box:hover .social-btn-icon
{
  color: #fff;
  transform: scale(1);
}
.social-btn .social-btn-box:focus .social-btn-icon::before ,
.social-btn .social-btn-box:hover .social-btn-icon::before  {
    background: #FFF;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.social-btn .social-btn-box {
  display: inline-block;
  background-color: #fff;
  width: 50px;
  height: 50px;
  line-height: 50px;
  margin: 5px 5px;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 5px 15px -5px rgba(0,0,0,0.1);
  opacity: 0.99;
}
.social-btn .social-btn-box:before {
  content: '';
  width: 120%;
  height: 120%;
  position: absolute;
  transform: rotate(45deg);
}
.social-btn .social-btn-box .social-btn-icon {
  font-size: 38px;
  vertical-align: middle;
}
.social-btn-box.size-sm {
    width: 25px;
    height: 25px;
    line-height: 25px;
    margin: 3px 3px;
    .social-btn-icon {
      font-size: 20px;
    }
}
.social-btn-box.size-xs {
    width: 15px;
    height: 15px;
    line-height: 15px;
    margin: 0px 0px;
    .social-btn-icon {
      font-size: 15px;
    }
}
.social-btn .social-btn-status {
    font-size: 0.7rem;
    background-color: #616161;
    border-radius: 50%;
    position: absolute;
    right: 4%;
    bottom: 4%;
    padding: 3px;
    color: #fff;
}
</style>
