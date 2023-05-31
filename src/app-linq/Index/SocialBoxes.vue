<template>
    <div class="">
        <div class="social-tile-container">
            <social-tile class="w-full lg:w-4/12 "
              v-for="(c,index) in channelsEnabled" v-bind:key="c.channelId+'_'+ index"
              :title="c.title"  :subtitle="c.subtitle" :provider="c.provider"
              :link="c.link"> 
            </social-tile>
        </div>
        <div class="social-tile-container" v-if="allowadd">
            <span class="display-inline-block ">
                <social-tile class="w-full">
                  <template #thumb>
                      <social-icon  provider="google" variant="grey" title="Link Google" addsign
                        :href="`/linq/app/v1/connect/google?_${nounce}`"  />
                  </template>   
                    <template #details>
                      <social-icon provider="linkedin" variant="grey" title="Link LinkedIn" addsign
                        :href="`/linq/app/v1/connect/linkedin?_${nounce}`"  />
                      <social-icon provider="facebook" variant="grey"  title="Link Facebook"  addsign
                      :href="`/linq/app/v1/connect/facebook?_${nounce}`"/>
                      <social-icon provider="outlook" variant="grey"  title="Link Outlook" addsign
                      :href="`/linq/app/v1/connect/outlook?_${nounce}`"/>
                      <social-icon provider="mobile" variant="grey"  title="Link Mobile" addsign
                      :href="`/linq/app/v1/connect/mobile?_${nounce}`"/>
                      <social-icon provider="whatsapp" variant="grey"  title="Link WhatsApp"  addsign
                      :href="`/linq/app/v1/connect/whatsapp?_${nounce}`"/>
                    </template> 
                </social-tile>
            </span>  
        </div>
    </div>    
</template>
<script>
import mixin from '../mixin.js'

export default {
  mixins : [mixin],
  components: {  },
    props : {
        items : {
        },
        allowadd : {
          type : Boolean
        }
    },
    data (){
      return {
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
