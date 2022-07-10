<template>
    <div>

        <div v-if="isStrip" class="social-links text-center">
            <span v-for="(c,index) in channelsEnabled" v-bind:key="c.channelId+'_'+ index"
                class="lg:w-4/12 font-bold uppercase px-4 py-4 rounded text-white social-link">
                <a v-if="c.contactType == 'TWITTER'" :href="$global.MyDict.c2cUrl(c)">
                    <i class="fab fa-twitter"/>
                    <span class="bg-twitter ">{{c.twitter.handler}}</span>
                </a>
                <a v-if="c.contactType == 'FACEBOOK'" :href="$global.MyDict.c2cUrl(c)">
                    <i class="fab fa-facebook-f"/>
                    <span class="bg-facebook"> {{c.facebook.page || c.facebook.handler || c.lane}}</span>
                </a>
                <a v-if="c.contactType == 'INSTAGRAM'"  :href="$global.MyDict.c2cUrl(c)">
                    <i class="fab fa-instagram"/>
                    <span class="bg-instagram" >{{c.instagram.handler || c.name}}</span>
                </a>
                <a v-if="c.contactType == 'TELEGRAM'"  :href="$global.MyDict.c2cUrl(c)">
                    <i class="fab fa-telegram-plane"/>
                    <span class="bg-telegram">{{c.telegram.handler || c.lane || c.name}}</span>
                </a>
                <a v-if="c.contactType == 'WHATSAPP'" :href="$global.MyDict.c2cUrl(c)">
                    <i class="fab fa-whatsapp"/><span class="bg-whatsapp-dull">{{c.lane}}</span>
                </a>
            </span>
        </div>

        <div v-else class="social-btns">
            <span v-for="(c,index) in channelsEnabled" v-bind:key="c.channelId+'_'+ index"> 
                <a  v-if="c.contactType == 'FACEBOOK'" :href="$global.MyDict.c2cUrl(c)" 
                    class="btn facebook bg-facebook:before">
                    <i class="icon fab fa-facebook-f text-facebook"></i></a>
                <a v-if="c.contactType == 'TWITTER'" :href="$global.MyDict.c2cUrl(c)"
                    class="btn twitter bg-twitter:before">
                    <i class="icon fab fa-twitter text-twitter"></i></a>
                <a v-if="c.contactType == 'WHATSAPP'" :href="$global.MyDict.c2cUrl(c)"
                    class="btn whatsapp bg-whatsapp:before">
                    <i class="icon fab fa-whatsapp text-whatsapp"></i></a>
                <a v-if="c.contactType == 'TELEGRAM'"  :href="$global.MyDict.c2cUrl(c)"
                    class="btn telegram bg-telegram:before">
                    <i class="icon fab fa-telegram-plane text-telegram"></i></a>
                <a v-if="c.contactType == 'INSTAGRAM'"  :href="$global.MyDict.c2cUrl(c)"
                    class="btn instagram bg-instagram:before">
                    <i class="icon fab fa-instagram text-instagram"></i>
                </a>
            </span>
        </div>



    </div>    




</template>
<script>

export default {
    props : {
        channels : {

        },
        strips : {
            type: Boolean,
        }   
    },
    computed : {
        isStrip : function (params) {
            //return this.strips ? true : (Math.round(Math.random()*1) == 0)
            return true;
        },
        channelsEnabled(){
          return this.channels.filter((c)=>!c.disabled && c.contactType!='WEBSITE');
        }
    }

};
</script>
<style lang="scss" scoped>

.social-btns .btn,
.social-btns .btn:before,
.social-btns .btn .icon {
  transition: all 0.35s;
  transition-timing-function: cubic-bezier(0.31, -0.105, 0.43, 1.59);
}
.social-btns .btn:before {
  top: 90%;
  left: -110%;
}
.social-btns .btn .icon {
  transform: scale(0.8);
}

.social-btns .btn:focus:before,
.social-btns .btn:hover:before {
  top: -10%;
  left: -10%;
}
.social-btns .btn:focus .icon,
.social-btns .btn:hover .icon
{
  color: #fff;
  transform: scale(1);
}
.social-btns .btn:focus .icon::before ,
.social-btns .btn:hover .icon::before  {
    background: #FFF;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.social-btns {
  margin: auto;
  font-size: 0;
  text-align: center;
  left: 0;
  right: 0;
}
.social-btns .btn {
  display: inline-block;
  background-color: #fff;
  width: 90px;
  height: 90px;
  line-height: 90px;
  margin: 10px 10px;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-radius: 28%;
  box-shadow: 0 5px 15px -5px rgba(0,0,0,0.1);
  opacity: 0.99;
}
.social-btns .btn:before {
  content: '';
  width: 120%;
  height: 120%;
  position: absolute;
  transform: rotate(45deg);
}
.social-btns .btn .icon {
  font-size: 38px;
  vertical-align: middle;
}

.social-link>a{
  clear:both;
  white-space:nowrap;
  font-size:.8em;
  display:inline-block;
  border-radius:5px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.35);
  margin:2px;
  -webkit-transition:all .5s;
  -moz-transition:all .5s;
  transition:all .5s;
  overflow:hidden;

    &:hover {
      box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.45);
    }
    &:focus {
      box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.4);
    }
    &>span,
    &>i {
      float:left;
      padding:13px;
      -webkit-transition:all .5s;
      -moz-transition:all .5s;
      transition:all .5s;
      line-height:1em
    }

    &>span {
      padding:14px 18px 16px;
      white-space:nowrap;
      color:#FFF;
    }
    &:focus > span {
      background:#9a9a9a
    }

    &>i {
      border-radius:5px 0 0 5px;
      position:relative;
      width:35px;
      text-align:center;
      font-size:1.25em;
      color:#fff;
      background:#212121
    }
    &>i:after {
      content:"";
      border:8px solid;
      border-color:transparent transparent transparent #222;
      position:absolute;
      top:13px;
      right:-15px
    }

    &:hover > i,
    &:focus > i {
      color:#FFF;
      width:40px;
    }
    &>span {
      border-radius:0 5px 5px 0
    }

}

</style>
