// we need our modal component
import PromptModal from './Prompt.vue'

const PromptPlugin = {
  // every plugin for Vue.js needs install method
  // this method will run after Vue.use(<your-plugin-here>) is executed
  install(Vue, options) {
    // We must create new Eventbus
    // which is just another Vue instance that will be listening for and emiting events from our main instance 
    // this EventBus will be available as Modal.EventBus
    this.EventBus = new Vue();
    this.isGlobalMounted = false;
    
    // making our modal component global
    Vue.component('Prompt', PromptModal)
    // exposing global $modal object with method show()
    // method show() takes object params as argument
    // inside this object we can have modal title, text, styles... and also our callback confirm function
    Vue.prototype.$prompt = {
      show(params){
        console.log("params",params)
        if(!PromptPlugin.isGlobalMounted){
          throw "GlobalPrompt is Not Mounted. Add   <Prompt/> in any global vue"
        }
        PromptPlugin.EventBus.$emit("show",params);
        return new Promise(function(resolve,reject){
          PromptPlugin.resolve = resolve;
          PromptPlugin.reject = reject;
        });
      },
      select(options,config) {
        return this.show({
          type : "select", options,config
        });
      },
      confirm(message,config) {
        return this.show({
          type : "confirm", message,config
        });
      },
      alert(message,config) {
        return this.show({
          type : "alert", message,config
        });
      }
    }
  }
}

export default PromptPlugin