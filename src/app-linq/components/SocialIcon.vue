<template>
  <span class="social-btn" @click="onClick">
      <component :is="tag" :href="href"
          class="social-btn-box" :class="[ provider ,`bg-${myVariant}:before`]">
          <i class="social-btn-icon" :class="[ myIcon, `text-${myVariant}`]"></i>
      </component>
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
}

export default {
  props : {
    provider : {
    }, href : {
      default : ""
    }, variant : {
    }, icon : {
    },path : {
    },
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
    myVariant(){
      return this.variant || DEFAULT_PROVIDERS[this.provider]?.variant || this.provider  || "grey"
    },
    myIcon(){
      return this.icon || DEFAULT_PROVIDERS[this.provider]?.icon || this.provider  || ("fab fa-" + this.provider);
    },
    tag(){
      return this.href ? 'a' : 'span'
    }
  },
  methods: {
    onClick(e){
      if(this.path){
        this.$router.push( this.path)
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
  cursor: pointer;
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
  border-radius: 28%;
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

</style>
