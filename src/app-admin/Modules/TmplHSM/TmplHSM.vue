<template>
    <div class="m-tmpl-hsm-list">

        <master-view v-show="mode=='view'" ref="templatesView"
            :header="{
                heading: 'Push Templates',
                subheading: 'are HSM messages which can be  sent to contacts without session.',
                icon: 'pe-7s-browser icon-gradient bg-tempting-azure far fa-comment-alt',
            }"
            :table="{
              ...table,
              items :filtered
            }"
            :actions="[{
              label : 'Add Template', icon : 'plus', name : 'ADD_ITEM',  link : '/app/admins/tmpl/pushtemplate/edit/new'
            }]"
            :endpoint="endpoint"
            @action="onAction"
            @rows="selectItem"
            >
            <!-- <template #top-row="row">
                  <b-th><input type="text" v-model="filters.category"  class="form-control form-control-sm" /></b-th>
                  <b-th><input type="text" v-model="filters.desc"  class="form-control form-control-sm" /></b-th>
                  <b-th><input type="text" v-model="filters.categoryType"  class="form-control form-control-sm" /></b-th>
                  <b-th>&nbsp;</b-th>
            </template> -->
                <template #cell(desc)="row">
                  <router-link tag="span" :to="'/app/admins/tmpl/pushtemplate/edit/' + row.item.id" class=" btn-outline-primary-link pointer">
                         <span class="fa fa-edit" title="Edit"/>
                    {{row.item.desc}}  
                  </router-link><br/>
                  <span>{{row.item.code}}</span>
                </template>
                <template #cell(categoryType)="row">
                  <my-source  options="data:hsm/message_category_types" v-model="row.item.categoryType" prepend-icon
                    type="messageType" :value="row.item.formatType"/>&nbsp;
                  <my-icon type="messageType" :value="row.item.formatType" class="float-right"/>
                </template>
                <template #cell(actions)="row">
                  <router-link tag="span" :to="'/app/admins/tmpl/pushtemplate/edit/' + row.item.id">
                    <b-button size="sm" @click="editItem(row.item, row.index, $event.target)"   v-tooltip="row.item.message" variant="outline-primary">
                         <span class="fa fa-edit" title="Edit"/>
                    </b-button>   
                  </router-link>
                  &nbsp;

                  <el-popconfirm
                    title="Are you sure to delete this?"
                    confirm-button-text='Yes'
                    cancel-button-text='No'
                    @confirm="deleteItem(row)"
                  >
                    <b-button slot="reference" size="sm" variant="outline-primary">
                      <font-awesome-icon icon="trash" title="Delete"/>
                    </b-button>
                  </el-popconfirm>
 
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
                  <base-input size="sm" hidden>
                  </base-input>
                  <b-popover triggers="hover focus" :target="'template-info-'+ row.item.id"
                      custom-class="message-preview">
                      <template #default class="message-preview"> 
                          
                          <base-input size="sm" readonly prelabel copy popoverfix
                              label="Id" :value="row.item.id">
                          </base-input>
                          <base-input size="sm" readonly prelabel copy popoverfix
                              label="Code" :value="row.item.code">
                          </base-input>
                          <base-input size="sm" readonly prelabel copy popoverfix
                              label="Lang" :value="row.item.lang">
                          </base-input>

                      </template>
                  </b-popover> 
                  &nbsp;
                  <MyAxon class="btn btn-sm btn-outline-primary"
                     api="/api/tmpl/hsm/meta"
                     activeTitle="Disable for agent panel" title="Enable for agent panel"
                     inactiveClass="fa fa-user-secret dull fa-x"
                     activeClass="fa fa-user-secret"
                    :active="(row.item.meta && row.item.meta.agentAllowed)"
                    :params="{ templateId : row.item.id}"
                    :body="{ agentAllowed : !(row.item.meta && row.item.meta.agentAllowed)}"
                    @complete=loadItems />
                  &nbsp;
                  <router-link tag="span" :to="'/app/admins/tmpl/wabatemplate/view/all?hsm=' + row.item.id">
                    <b-button size="sm" 
                          v-tooltip="'Submit to WABA'" variant="outline-primary">
                         <span class="fa fa-whatsapp" title="Submit"/>
                    </b-button>   
                  </router-link>

                </template>
                <template #cell(status)="row">
                    <span v-for="link in row.item.approved" v-bind:key="link.templateId">
                      <my-icon type="channel" :value="link.channelId" :status="link.status"
                         v-tooltip="`This template is ${link.status} for channel ${link.channelId}`"
                      ></my-icon>  
                    </span>
                </template>  
        </master-view>    

        <master-view v-if="mode=='edit' && newItem"  ref="templatesEdit"
            :header="{
                heading: newItem.desc,
                subheading: newItem.categoryType,
                icon: 'pe-7s-browser icon-gradient bg-tempting-azure fa fa-comment-alt',
            }"
            :table="table"
            :actions="[{
              label : 'Cancel', name : 'CANCEL', type : 'link', link : '/app/admins/tmpl/pushtemplate/view/all'
            }]"
            @action="onAction">
             <template #body>
                      <b-card 
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
                                          options="data:hsm/message_category_types"
                                          v-model="newItem.categoryType"
                                          placeholder="Select Message Type">
                                        </BaseVSelect>

                                        <base-input class="col-md-6" size="sm"
                                          name="Description" placeholder="Enter description"
                                          rules="required|max:60" required
                                          v-model="newItem.desc"
                                          @change="descOnChange">
                                        </base-input>

                                      </div>

                                      <div class="position-relative form-group row">

                                        <base-input class="col-md-3" size="sm" 
                                          name="Template Code" placeholder="CREDIT_ALERT" autocomplete="off"
                                          rules="required|max:60" required
                                          v-model="newItem.code" 
                                          :format-value="newItem.desc"  format-filter="item_code" format-live
                                          >
                                        </base-input>

                                        <BaseVSelect class="col-md-3" size="sm"
                                          name="Channel Type" 
                                          filterable searchable clearable
                                          options="@data/contact_types"
                                          v-model="newItem.contactType"
                                          placeholder="Select Channel Type">
                                        </BaseVSelect>

                                        <BaseVSelect class="col-md-3" size="sm"
                                          name="Message Language"
                                          filterable searchable clearable
                                          options="data:languages"
                                          :filter="{
                                              '!!waba'  : true
                                          }"
                                          optionKey="waba"
                                          v-model="newItem.lang"
                                          placeholder="Select Language">
                                          <template #selected-option="option">
                                             {{option.item.name}} - {{option.item.waba}}
                                          </template>
                                        </BaseVSelect>

                                        <BaseVSelect class="col-md-3" size="sm"
                                          name="Content Type"
                                          :emptyDisplay="'ALL'"
                                          options="data:hsm/message_format_types"
                                          v-model="newItem.formatType"
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
                                                          rules="max:1024|HBPrefixedVar:*,0,60,contact.,data.,global.,session." :rows="1"
                                                          :textLimit="60"
                                                          :textCompleteStrategies="strategies">
                                        </base-text-area>
                                        <base-text-area  name="Body" layout="flushed"
                                                          placeholder="Type here" v-model="newItem.template" 
                                                          rules="required|max:1024|HBPrefixedVar:*,0,60,contact.,data.,global.,session." :rows="9"
                                                          :textLimit="1024"
                                                          :textCompleteStrategies="strategies">
                                        </base-text-area>
                                        <base-text-area  name="Footer" layout="flushed"
                                                          placeholder="Type here" v-model="newItem.footer" 
                                                          rules="max:60" :rows="1"
                                                          :textLimit="60"
                                                          >
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
                                           <base-input
                                                class="mt-1 px-1px d-block" prependClass="btn btn-outline-grey btn-sm" size="sm"
                                                prelabel name="Button Text"
                                                v-model="input.new_button.value" :textLimit="20"
                                                rules="max:20" >
                                                <template #append>
                                                    <i class="fa fa-plus pointer" pointer @click="addButton"/>
                                                </template>  
                                            </base-input>
                                            <button @click="buttonSetting" class="btn btn-info" v-tooltip="'Options Setting'"><i class="fa fa-gear"/></button>
                                        </div>
                                      </div>
                                      <div class="position-relative form-group col-md-4">
                                          <base-v-select class="w-100" ref="default_attachment" @change="default_attachment_update"
                                            :disabled="['IMAGE','VIDEO'].indexOf(newItem.formatType)<0"
                                            label="Default Media" size="sm"
                                            options="getx:/api/tmpl/quickmedia" :filter="{
                                              type : newItem.formatType
                                            }"
                                            optionKey="code" optionLabel="title"
                                            v-model="default_attachment.mediaCode">
                                              <template #option="{ item }">
                                                <my-icon type="fileType" :value="item.type"/>
                                                {{item.title}}
                                              </template>  
                                              <template #selected-option="{ item }">
                                                <my-icon type="fileType" :value="item.type"/>&nbsp;{{item.title}}
                                              </template>
                                          </base-v-select>
                                            <div class="vgrid-wrapper w-100 bg-white mt-4" style="height: 300px; min-width:200px">
                                                <label for="examplePassword" class="text-sm" v-pre>Sample Data<br/>
                                                  <small>Note : use {{data.&lt;variable&gt;}} for custom variables</small>
                                                </label>
                                                <VGrid theme="default" class="w-100"
                                                    :columns="sampleVar.columns"
                                                    :source="templateVariable"
                                                    @afteredit=afterEdit
                                                ></VGrid>
                                            </div> 
                                      </div>
                                      <div class="position-relative form-group col-md-4" v-if="newItem">
                                          <label for="examplePassword" class="text-sm">Template Preview</label>
                                          <TemplatePreview
                                            :template="newItem" style="height: 400px;"
                                            />
                                      </div>
                                  </div> 

                            </ValidationObserver>

                      <template #footer>
                            <div class="text-center">
                              <router-link  @click="cancelItem"  
                                tag="button"  :to="'/app/admins/tmpl/pushtemplate/view/all'"
                                class="btn btn-warning mx-2">Cancel</router-link >
                              <button v-if="newItem.id"  @click="createItem" :disabled="!isChanged" 
                                class="btn btn-primary mx-2">Update</button>
                                      &nbsp;
                              <button v-if="!newItem.id"  @click="createItem" :disabled="!isChanged" 
                                class="btn btn-primary mx-2">Create</button>
                            </div>
                      </template>

                  </b-card>

             </template>  
        </master-view>

        <MyModalBox v-if="mode=='edit' && newItem" size="md" :autostart="!$store.getters.local.admin.hsmWarning">
          <p><i class="fa fa-exclamation-circle text-warning"/> HSM template is comprehensive template, final output may differ for each channel. 
         For example : WhatsApp has a limitation of maximum 3 buttons in single message, so when you submit for WhatsApp approval you will be prompted to modify the template accordingly. 
         </p>
         <p> <label><input type="checkbox" @change="showWarning"/> I understand. Do not show this warning again.</label></p>
        </MyModalBox>  

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
            <base-input
                class="mb-0" prependClass="btn btn-outline-primary"
                prelabel label="Button Code" 
                v-model="modalEditButton.item.key" :textLimit="200" required
                rules="required|max:200" >
            </base-input>
            <base-input
                class="mb-0" prependClass="btn btn-outline-primary"
                prelabel label="Description" 
                v-model="modalEditButton.item.desc" :textLimit="72" required
                rules="required|max:72" >
            </base-input>
            </span>

            <template #modal-footer="{ok}">
                  <button @click="ok"
                    class="btn btn-primary">Ok</button>
            </template>
        </b-modal> 

        <b-modal id="buttonSetting" size="md"
              title="Button Setting">
            <base-input
                class="mb-0" prependClass="btn btn-outline-primary"
                prelabel label="List Option Title" 
                v-model="newItem.options.list_option_title" :textLimit="20" required
                rules="required|max:20" >
            </base-input>
            <base-input
                class="mb-0" prependClass="btn btn-outline-primary"
                prelabel label="More Option Title" 
                v-model="newItem.options.more_option_title" :textLimit="20" required
                rules="required|max:20" >
            </base-input>
            <ButtonRadioGroup
                class="mb-0" prependClass="btn btn-outline-primary"
                prelabel label="More Option Title" 
                :options="[{label : 'Always List', value : true},{ label : 'List If-Required',value : false}]"
                v-model="newItem.options.is_list">
            </ButtonRadioGroup>
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
    import JsonXPath from "../../../@common/utils/JsonXPath";
    import TmplUtils from "../../../@common/utils/TmplUtils";
    import jscovery from "@/services/jscovery";

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUsersSlash,faUsers,faTrash,faEye
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
     import debounce from "debounce";

    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';

    import VGrid, { VGridVueTemplate } from "@revolist/vue-datagrid";
    import JsonUtils from '../../../@common/utils/JsonUtils';
