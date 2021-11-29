<template>
    <div class="m-tmpl-hsm-list">
        <page-title :heading=heading :subheading=subheading :icon=icon :actions=actions
          @action="onAction" ref="pageTitle" :actionShow="{
            'ADD_ITEM' : mode=='view',
            'CANCEL' : mode=='edit'
          }"></page-title>

          <b-card v-if="mode=='view'" title="" class="main-card mb-4">
            <b-table :striped=true
                     :bordered=true
                     :outlined=false
                     :small=true
                     :hover=true
                     :dark=false
                     :fixed=false
                     :foot-clone=false
                     :items="table.items"
                     :fields="table.fields"
                     :tbody-tr-class="rowClass">

                <template #cell(actions)="row">
                  <b-button size="sm" @click="deleteItem(row.item, row.index, $event.target)" variant="outline-primary">
                    <font-awesome-icon icon="trash" title="Delete"/>
                  </b-button>
                  &nbsp;
                  <b-button size="sm" cursor-pointer  :id="'template-details-'+ row.item.id " variant="outline-primary">
                    <span class="fa fa-eye" title="View" /> 
                  </b-button> 
                  <b-popover triggers="hover focus" :target="'template-details-'+ row.item.id"
                      custom-class="message-preview">
                      <template #default class="message-preview"> 
                          <div class="message-text">{{row.item.template}}</div>
                      </template>
                  </b-popover> 
                  &nbsp;
                 <b-button size="sm" cursor-pointer  :id="'template-info-'+ row.item.id " variant="outline-primary">
                    <span class="fa fa-info-circle" title="View" /> 
                  </b-button> 
                  <b-popover triggers="hover focus" :target="'template-info-'+ row.item.id"
                      custom-class="message-preview">
                      <template #default class="message-preview"> 
                         <b-input-group class="mt-3">
                          <b-input-group-prepend>
                              <b-button variant="outline-dark" size="sm" class="text-sm w-25px">
                               Code</b-button>
                          </b-input-group-prepend>
                          <b-form-input readonly size="sm"
                            :value="row.item.code"
                          ></b-form-input>
                          <b-input-group-append>
                            <b-button size="sm"
                              v-clipboard:copy="row.item.code" class="far fa-copy"
                              variant="outline-success"></b-button>
                          </b-input-group-append>
                        </b-input-group>

                        <b-input-group class="mt-3">
                          <b-input-group-prepend>
                              <b-button variant="outline-dark" size="sm" class="text-sm w-25px">
                               ID</b-button>
                          </b-input-group-prepend>
                          <b-form-input readonly size="sm"
                            :value="row.item.id"
                          ></b-form-input>
                          <b-input-group-append>
                            <b-button size="sm"
                              v-clipboard:copy="row.item.id" class="far fa-copy"
                              variant="outline-success"></b-button>
                          </b-input-group-append>
                        </b-input-group>

                      </template>
                  </b-popover> 
                  &nbsp;
                  <router-link tag="span" :to="'/app/admins/tmpl/pushtemplate/edit/' + row.item.id">
                    <b-button size="sm" @click="editItem(row.item, row.index, $event.target)"   v-tooltip="row.item.message" variant="outline-primary">
                         <span class="fa fa-edit" title="Edit"/>
                    </b-button>   
                  </router-link>
                  &nbsp;
                  <router-link tag="span" :to="'/app/admins/tmpl/wabatemplate/view/all?hsm=' + row.item.id">
                    <b-button size="sm" 
                          v-tooltip="'Submit for WABA apporval, required to push template message out of session'" variant="outline-primary">
                         <span class="fa fa-cloud-upload-alt" title="Submit"/>&nbsp;
                         <span class="fa fa-random" title="Submit"/>&nbsp;
                         <span class="fa fa-whatsapp" title="Submit"/>
                    </b-button>   
                  </router-link>

                </template>

            </b-table>
        </b-card>
          
        <b-card v-else-if="mode=='edit' && newItem" 
              :id="modelName" size="xl"
              @hidden="cancelItem">
                  <ValidationObserver ref="form" class="template-form">
                            <div class="position-relative form-group row">
                              
                              <base-input class="col-md-3" size="sm"
                                name="Grouping Category" placeholder="Grouping Category"
                                rules="required|max:20" required
                                v-model="newItem.category">
                              </base-input>

                              <BaseVSelect class="col-md-3" size="sm"
                                name="Message Type"
                                options="getx:/api/meta/message_types"
                                 v-model="newItem.meta.messageType"
                                 placeholder="Select Message Type">
                              </BaseVSelect>

                              <base-input class="col-md-6" size="sm"
                                name="Description" placeholder="Enter description"
                                rules="required|max:60" required
                                v-model="newItem.desc">
                              </base-input>

                            </div>

                            <div class="position-relative form-group row">

                              <base-input class="col-md-3" size="sm"
                                name="Template Code" placeholder="CREDIT_ALERT"
                                rules="required|max:60" required
                                v-model="newItem.code"
                                 @change="codeOnChange">
                              </base-input>

                              <BaseVSelect class="col-md-3" size="sm"
                                name="Contact Type"
                                :emptyDisplay="'ALL'"
                                :options="contactTypes"
                                v-model="newItem.contactType"
                                 placeholder="Select Contact Type">
                              </BaseVSelect>

                              <BaseVSelect class="col-md-3" size="sm"
                                name="Message Language"
                                filterable searchable
                                options="getx:/api/meta/langs"
                                v-model="newItem.lang"
                                placeholder="Select Language">
                              </BaseVSelect>

                              <BaseVSelect class="col-md-3" size="sm"
                                name="Content Type"
                                :emptyDisplay="'ALL'"
                                options="getx:/api/meta/message_content_types"
                                v-model="newItem.meta.contentType"
                                placeholder="Select Content Type">
                              </BaseVSelect>


                            </div>


                            <div class="position-relative form-group row">


  
                            </div>



                           <div class="row">
                           <div class="position-relative form-group col-md-4">
                              <label for="examplePassword" class="text-sm">Template : <em>{{newItem.name}}</em></label>
                               <base-text-area  name="Header" layout="flushed"
                                                placeholder="Type here" v-model="newItem.header" 
                                                rules="max:60|HBNumVar:*,0,1" :rows="1"
                                                :textLimit="60">
                              </base-text-area>
                               <base-text-area  name="Body" layout="flushed"
                                                placeholder="Type here" v-model="newItem.template" 
                                                rules="required|max:1024|HBNumVar:*,0,60" :rows="9"
                                                :textLimit="1024"
                                                :textCompleteStrategies="strategies">
                              </base-text-area>
                              <base-text-area  name="Footer" layout="flushed"
                                                placeholder="Type here" v-model="newItem.footer" 
                                                rules="max:60" :rows="1"
                                                :textLimit="60">
                              </base-text-area>
                              <div> 
                                 <for-each-option v-if="newItem.options && newItem.options.buttons"
                                    :options="newItem.options.buttons" class="new_buttons w-100"
                                      optionTag="span"
                                      optionClass="btn-group btn-group-sm">
                                      <template #data="{option}">
                                          <span class="btn btn-outline-grey">
                                            <i v-if="option.item.type=='URL'" class="fa fa-external-link-alt">&nbsp;</i>
                                            <i v-if="option.item.type=='PHONE_NUMBER'" class="fa fa-phone-alt">&nbsp;</i>
                                            {{option.label}}
                                          </span> 
                                          <span class="btn btn-outline-grey option-action"
                                            @click="deleteButton(option.item)">
                                            <i class="fa fa-trash"/>
                                          </span> 
                                          <span class="btn btn-outline-grey option-action"
                                            @click="editButton(option.item)">
                                              <i class="fa fa-edit"/>
                                          </span>
                                      </template>
                                 </for-each-option>
                                <b-input-group class="mt-1 px-1px" size="sm">
                                  <b-form-input 
                                     placeholder="Type name of button"
                                    v-model="input.new_button.value"></b-form-input>
                                  <b-input-group-append>
                                    <b-button
                                      variant="outline-grey" @click="addButton">
                                      <i class="fa fa-plus"/>
                                    </b-button>
                                  </b-input-group-append>
                                </b-input-group>
                              </div>
                            </div>
                            <div class="position-relative form-group col-md-4">
                                  <label for="examplePassword" class="text-sm">Sample Data</label>
                                  <v-jsoneditor v-model="newItem.data" :show-btns="false" :expandedOnStart="true"
                                    :options="{
                                      'mode' : 'code', 'modes' : ['code'],
                                      'navigationBar' : false,'mainMenuBar' : false
                                    }" height="400px">
                                  </v-jsoneditor>
                            </div>
                            <div class="position-relative form-group col-md-4">
                                <label for="examplePassword" class="text-sm">Template Preview</label>
                                <TemplatePreview 
                                  :template="newItem" style="height: 400px;"
                                  />
                            </div>
                        </div> 

                  </ValidationObserver>

                  <div class="text-center form-group">
                    <router-link  @click="cancelItem"  tag="button"  :to="'/app/admins/tmpl/pushtemplate/view/all'"
                      class="btn btn-warning">Cancel</router-link >
