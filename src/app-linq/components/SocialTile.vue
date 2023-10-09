<template>
  <div class="social-tile pointer" @click="onClick" >
    <span class="social-tile-inner" :class="innerClass">
      <slot name="thumb">
          <social-icon v-if="!nothumb" :provider="provider" :partner="partner" 
              :variant="variant" :status="status" :icon="icon" :imgSrc="imgSrc"></social-icon>
      </slot>
      <slot name="details">
        <span class="social-tile-inner-desc" :class="'text-'+variant">
          <span class="social-tile-inner-desc-wrapper">
              <span class="social-tile-inner-desc-left">
                <div class="social-tile-inner-desc-title" v-if="title"> {{title}}&nbsp;</div>
                <div class="social-tile-inner-desc-title" v-if="subtitle"> {{subtitle}} </div>
                <div class="social-tile-inner-desc-title" v-if="subsubtitle"> {{subsubtitle}} </div>
              </span>
              <span v-if="is_link" class="social-tile-inner-desc-right">
                  <i class="fas fa-arrow-right"/>
              </span>
          </span>  
        </span>
      </slot>
    </span> 
  </div>
</template>
<script>
export default {
  props : {
    title : {}, subtitle : {}, subsubtitle : {},provider : {}, partner : {},
    path : {},  link : {}, reload : {}, goto : {}, 
    icon : {}, variant : {}, imgSrc : {}, 
    status : { }, innerClass : {}, nothumb : { type : Boolean, default : false}
  },
  data() {
    return {
      navbarOpen: false,
    };
  },
  computed : {
    is_link(){
      return this.path || this.link || this.reload || this.goto;
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
          window.fullloader.busy();
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
.social-tile {
  display: inline-block;
  padding: 5px 5px;
  text-align: left;

  .social-tile-inner {
    display: inline-block;
    background: #d1d1d167;
    border-radius: 30px;
    padding: 3px;
    width: 100%;
    .social-tile-inner-desc {
      font-size: 1rem;
      color: #4f4f4fbd;
      text-align: left;
      float: right;
      display: block;
      height: 10px;
      min-width: 50px;
      min-height: 50px;
      width: calc( 100% - 70px);
      margin: 5px 5px 5px 0px;

      .social-tile-inner-desc-wrapper {
          display: flex;
          justify-content: space-between;
          .social-tile-inner-desc-left {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .social-tile-inner-desc-right {
            padding: 5px;
            line-height: 40px;
          }
      }

      .social-tile-inner-desc-title:first-child {
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        height: 25px;
        white-space: nowrap;
        font-size: .9rem;
        line-height: 1.5rem;
        margin-bottom: -0.4rem;
      }
      .social-tile-inner-desc-title+.social-tile-inner-desc-title {
        font-size: .75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        height: 20px;
        white-space: nowrap;
      }
      .social-tile-inner-desc-title+.social-tile-inner-desc-title+.social-tile-inner-desc-title{
         font-size: .6rem;
         line-height: 0.5rem;
      }
    }
  }
}
</style>
