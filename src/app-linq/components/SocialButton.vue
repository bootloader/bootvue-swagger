<template>
    <social-tile class="social-button" :title="title" :subtitle="subtitle" :variant="variant"
      :innerClass="`bg-light bg-${variant}`" @click="safeclick" 
      :class="[loading ? 'opacity-5' : '']"> 
        <template #thumb>
          <social-icon :icon="myicon" :variant="variant"></social-icon>
        </template>  
    </social-tile>
</template>
<script>
export default {
  props : {
    title : {}, subtitle : {},provider : {}, path : {}, variant : {}, 
    status : { },icon : {},
    onSafeclick : {
        type: Function,
        required: false // this is up to you
    }
  },
  data() {
    return {
      loading : false,
    };
  },
  computed : {
    myicon(){
      return this.loading ? 'fa fa-refresh fa-spin' : this.icon;
    }
  },
  methods: {
    onClick(e){
      if(this.path){
        console.log("this.path",this.path)
        this.$router.push( this.path)
      }
      this.$emit('click',e);
    },
    async safeclick(e){
        console.log("safeclick enter");
        try {
            if(this.onSafeclick){
                this.loading = true;
                await this.onSafeclick(e);
            }
            if(this.$listeners && this.$listeners.click){
                this.loading = true;
                await this.$listeners.click(e)
            }
        } finally {
            this.loading = false;
        }
        this.onClick(e);
        console.log("safeclick exit"); 
    }
  },
  components: {
  },
};
</script>
<style lang="scss">
.social-button{
  .social-tile-inner {
    background: #d1d1d167;
  }
}
</style>
