<template>
    <div class="message-preview WHATSAPP w-100" v-if="template" >
          <div class="message-text">{{content.text}}</div>
          <div class="message-buttons" v-if="content.options">
              <div class="message-button" v-for="(button,key) in content.options.buttons">
              {{button.label}}
              </div>
          </div>
    </div>
</template>

<script>

  import { MyFlags,MyDict,MyConst } from './../../services/global';
  import formatters from './../../services/formatters';
  import mustache from 'mustache';

  var sampleJson = {
    contact : {
      name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
    }
  };

 export default {
    name: "MessagePreview",
    data() {
        return {
        
        };
    },
    computed : {
      content (){
        var contentStr = this.template.template;
        try {
          contentStr = mustache.render(this.template.template, Object.assign(sampleJson,{
              data : this.template.data
          }));
        } catch (e) {
          //console.error(e);
        }
        var contentArray = contentStr.split('---options---');
        return  {
          text : contentArray[0],
          options : formatters.message_form_options(formatters.map_from_string(contentArray[1]))
        }
      },
      options (){

      }
    },
    methods: {

    },
    props: {
        icon: String,
        heading: String,
        subheading: String,
        actions : Array,
        template : {
            type: Object
        }
    }
 }
</script>
