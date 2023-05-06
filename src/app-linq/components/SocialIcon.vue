<template>
  <span class="social-btn">
      <a :href="href"
          class="btn" :class="[ provider ,`bg-${myVariant}:before`]">
          <i class="icon" :class="[ myIcon, `text-${myVariant}`]"></i>
      </a>
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
}

export default {
  props : {
    provider : {
    }, href : {
      default : "#"
    }, variant : {
    }, icon : {
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
      return this.variant || DEFAULT_PROVIDERS[this.provider].variant || this.provider  || "grey"
    },
    myIcon(){
      return this.icon || DEFAULT_PROVIDERS[this.provider]?.icon || this.provider  || ("fab fa-" + this.provider);
    }
  },
  methods: {
  },
  components: {
  },
};
</script>
<style lang="scss">

.social-btn .btn,
.social-btn .btn:before,
.social-btn .btn .icon {
  transition: all 0.35s;
  transition-timing-function: cubic-bezier(0.31, -0.105, 0.43, 1.59);
}
.social-btn .btn:before {
  top: 90%;
  left: -110%;
}
.social-btn .btn .icon {
  transform: scale(0.8);
}

.social-btn .btn:focus:before,
.social-btn .btn:hover:before {
  top: -10%;
  left: -10%;
}
.social-btn .btn:focus .icon,
.social-btn .btn:hover .icon
{
  color: #fff;
  transform: scale(1);
}
.social-btn .btn:focus .icon::before ,
.social-btn .btn:hover .icon::before  {
    background: #FFF;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.social-btn .btn {
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
.social-btn .btn:before {
  content: '';
  width: 120%;
  height: 120%;
  position: absolute;
  transform: rotate(45deg);
}
.social-btn .btn .icon {
  font-size: 38px;
  vertical-align: middle;
}

</style>