&nbsp;
                    <button v-if="newItem.id"  @click="createItem" :disabled="!isChanged" 
                      class="btn btn-primary">Update</button>
&nbsp;
                    <button v-if="!newItem.id"  @click="createItem" :disabled="!isChanged" 
                      class="btn btn-primary">Create</button>
                  </div>

        </b-card>

        <b-modal :id="modalEditButton.name" size="md"
            :title="'Edit Button Details'">
            <span v-if="modalEditButton.item" >
            <ButtonRadioGroup 
              v-model="modalEditButton.item.type"
              :select-default="true"
              button-variant="outline-primary"
              :options="['QUICK_REPLY','URL','PHONE_NUMBER']" />
            <base-input
                class="mb-0" prependClass="btn btn-outline-primary"
                prelabel label="Button Text" 
                v-model="modalEditButton.item.label" :textLimit="20" required
                rules="required|max:20" >
            </base-input>
            <base-input v-if="modalEditButton.item.type=='PHONE_NUMBER'" 
                :class="'mb-0'" prependClass="btn btn-outline-primary"
                prelabel name="Phone Number"
                v-model="modalEditButton.item.phone_number" :textLimit="20" required
                rules="required|phone" >
            </base-input>
            <base-input v-if="modalEditButton.item.type=='URL'" 
                :class="'mb-0'" prependClass="btn btn-outline-primary"
                prelabel name="Link URL" 
                helpMessage="You can append only one variable at the of url"
                v-model="modalEditButton.item.url" :textLimit="2000"
                  rules="required|max:2000|HBNumVar:end,0,1" >
            </base-input>
            </span>

            <template #modal-footer="{ok}">
                  <button @click="ok"
                    class="btn btn-primary">Ok</button>
            </template>
        </b-modal> 




    </div>
