<template>
    <div>
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
                    <b-button size="sm"@click="editItem(row.item, row.index, $event.target)"   v-tooltip="row.item.message" variant="outline-primary">
                         <span class="fa fa-edit" title="Edit"/>
                    </b-button>   
                  </router-link>

                </template>

            </b-table>
        </b-card>
          
        <b-card v-else-if="mode=='edit' && newItem" 
              :id="modelName" size="xl"
          @hidden="cancelItem">
                  <ValidationObserver ref="form">
                            <div class="position-relative form-group row">
                              
                              <ValidationProvider v-slot="v" rules="required" class="col-md-3">
                                    <label for="examplePassword" class="">Category</label>
                                    <input name="category" id="examplePassword"
                                     placeholder="greeting" type="text"
                                      class="form-control" v-model="newItem.category">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>

                              <ValidationProvider v-slot="v" rules="required" class="col-md-3">
                                    <label for="examplePassword" class="">Message Type</label>
                                    <ModalSelector class="form-control"
                                      :options="message_types"
                                      v-model="newItem.meta.messageType"
                                      placeholder="Select Account">
                                    </ModalSelector>
                                    <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>

                               <ValidationProvider v-slot="v" rules="required" class="col-md-6">
                                    <label for="examplePassword" class="">Description</label>
                                    <input name="agent_name" id="examplePassword"
                                     placeholder="Hello User" type="text"
                                      class="form-control" v-model="newItem.desc">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>

                            </div>

                            <div class="position-relative form-group row">

                              <ValidationProvider v-slot="v" rules="required" class="col-md-3">
                                    <label for="examplePassword" class="">Template Code</label>
                                    <input name="agent_name" id="examplePassword"
                                     placeholder="Hello User" type="text"
                                      class="form-control" v-model="newItem.code" @change="codeOnChange">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                              <ValidationProvider v-slot="v" class="col-md-3">
                                    <label for="examplePassword" class="">Contact Type</label>
                                    <ModalSelector class="form-control"
                                      :emptyLabel="'ALL'"
                                      :options="contactTypes"
                                      v-model="newItem.contactType"
                                      placeholder="Select Account">
                                    </ModalSelector>
                                    <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                              <ValidationProvider v-slot="v"  class="col-md-3">
                                    <label for="examplePassword" class="">Message Language</label>
                                    <ModalSelector class="form-control"
                                      :emptyLabel="'ALL'"
                                      :options="langs"
                                      v-model="newItem.lang"
                                      placeholder="Select Language">
                                    </ModalSelector>
                                    <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>

                              <ValidationProvider v-slot="v" rules="required" class="col-md-3">
                                    <label for="examplePassword" class="">Content Type</label>
                                    <ModalSelector class="form-control"
                                      :options="message_content_types"
                                      v-model="newItem.meta.contentType"
                                      placeholder="Select Content Type">
                                    </ModalSelector>
                                    <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>

                            </div>


                            <div class="position-relative form-group row">


  
                            </div>



                           <div class="row">
                           <div class="position-relative form-group col-md-4">
                               <ValidationProvider v-slot="v" >
                                    <label for="examplePassword" class="">Template : <em>{{newItem.name}}</em></label>
                                    <text-complete v-model="newItem.template" 
                                      :placeholder="'eg: Hello {{contact.name}}'"
                                      :rows="19"
                                      areaClass="form-control template-message-editor" :strategies="strategies"></text-complete>
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>
                            <div class="position-relative form-group col-md-4">
                                  <label for="examplePassword" class="">Sample Data</label>
                                  <v-jsoneditor v-model="newItem.data" :show-btns="false" :expandedOnStart="true"
                                    :options="{
                                      'mode' : 'code', 'modes' : ['code'],
                                      'navigationBar' : false,'mainMenuBar' : false
                                    }" height="400px">
                                  </v-jsoneditor>
                            </div>
                            <div class="position-relative form-group col-md-4">
                                <label for="examplePassword" class="">Template Preview</label>
                                <TemplatePreview :template="newItem" style="height: 400px;"/>
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





    </div>
</template>

<script>

    import PageTitle from "../Components/PageTitle.vue";
    import TemplatePreview from "./../../Layout/Components/TemplatePreview.vue";
    import ModalSelector from "./../../Layout/Components/ModalSelector.vue";
    
    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUsersSlash,faUsers,faTrash,faEye
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import mustache from 'mustache';
    import formatters from './../../services/formatters';

    import VJsoneditor from 'v-jsoneditor'
    import TextComplete from 'v-textcomplete'
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
              "template" : "" ,
              "code" : "" ,"contactType" : "", lang : 'en_US',
              options : {}, data : {}, meta : { messageType : null,contentType : null}       
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
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,TextComplete,TemplatePreview,VJsoneditor,vSelect,ModalSelector
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
            langs : function () {
              return this.$store.getters.StateApi.MetaLangs
            },
            message_types : function () {
              return this.$store.getters.StateApi.MetaMessageTypes
            },
            message_content_types : function () {
              return this.$store.getters.StateApi.MetaMessageContentTypes
            }   
        },
        watch: {
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
              this.$service.getX('/api/meta/message_types');
              this.$service.getX('/api/meta/message_content_types');
              this.$service.getX('/api/meta/langs');
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
              console.log("editItem",item)
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
  @import "./../../assets/demo-ui/_chat-preview.scss";
  textarea.template-message-editor {
     height: 400px;
  }
</style>
