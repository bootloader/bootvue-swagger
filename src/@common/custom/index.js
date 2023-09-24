import MyUpload from "@/@common/custom/components/MyUpload.vue";

import ImageKit from "imagekitio-vue"

const customOptions = {

};
// we need our modal component
const CustomPlugin = {
  // every plugin for Vue.js needs install method
  // this method will run after Vue.use(<your-plugin-here>) is executed
  install(Vue, options) {
    let component = {
      MyUpload
    }
    for(let name in component){
      Vue.component(name, component[name]);
    }
    if(options.imagekit || options.imageKit){
      let imageKitOptions = {
        ... options.imagekit || {},
        ... options.imageKit || {}
      };
      customOptions.imagekit = imageKitOptions;
      Vue.use(ImageKit,imageKitOptions);
    }
  },
  customOptions(){
    return customOptions;
  }
}

export default CustomPlugin