import MyStatus from '../../../@common/custom/components/MyStatus.vue';
import MyIcon from '../../../@common/custom/components/MyIcon.vue';
import BaseRadio from '../../../@common/argon/components/Inputs/BaseRadio.vue';
import {Popconfirm} from 'element-ui';


    library.add(
        faUsersSlash,faUsers,faTrash,faEye
    );

    function newItem() {
      console.log("newItem");
      return {
              "category": "",
              "desc": "",
              "name" : undefined, 
              "header" : "",
              "body" : "",
              "footer" : "",
              "template" : "" ,
              "code" : "" ,"contactType" : "", lang : 'en_US',
              options : { buttons : [], list_option_title:"", more_option_title:"" },
              categoryType : "",  formatType : "",
              model : TmplUtils.sampleModel(), meta : {}       
      };
    }
    let sampleJsonKeys = JsonUtils.paths(newItem().model);

    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,TemplatePreview,
            vSelect,ModalSelector,
            VGrid,
                MyStatus,
                MyIcon,
                BaseRadio,
                [Popconfirm.name]: Popconfirm,
        },
        data: () => ({
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
                  list_option_title:"",
                  more_option_title:"",
                  default_attachment : {
                    mediaCode : null
                  },
                  table : {
                    fields: [ 
                              { key : 'category', label : "Grouping Category", sortable : true }, 
                              { key : 'desc', label : "Description",sortable : true  }, 
                              { key : 'categoryType', label : "Message Type" , sortable : true }, 
                              { key: 'actions', label: 'Actions' },
                              { key : 'status', label : 'Status'}    ],
                    items : [],
                    perPage: 25,
                    currentPage: 1,
                    rows : 0,
                    tableClass : 'text-sm',
                    sortBy : "name",
                  },
                  endpoint : "/api/tmpl/hsm",
                  filters:{
                      category:"",
                      desc:"",
                      categoryType:"",
                  },
                  newItem : newItem(),
                  modelName :  "MODAL_ADD_QUICK_REPLIES",
                  modalEditButton : {
                    name : "MODAL_EDIT_BUTTON",
                    item : null
                  },
                  mode : "view",
                  itemId : 'all',
                  strategies: [{
                    match: /(^|\s)\{+([a-z0-9+\-\_\.]*)$/,
                    search(term, callback) {
                      let data = "data.".startsWith(term) ? "data." : null;
                      let global = "global.".startsWith(term) ? "global." : null;
                      callback([...sampleJsonKeys,data,global].filter(function (name) {
                        return name && name.startsWith(term);
                      }).slice(0, 10))
                    },
                    template(name) {
                      return name;
                    },
                    replace(start,end) {
                      let suffix = end.trim().startsWith("}}") ? '' : '}}';
                      if(/^(data|global)\.$/.test(start)){
                        return ['$1{{' + start, suffix];
                      }
                      return '$1{{' + start + suffix
                    },
                  }],
                  sampleVar : {
                    columns: [
                      { name: 'Variable', prop: "variable", readonly : true},
                      { name: 'Sample Value', prop: "sample"}] ,
                    contact : [],
                    data : []
                  } 
        }),
        computed : {
            filtered() {
                let items = this.table.items;
                console.log("items",items);
                if(!items?.length) return [];
                return items.filter(item => {
                  return Object.keys(this.filters).every(key =>{
                        return String(item[key]).toLowerCase().includes(this.filters[key].toLowerCase())
                    }
                  );
                }) || [];
            },
            templateVariable(){
              return [...this.sampleVar.contact,... this.sampleVar.data];
            },
            isChanged :  function () {
              return this.oldHash !== JSON.stringify(this.newItem);
            },
            contactTypes : function () {
              return ['','WHATSAPP','TELEGRAM','TWITTER','FACEBOOK','INSTAGRAM','WEBSITE']
            },
            templateName :function () {
              return [this.newItem.code,this.newItem.contactType,this.newItem.lang].filter(function (argument) {
                    return !!argument;
              }).join("_");
            }
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
            },
            // "newItem.code" : function(newVal,oldVal){
            //   this.newItem.code = this.newItem.code.toLowerCase().replace(/[^A-Za-z0-9_]+/g,'_');
            // },
            "templateName" : function(){
              this.newItem.name = this.templateName;
            },
            "newItem.header" : function(neVal){
              this.templateTextChange(neVal)
            },
            "newItem.template" : function(neVal){
              this.templateTextChange(neVal)
            },
            // 'default_attachment.mediaCode' : function(){
            //   this.default_attachment_update();
            // }
        },
        created : function (argument) {
          this.mode = this.$route.params.mode;
          this.itemId = this.$route.params.itemId;
          this.loadOptions();
          this.loadItems();
          this.templateTextChange = debounce(this.templateTextChange,100)
        },
        methods : {
          async default_attachment_update(){
              this.newItem.options.attachment = this.$f.toMedia(this.$refs.default_attachment?.selected?.()?.item);
          },
          async loadOptions (argument) {
          },
          async loadItems (){
           // return; //@Deprecated
            var resp = await this.$service.get("api/tmpl/hsm");
            this.table.items = resp.results;
            await this.$refs.templatesView?.apply?.();
          },
          selectItem : function () {
            if(this.mode == "edit"){
              var itemSelected = null;
              if(this.itemId == "clone" && this.$route.params.template){
                itemSelected = this.$route.params.template;
              } else {
                let items = this.$refs.templatesView.getItems();
                console.log("items",items)
                for(var i in items){
                  if(items[i].id == this.itemId ){
                      itemSelected = items[i];
                  }
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
              let newButonItem = {
                label : new_button.value,
                key : new_button.value,
                type : "QUICK_REPLY"
              };
              this.newItem.options.buttons = [...this.newItem.options.buttons,newButonItem];
              this.input.new_button.value = null;
              this.newItem.options = {...this.newItem.options};
              this.editButton(newButonItem);
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
              await this.$service.post('/api/tmpl/hsm', this.newItem);
              this.newItem = newItem();
              this.$refs.form.reset();
              this.onAction({name : "CANCEL"});
              this.loadItems ();
            }
          },
          async deleteItem(row) {
             //await this.$service.delete('/api/tmpl/hsm', item);
             await row.removeItem();
             this.loadItems ();
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
                this.newItem.model = this.newItem.model || newItem().model;
                this.default_attachment.mediaCode = item.options?.attachment?.mediaCode;
              }
              this.onAction({name : "EDIT_ITEM"});
             //await this.$store.dispatch('DeleteQuickReps', item);
          },
          onAction : function (argument) {
            switch(argument.name){
              case "ADD_ITEM" :
                this.newItem = newItem();
                this.oldHash = JSON.stringify(this.newItem);
                this.templateTextChange();
                //this.$bvModal.show(this.modelName)
                this.mode = "edit";
                console.log("ADD_ITEM",argument);
                break;
              case "EDIT_ITEM" :
                this.oldHash = JSON.stringify(this.newItem);
                this.mode = "edit";
                this.templateTextChange();
                //this.$bvModal.show(this.modelName)
                console.log("ADD_ITEM",argument);
                break;
              case "CANCEL" :
                this.mode = "view";
                this.$router.push({
                  name : "pushtemplate",
                  params : { mode : "view", itemId : "all" }
                })
                //this.$bvModal.hide(this.modelName)
                break;
              default:
                console.log("NoMapping",argument) 
            }
          },
          descOnChange : function (argument) {
            // if(!this.newItem.code){
            //     this.newItem.code = this.newItem.desc;  
            // }
          },
          afterEdit(e){
              const rs = JsonXPath({
                path : '$.' +e.detail.model.path,
                json: this.newItem.model,
                resultType: "all",
                value : e.detail.model.sample
              });
              this.newItem.__ob__.dep.notify()
          },
          templateTextChange(){
            console.log("this.newItem.options",this.newItem.options)
            let neVal = (this.newItem.header + this.newItem.template + this.newItem.footer
            + (this.newItem?.options?.buttons || []).map(function(btn){
              return btn.code + " " + btn.url;
            }).join(" ")
            
            )
            let newItem = this.newItem;
            this.sampleVar.data = TmplUtils.getVars(
                neVal,/({{((data|global)\.[\w\d\.]+)}})/g).map(function(v,i){
                return {
                    variable : v.variable,
                    path : v.path,
                    sample : JsonXPath({path : '$.' +v.path,json : newItem.model})[0]
                }
            });
            this.sampleVar.contact = sampleJsonKeys.map(function(key,i){
                return {
                    index : i,
                    path : key,
                    variable : `{{${key}}}`,
                    sample : JsonXPath({ path : '$.'+key,json : newItem.model})[0]
                }
            });
            this.newItem.__ob__.dep.notify()
          },
          buttonSetting(){
            this.$bvModal.show("buttonSetting");
          },
          
          showWarning(e){
            this.$service.local("admin","hsmWarning",e.target.checked);
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