</template>

<script>

    import PageTitle from "../../Components/PageTitle.vue";
    import TemplatePreview from "@/@common/custom/components/TemplatePreview.vue";
    import ModalSelector from "../../../@common/custom/components/ModalSelector.vue";
    
    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUsersSlash,faUsers,faTrash,faEye
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import mustache from 'mustache';
    import formatters from '../../../services/formatters';

    import VJsoneditor from 'v-jsoneditor'
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';

    library.add(
        faUsersSlash,faUsers,faTrash,faEye
    );

    function newItem() {
      return {
              "category": "",
              "desc": "",
              "name" : undefined, 
              "header" : "",
              "body" : "",
              "footer" : "",
              "template" : "" ,
              "code" : "" ,"contactType" : "", lang : 'en_US',
              options : { buttons : [] },
              data : {}, meta : { messageType : null,contentType : null}       
      };
    }

    var sampleJson = {
        contact : {
          name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
        }
    };

    var sampleJsonKeys = formatters.keys(sampleJson);

    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,TemplatePreview,VJsoneditor,vSelect,ModalSelector
        },
        data: () => ({
            heading: 'Push Templates',
            subheading: 'are HSM messages which can be  sent to contacts without session.',
            icon: 'pe-7s-browser icon-gradient bg-tempting-azure fa fa-reply-all',
            actions : [{
              label : "Add Template", icon : "plus", name : "ADD_ITEM",  link : "/app/admins/tmpl/pushtemplate/edit/new"
            },{
              label : "Cancel", name : "CANCEL", type : 'link', link : "/app/admins/tmpl/pushtemplate/view/all"
            }],
            input : {
                message_types : {
                  values : [], selected : "shipping_update",
                },
                message_content_types : {
                  values : [], selected : "TEXT",
                },
                langs : {
                  values : [], selected : "en_US",
                },
                new_button : {
                  value : ""
                }
            },
            table : {
              fields: [ 
                        { key : 'category', label : "Category" }, 
                        { key : 'desc', label : "Description" }, 
                        { key: 'actions', label: 'Actions' }    ],
              items : [],
              perPage: 25,
              currentPage: 1,
              rows : 0
            },
            newItem : newItem(),
            sample : sampleJson,
            modelName :  "MODAL_ADD_QUICK_REPLIES",
            modalEditButton : {
              name : "MODAL_EDIT_BUTTON",
              item : null
            },
            mode : "view",
            itemId : 'all',
            strategies: [{
              match: /(^|\s)\{\{([a-z0-9+\-\_\.]*)$/,
              search(term, callback) {
                callback(sampleJsonKeys.filter(function (name) {
                  return name.startsWith(term);
                }).slice(0, 10))
              },
              template(name) {
                return name;
              },
              replace(value) {
                return '$1{{' + value + '}} '
              },
            }]
        }),
        computed : {
            templatePreview : function (argument) {
              if(!this.newItem.template)
                  return this.newItem.template;
              try {
                  return mustache.render(this.newItem.template, Object.assign(sampleJson,{
                    data : this.newItem.data
                  }));
              } catch (e){
                  return this.newItem.template
              }
            },
            isChanged :  function (argument) {
              return this.oldHash !== JSON.stringify(this.newItem);
            },
            contactTypes : function () {
              return ['','WHATSAPP','TELEGRAM','TWITTER','FACEBOOK','WEBSITE']
            },
        },
        watch: {
            'newItem.options.buttons' (newParams, oldParams) {
              console.log("buttons",newParams, oldParams)
            },
            '$route.params.mode': function (mode) {
              this.mode = mode;
            },
            '$route.params.itemId': function (itemId) {
              this.itemId = itemId;
              this.selectItem();
            }
        },
        created : function (argument) {
          this.mode = this.$route.params.mode;
          this.itemId = this.$route.params.itemId;
          this.loadItems();
          this.loadOptions();
        },
        methods : {
          async loadOptions (argument) {
          },
          async loadItems (){
            let resp = await this.$service.get('/api/tmpl/pushtemplate');
            this.table.items = resp.results;
            this.selectItem();
          },
          selectItem : function () {
            if(this.mode == "edit" && this.itemId != "all"){
              var itemSelected = null;
              for(var i in this.table.items){
                if(this.table.items[i].id == this.itemId ){
                    itemSelected = this.table.items[i];
                }
              }
              this.editItem(itemSelected);
            }
          },
          addButton(){
              if(!this.input.new_button.value ) return;
              if(!this.newItem.options) this.newItem.options = {};
              if(!this.newItem.options.buttons) this.newItem.options.buttons = [];

              let new_button = this.input.new_button;
              let buttons = this.newItem.options.buttons.filter(function(button){
                return new_button.value == button.key;
              });
              if(buttons && buttons[0]) return;
              this.newItem.options.buttons = [...this.newItem.options.buttons,{
                label : new_button.value,
                key : new_button.value,
                type : "QUICK_REPLY"
              }];
              this.input.new_button.value = null;
              this.newItem.options = {...this.newItem.options};
          },
          deleteButton(buttonToDelete){
            this.newItem.options.buttons = this.newItem.options.buttons.filter(function(btn){
              return buttonToDelete.label != btn.label;
            });
            this.newItem.options = {...this.newItem.options};
          },
          editButton(buttonToEdit){
            this.modalEditButton.item = buttonToEdit;
            this.$bvModal.show(this.modalEditButton.name);
          },
          async createItem () {
            let success = await this.$refs.form.validate();
            console.log("validSuccess",success)
            if(success === true){
              await this.$service.post('/api/tmpl/pushtemplate', this.newItem);
              this.newItem = newItem();
              this.$refs.form.reset();
              this.onAction({name : "CANCEL"});
              this.loadItems ();
            }
          },
          async deleteItem(item) {
             await this.$service.delete('/api/tmpl/pushtemplate', item);
          }, 
          async cancelItem(item) {
             this.newItem = newItem();
            this.onAction({name : "CANCEL"});
          }, 
          async editItem(item) {
              this.newItem = newItem();
              if(item){
                var itemCopy = JSON.parse(JSON.stringify(item));
                for(var key in itemCopy){
                  this.newItem[key] = itemCopy[key];
                }
                this.newItem.meta = this.newItem.meta || {};
                this.newItem.data = this.newItem.data || {};
              }
              this.onAction({name : "EDIT_ITEM"});
             //await this.$store.dispatch('DeleteQuickReps', item);
          },
          rowClass(item, type) {
            if (!item || type !== 'row') return
            if (this.newItem.id == item.id) return 'table-success'
          },
          onAction : function (argument) {
            switch(argument.name){
              case "ADD_ITEM" :
                this.oldHash = JSON.stringify(this.newItem);
                //this.$bvModal.show(this.modelName)
                this.mode = "edit";
                console.log("ADD_ITEM",argument);
                break;
              case "EDIT_ITEM" :
                this.oldHash = JSON.stringify(this.newItem);
                this.mode = "edit";
                //this.$bvModal.show(this.modelName)
                console.log("ADD_ITEM",argument);
                break;
              case "CANCEL" :
                this.mode = "view";
                //this.$bvModal.hide(this.modelName)
                break;
              default:
                console.log("NoMapping",argument) 
            }
          },
          codeOnChange : function (argument) {
            this.newItem.code = this.newItem.code.replace(/\s/g,"_").replace(/\_\_+/g, '_').toUpperCase();
            this.newItem.name = [this.newItem.code,this.newItem.contactType,this.newItem.lang].filter(function (argument) {
                return !!argument;
            }).join("_");
          }
        }


    }
</script>
<style lang="scss">
  .m-tmpl-hsm-list {
    .new_buttons {
      display: flex;
      justify-content: space-around;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: stretch;

      .options-wrapper {
          margin: 4px 2px 0px;
          flex-grow: 1;
          min-width: calc(50% - 4px);
          text-align: center;
          .option-action {
            text-align: right;
            max-width: 30px;
            min-width: 30px;
            width: 30px;
            padding-left: 2px;
            padding-right: 2px;
            .fa {
              margin: 0px 5px;
            }
          }
      }
    }
    .template-form>.row{
      margin-bottom: 0.1em;
    }
    
  }


</style>
