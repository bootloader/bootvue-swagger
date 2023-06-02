<template>
  <div class="social-tile pointer" @click="onClick" >
    <span class="social-tile-inner" :class="innerClass">
      <slot name="thumb">
            <social-icon  :provider="provider" :variant="variant" :status="status"></social-icon>
      </slot>
      <slot name="details">
        <span class="social-tile-inner-desc" :class="'text-'+variant">
          <div class="social-tile-inner-desc-title"> {{title}}&nbsp;</div>
          <div class="social-tile-inner-desc-subtitle"> {{subtitle}} </div>
        </span>
      </slot>
    </span> 
  </div>
</template>
<script>
export default {
  props : {
    title : {}, subtitle : {},provider : {}, path : {}, link : {}, variant : {}, 
    status : { }, innerClass : {}
  },
  data() {
    return {
      navbarOpen: false,
    };
  },
  computed : {
  },
  methods: {
    onClick(e){
      if(this.path){
        console.log("this.path",this.path)
          this.$router.push( this.path)
      } else if(this.link){
           window.open(this.link,'_blank');
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
      .social-tile-inner-desc-title {
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        height: 25px;
        white-space: nowrap;
        font-size: .9rem;
      }
      .social-tile-inner-desc-subtitle {
        font-size: .8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        height: 25px;
        white-space: nowrap;
      }
    }
  }
}
</style>
