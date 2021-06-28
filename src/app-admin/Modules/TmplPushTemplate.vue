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
                              <ValidationProvider v-slot="v" rules="required" class="col-md-4">
                                    <label for="examplePassword" class="">Category</label>
                                    <input name="category" id="examplePassword"
                                     placeholder="greeting" type="text"
                                      class="form-control" v-model="newItem.category">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                              <ValidationProvider v-slot="v" rules="required" class="col-md-4">
                                    <label for="examplePassword" class="">Name</label>
                                    <input name="agent_name" id="examplePassword"
                                     placeholder="Hello User" type="text"
                                      class="form-control" v-model="newItem.name" @change="nameOnChange">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                              <ValidationProvider v-slot="v" rules="required" class="col-md-4">
                                    <label for="examplePassword" class="">Message Category</label>
                                    <ModalSelector class="form-control"
                                      :options="input.messageCategories.values"
                                      v-model="input.messageCategories.selected"
                                      placeholder="Select Account">
                                      
                                    </ModalSelector>
                              </ValidationProvider>
                            </div>

                            <div class="position-relative form-group">
                               <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Title</label>
                                    <input name="agent_name" id="examplePassword"
                                     placeholder="Hello User" type="text"
                                      class="form-control" v-model="newItem.title">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                           <div class="row">
                           <div class="position-relative form-group col-md-4">
                               <ValidationProvider v-slot="v" >
                                    <label for="examplePassword" class="">Template</label>
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

    import PageTitle from "../Layout/PageTitleAction.vue";
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
              "title": "",
              "name" : undefined, 
              "template" : "" ,
              options : {}, data : {}, meta : {}       
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
                messageCategories : {
                  values : [
                    { key : "account_update", 
                      label : "Account Update", desc : "Let customers know about updates or changes to their account.", icon : "fa fa-cog" },
                    { key : "alert_update",
                      label : "Alert Update", desc : "Send important updates or news to customers.", icon : "fa fa-bell" },
                    { key : "appointment_update",
                      label : "Appointment Update", desc : "Send confirmations, reminders or other updates to customers about their appointments.", icon : "fa fa-calendar" },
                    {  key : "auto_reply",
                      label : "Auto Reply", desc : "Send auto-replies to customers when your business isn't open", icon : "fa fa-reply" },
                    {  key : "issue_resolution",
                      label : "Issue Resolution", desc : "Respond to questions, concerns or feedback from customers about your business.", icon : "far fa-meh" },
                    { key : "payment_update",
                      label : "Payment Update", desc : "Send a message to customers about their payment.", icon : "fa fa-credit-card" },
                    { key : "personal_finance_update",
                      label : "Personal Finance Update", desc : "Send a message to customers about their personal finances.", icon : "fa fa-dollar-sign " },
                    { label : "Reservation Update", desc : "Send confirmations, reminders or other updates to customers about their reservations.", icon : "far fa-calendar" },
                    { key : "shipping_update",
                      label : "Shipping Update", desc : "Send shipping updates to customers about their orders.", icon : "fa fa-truck" },
                    { key : "ticket_finance_update",
                      label : "Ticket Finance Update", desc : "Send ticketing information or updates to customers.", icon : "fa fa-ticket" },
                    { key : "transportation_update",
                      label : "Transportation Update", desc : "Send transportation information or updates to customers.", icon : "fa fa-plane" },
                  ],
                  selected : "shipping_update",
                },
            },
            table : {
              fields: [ 
                        { key : 'category', label : "Category" }, 
                        { key : 'title', label : "Title" }, 
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
        },
        methods : {
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
                this.newItem.id = item.id;
                this.newItem.category = item.category;
                this.newItem.title = item.title;
                this.newItem.name = item.name;
                this.newItem.message = item.message;
                this.newItem.template = item.template;
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
          nameOnChange : function (argument) {
            this.newItem.name = this.newItem.name.toUpperCase();
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
