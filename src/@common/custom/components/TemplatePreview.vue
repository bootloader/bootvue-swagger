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

      <div class="message-preview w-100" :class="local_format" v-if="templateConfig">
          <span v-if="format=='WHATSAPP'">  
            <div class="message-text">
              <div v-if="content.formatType == 'VIDEO' 
                        || content.formatType == 'IMAGE' 
                        || content.formatType == 'DOCUMENT'"
                :class="['message-attachment-inline','attachment-'+content.formatType]">
                <div v-if="headerMedia"
                  :class="['message-attachment-inline-original','attachment-'+headerMedia.mediaType]"
                > 
                  <my-media style="max-height:150px" v-if="headerMedia.mediaURL"
                  :src="headerMedia.mediaURL"
                  :auto="autoplay" width="100%" height="200px"
                  />
                </div>
              </div> 
              <div v-if="content.header" class="message-title">{{content.header}}</div>
              <div class="message-body" :inner-html.prop="content.text | waMarkDown"></div>
              <div class="message-footer">{{templateConfig.footer}}</div>
            </div>
            <div class="message-buttons" v-if="content.options">
               <span v-if="content.options.is_list || (content.options.buttons.length>3)">
                  <div class="message-button list-style" v-for="(button,key) in content.options.buttons" v-bind:key="key">
                      <div class="mb-0">{{button.label}}</div>
                      <small class="text-grey">{{button.desc}}</small><input class="text-right float-right" name="list-option" type="radio"/>
                  </div>
                  <div class="message-button">
                      <i class="fa fa-list-ul">&nbsp;</i>
                        {{content.options.list_option_title || 'Menu'}}
                  </div>
               </span>
               <span v-else>
                  <div class="message-button" v-for="(button,key) in content.options.buttons" v-bind:key="key">
                    <i v-if="button.type=='URL'" class="fa fa-external-link-alt">&nbsp;</i>
                    <i v-if="button.type=='PHONE_NUMBER'" class="fa fa-phone-alt">&nbsp;</i>{{button.label}}
                  </div>
               </span> 
            </div>
          </span>
          <span v-else>   
            <div class="message-text">
              <div v-if="content.header" class="message-title">{{content.header}}</div>
              <div>{{content.text}}</div>
            </div>
            <div class="message-buttons" v-if="content.options">
                <div class="message-button" v-for="(button,key) in content.options.buttons" v-bind:key="key">
                  <i v-if="button.type=='URL'" class="fa fa-external-link-alt"/>{{button.label}}
                </div>
            </div>
          </span>
      </div>
      
    </div>
</template>

<script>

  import formatters from '../../../services/formatters';
  import mustache from 'mustache';
  import MyVSelect from './MyVSelect.vue'
  import {waMarkDown} from '@/@common/utils/WABATmpl';

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
          templateConfig : null
        };
    },
    computed : {
      content (){
        if(!this.templateConfig){
          return {
            text : "", options : {}
          };
        }
        var contentStr = this.templateConfig.template;
        var headerStr  = this.templateConfig.header || this.templateConfig.title;
        try {
          let model = Object.assign(sampleJson,{
                data :  this?.model?.data || Object.assign({},
                          sampleJson.data,
                          this.templateConfig?.model?.data || {},
                          this.templateConfig?.data),
                contact : this?.model?.contact || Object.assign({},
                            sampleJson.contact,
                            this.templateConfig?.model?.contact || {},
                            this.templateConfig?.contact)
          });
          contentStr = mustache.render(this.templateConfig.template,model);
          headerStr = mustache.render(headerStr, model);
        } catch (e) {
          //console.error(e);
        }
        var contentArray = (contentStr || "").split('---options---');
        let templateOptions = formatters.message_form_options(formatters.map_from_string(contentArray[1]));
        return  {
          text : contentArray[0],
          header : headerStr,
          formatType : this.templateConfig?.formatType,
          options : Object.assign({},
            templateOptions,
            this.templateConfig.options,{
              buttons : (templateOptions?.buttons || []).concat(this.templateConfig?.options?.buttons || [])
            }
          )
        }
      },
      options (){

      },
      headerMedia(){
        return this.templateConfig?.attachments?.[0] || this.templateConfig.options?.attachment;
      },
      local_format(){
        return this.format || 'WHATSAPP';
      }
    },
    
    mounted : function(){
      this.templateConfig = this.template
    },
    methods: {
      clickAction: function () {
 
      },
      optionReady: function(option){
        console.log("Option",option)
        if(option){
          this.templateConfig = option.item;
        }
      },
    },
    filters : {
      waMarkDown(textRef) {
        return waMarkDown(textRef);
      }
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
        },
        model : {
        },
        autoplay : {
          type : Boolean,
          default : false
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

          .message-title {
            font-weight: bold;
            font-size: 15px;
            padding: 6px 7px 0 9px;
            color: rgba(0, 0, 0, .76);
            line-height: 19px;
          }
          .message-attachment-inline {
            width: 100%;
            min-height: 150px;
            background-color: #ccd0d5;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 80px 80px;
            border-radius: 4px;
            box-sizing: border-box;
            
            &.attachment-IMAGE {
                background-image: url('~@/assets/images/placeholder-img.png');
            }
            &.attachment-VIDEO {
                background-image: url('~@/assets/images/placeholder-vdo.png');
            }
            &.attachment-DOCUMENT {
                background-image: url('~@/assets/images/placeholder-doc.png');
            }
          }
          .message-attachment-inline-original {
            max-height: 200px;
            overflow: hidden;
          }

          .message-body {
            color: #282828;
            font-size: 13.6px;
            white-space: pre-wrap;
            padding : 7px 7px 6px 9px;
          }
          .message-footer {
            color: rgba(0, 0, 0, .45);
            font-size: 13px;
            line-height: 17px;
            padding: 0 7px 8px 9px;
          }

        white-space: pre-wrap;
        
        background: #ffffff;
        /* background: black; */
        /* border-radius: 0px 5px 5px 5px; */
        border-radius: 7.7px 7.5px 7.5px 7.5px;

        box-shadow: 0 1px 0.5px #00000026;

        font-size: 13.6px;
        line-height: 19px;

        padding: 4px 4px 4px 4px !important;

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

        &.list-style {
          text-align: left;
          height: 54px;
          line-height: 25px;
          border-radius: 0px;
          margin-top: 1px;
          &:first-of-type{
            border-radius: 7.5px 7.5px 0px 0px;
          }
        }
      }
    }

}
</style>
