<template>
    <modal-selector :options="options" 
          :type="type" :title="title"
            ref="global_app_modal"
           v-model="selected"
           @change="onSelect"
           @cancel="onCancel"
           >
    </modal-selector>
</template>
<script>
import PromptPlugin from './prompt.js';

export default {
  data() {
    return {
      // variable that shows/hides modal
      type  : "select",
      title: '',
      text: '',
      value : '',
      options : [],
      selected : {},
    }
  },
  methods: {
    select({options}) {
      this.options = options;
      this.$refs.global_app_modal.prompt({options});
    },
    input(params) {
      this.options = params.options;
      this.type = params.type;
      this.title = params.title;
      setTimeout(()=>{
        this.$refs.global_app_modal.prompt(params);
      })
    },
    form(params) {
      this.options = params.options;
      this.type = params.type;
      this.title = params.title;
      setTimeout(()=>{
        this.$refs.global_app_modal.prompt(params);
      })
    },
    alert({message,config}) {
        this.$bvModal.msgBoxOk(message, {
          title: 'Confirmation',
          size: 'sm', buttonSize: 'sm',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true,
           ...config
        }).then(value => {
           this.onResolve(value);
        }).catch(err => {
            this.onCancel(err);
        })
    },
    confirm({message,config}) {
        this.$bvModal.msgBoxConfirm(message, {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true,
           ...config
        }).then(value => {
            if(value == true){
                this.onResolve(value);
            } else {
                this.onReject("NO");
            }
        }).catch(err => {
           this.onCancel(err);
        })
    },
    onSelect(option){
      //console.log("Prompt:onSelect",option);
      setTimeout(()=>{
        PromptPlugin.resolve(this.$refs.global_app_modal.selected());
      })
    },
    onCancel(err){
      console.log("Prompt:onCancel");
      setTimeout(()=>{
        PromptPlugin.reject( err || "Cancelled");
      })
    },
    onResolve(a){
      setTimeout(()=>{
        PromptPlugin.resolve(a);
      })
    },
    onReject(a){
      setTimeout(()=>{
        PromptPlugin.reject(a || "Rejected");
      })
    }
  },
  beforeMount() {
      // here we need to listen for emited events
      // we declared those events inside our plugin
      PromptPlugin.isGlobalMounted = true;
      PromptPlugin.EventBus.$on('show', (params) => {
          if(this[params.type]){
            this[params.type](params)
          }
      })
  }
}
</script>