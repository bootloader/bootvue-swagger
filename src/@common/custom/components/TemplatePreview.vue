<template>
    <div>
      <MyVSelect hidden v-if="templateId"
            ref="channelSelect"
            :options="src"
             v-bind="$attrs"
            class="w-100 text-black"
            style="min-width: 220px"
            v-model="templateId"
            :searchable="false"
            :clearable="true"
            placeholder="Select Template" 
            @option="optionReady"
            @input="clickAction">
      </MyVSelect>

      <div class="message-preview w-100" :class="format" v-if="templateConfig" >
            <div class="message-text">{{content.text}}</div>
            <div class="message-buttons" v-if="content.options">
                <div class="message-button" v-for="(button,key) in content.options.buttons">
                {{button.label}}
                </div>
            </div>
      </div>
    </div>
</template>

<script>

  import formatters from '../../../services/formatters';
  import mustache from 'mustache';
  import MyVSelect from './MyVSelect.vue'

  var sampleJson = {
    contact : {
      name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
    }
  };

 export default {
    name: "MessagePreview",
    components : {MyVSelect},
    data() {
        return {
          templateConfig : null,
          model : {
            
          }
        };
    },
    computed : {
      content (){
        if(!this.templateConfig){
          return {
            text : "",options : []
          };
        }
        var contentStr = this.templateConfig.template;
        try {
          contentStr = mustache.render(this.templateConfig.template, Object.assign(sampleJson,{
              data : this.templateConfig.data
          }));
        } catch (e) {
          //console.error(e);
        }
        var contentArray = (contentStr || "").split('---options---');
        return  {
          text : contentArray[0],
          options : formatters.message_form_options(formatters.map_from_string(contentArray[1]))
        }
      },
      options (){

      }
    },
    
    mounted : function(){
      this.templateConfig = this.template
    },
    methods: {
      clickAction: function () {
          let value = this.model.value;
          this.$emit("input", value);
          this.$emit("change", value);
      },
      optionReady: function(option){
        console.log("Option",option)
        if(option){
          this.templateConfig = option.item;
        }
      },
    },
    props: {
        icon: String,
        heading: String,
        subheading: String,
        actions : Array,
        template : {
            type: Object
        },
        templateId : {
            type: String
        },
        src : {
          type: String, default : "getx:/api/options/tmpl/hsm"
        },
        format : {
          type: String, default : "WHATSAPP"
        }
    },
    watch : {
      template : function(){
          this.templateConfig = this.template
      }
    },
 }
</script>
<style lang="scss">
  .message-preview {

     padding: 5px;

    .message-text {
        padding: 7px 6px 8px 9px !important;
        white-space: pre-wrap;
        background: #ffffff;
        box-shadow: 0 1px 0.5px #00000026;
        border-radius: 7.7px 7.5px 7.5px 7.5px;
    }

    .message-button {
        background-color: #fff;
        border-radius: 7.5px;
        box-shadow: 0 1px 0.5px #00000026;
        box-sizing: border-box;
        flex-grow: 1;
        min-width: calc(33% - 5px);
        text-align: center;
        color: #00a5f4;
        font-size: 14px;
        height: 34px;
        line-height: 34px;
        padding: 0 1px;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: sans-serif !important;
    }

    &.COMMON {
      .message-text {
        border-radius: 7px;
        background-color: #FFF;
        padding: 6px;
        font-size: 14px;
        box-shadow: 0 1.5px 1.5px #00000052;
        margin: 1px 1px;
      }
      .message-buttons {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .message-button {
            display: inline-block;
            margin: 1px 1px;
            flex: 1; 
            font-size: 14px;
            border-radius: 7px;
            background-color: #FFF;
            box-shadow: 0 1.5px 1.5px #00000052;
          }
      }

    }

    &.WHATSAPP{
      background: #e5ddd5;
      padding: 16px;
      .message-text {
        white-space: pre-wrap;
        
        background: #ffffff;
        /* background: black; */
        /* border-radius: 0px 5px 5px 5px; */
        border-radius: 7.7px 7.5px 7.5px 7.5px;

        box-shadow: 0 1px 0.5px #00000026;

        font-size: 13.6px;
        line-height: 19px;

        padding: 7px 6px 8px 9px !important;

        position: relative;

        font-family: Roboto !important;
        font-family: sans-serif !important;
        letter-spacing: .2px;
        font-weight: normal;
        margin: 0.1em;
        margin-bottom: 0;
        font-size: 0.98rem;
        font-size: 0.95rem;
        font-size: 12px !important;




      }
      .message-button {

        background-color: #fff;
        border-radius: 7.5px;
        box-shadow: 0 1px 0.5px #00000026;
        box-sizing: border-box;
        flex-grow: 1;
        min-width: calc(50% - 2px);
        text-align: center;
        /* font-family: sans-serif !important; */
        /* border: 1px solid black; */
        margin-top: 2px;
        /* display: inline-block; */
        /* float: left; */
        color: #00a5f4;
        font-size: 14px;
        height: 34px;
        line-height: 34px;
        padding: 0 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: sans-serif !important;

      }
    }

}
</style>
