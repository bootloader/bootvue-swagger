<template>
    <div class="">
        <div class="social-tile-container">
            <social-tile class="w-full lg:w-4/12"
              v-for="(c,index) in channelsEnabled" v-bind:key="c.channelId+'_'+ index"
              :title="c.title"  :subtitle="c.subtitle" :provider="c.provider"> 
            </social-tile>
        </div>
        <div class="social-tile-container" v-if="allowadd">
            <span class="w-full lg:w-4/12 display-inline-block">
                <social-tile class="w-full">
                  <template #thumb>
                      <social-icon provider="linkedin" variant="grey" v-tooltip="`Verify LinkedIn`"
                        href="/linq/app/v1/connect/linkedin"  />
                  </template>   
                    <template #details>
                      <social-icon provider="outlook" variant="grey"  v-tooltip="`Verify Outlook`" 
                      href="/linq/app/v1/connect/outlook"/>
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
        allowadd : {
          type : Boolean
        }
    },
    computed : {
        channelsEnabled(){
          return this.items?.filter((c)=>!c.disabled && c.contactType!='WEBSITE');
        }
    }

};
</script>
<style lang="scss" scoped>
  .display-inline-block {
    display: inline-block;
  }
</style>
