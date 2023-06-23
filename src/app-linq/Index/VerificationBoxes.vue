<template>
    <div class="">
        <div class="social-tile-container">
            <social-tile class="w-full lg:w-4/12 pointer" 
              v-for="(c,index) in channelsEnabled" v-bind:key="c.channelId+'_'+ index"
              :title="c.title"  :subtitle="c.subtitle" :provider="c.provider" :path="c.path" :status="c.status"> 
              <!-- <template #details>
                <span class="social-tile-inner-desc">
                  <div class="social-tile-inner-desc-title"> {{c.title}} </div>
                  <div class="social-tile-inner-desc-subtitle"> 
                    {{c.subtitle}} 
                  </div>
                </span>
              </template> -->
            </social-tile>
        </div>
        <div class="social-tile-container">
            <span class="w-full lg:w-4/12 display-inline-block">
                <social-tile class="w-full" path="/app/verification/create"
                        title="Create New"
                        subtitle="Membership Program" >
                  <template #thumb>
                      <social-icon provider="plus" icon="fa fa-plus" variant="grey"
                        />
                  </template>   
                </social-tile> 
            </span>  
        </div>
    </div>    
</template>
<script>

export default {
  components: {  },
    props : {
        items : {
        },
        loading : {
          type : Boolean,
          default : true
        }
    },
    computed : {
        channelsEnabled(){
          if(this.loading){
            return [0,1,2].map(()=> { return { title : '...', subtitle : '...'} })
          } 
          return this.items.filter((c)=>!c.disabled && c.contactType!='WEBSITE');
        }
    }

};
</script>
<style lang="scss" scoped>
  .display-inline-block {
    display: inline-block;
  }
</style>
