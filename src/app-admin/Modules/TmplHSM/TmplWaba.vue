<template>
    <div class="m-tmpl-hsm-waba">
        <master-view v-show="!template.code" ref="templatesView" goodTable
            :header="{
                heading: 'WhatsApp Templates',
                subheading: 'All the templates registered with WhatsApp',
                icon: 'icon-gradient bg-happy-itmeo fa fa-whatsapp',
            }"
            :table="table"
            :filters="[{ label : 'HSM Templates', name : 'go2hsm', type : 'link', link : '/app/admins/tmpl/pushtemplate/view/all'},
                        ...filters]" 
            :actions="[
                { label : 'Create Message Template', icon : 'plus', name : 'ADD_ITEM', modal : modelName }
            ]"
            :autoApply="false"
            @action="onAction" 
            @rows="onRows">
            <template #filter(go2hsm)="{filter}">
                <b-button variant="link" :to="filter.link">{{filter.label}}</b-button>
            </template>
            <template #filter(channelId)="{apply,filter}">
                <MyChannelSelect v-model="filter.value" @change="apply"
                    :filter="{
                        'channelType' : 'wa360'
                    }"
                > </MyChannelSelect>
            </template>
            <template #filter(sync)="{apply,filter}">
                <b-button variant="success" class="fa fa-sync" @click="filter.value=true;apply()"> </b-button>
            </template>
            <template #cell(template.status)="{item}">
                <my-status v-model="item.template.status">&nbsp;{{item.template.status}}</my-status>
            </template>
            <template #cell(row_actions)="{item}">
                <MyHSMTmplSelect v-model="item.hsmTemplateId" @change="onChange(item,'hsmTemplateId')" size="sm"
                    class="text-sm float-left mx-1" style="max-width:100px"
                />
                <b-button size="sm" @click="toHSM(item)" class="mx-1"
                        v-tooltip="'Clone to HSM template'" variant="outline-primary">
                        <span class="fa fa-cloud-download-alt" title="Submit"/>
                </b-button>  
                <b-button size="sm" @click="deleteItem(item)" class="mx-1"
                        v-tooltip="'Delete template'" variant="outline-danger">
                        <span class="fa fa-trash-alt" title="Submit"/>
                </b-button> 
            </template>
            <template #cell(code)="{item}">
                <b-button variant="link" :to="{
                        name : 'wabatemplate',
                        params : {
                            channelId : item.channelId,
                            code : item.code,
                            lang : item.lang
                        }
                    }"
                    @click="selectTemplate(item)">
                    {{item.code}}
                </b-button>
            </template>

        </master-view>
        <master-view v-if="template.code"
            :header="{
                heading: template.code,
                subheading: template.category,
                icon: 'icon-gradient bg-happy-itmeo fa fa-whatsapp',
            }"  
            :actions="[{ name : 'cancel'}]"      
        >
            <template #action(cancel)="{action}">
                <b-button variant="success"
                :to="{ name : 'wabatemplates'}"
                @click="selectTemplate({})">{{template.id ? 'Back' : 'Cancel'}}</b-button>
            </template>

            <template #body>
                <b-row>
                    <b-col cols="2">
                        <b-list-group> 
                            <b-list-group-item>
                                <span class="font-weight-bold text-md">Languages</span>
                            </b-list-group-item>    
                            <b-list-group-item v-for="temp in templates" v-bind:key="temp.lang" pointer
                                :class="{ 'bg-teal-100' :  temp.lang == template.lang }"
                                @click="selectTemplate(temp)">
                                <my-status 
                                    v-model="temp.template.status"
                                ></my-status>
                                &nbsp;
                                <my-text options="data:languages" :value="temp.lang" optionKey="waba" />
                            </b-list-group-item>
                                <b-list-group-item>
                                <my-v-select 
                                options="data:languages" placeholder="Add language"
                                v-model="newLanguage" optionKey="waba" filterable searchable
                                :filter="{
                                    '!!waba'  : true
                                }"
                                style="min-width: 50px;width:100%;"/>
                            </b-list-group-item> 
                        </b-list-group>
                    </b-col>
                    <b-col cols="7">
                        <validation-observer v-slot="{handleSubmit}" ref="templateStructure">
                        <b-form role="form" @submit.prevent="handleSubmit(onSaveTamplete)">
                        <b-card  no-body>

                            <template #header>
                                <span class="font-weight-bold text-md"> 
                                    <my-text options="data:languages" :value="template.lang" optionKey="waba" /> Message content
                                </span> &nbsp;
                                <span v-if="!template.template.status"
                                    class="text-danger text-left" 
                                    pointer v-tooltip="'Delete Unsaved template'"
                                    @click="onDelete(template)">
                                    <i class="fa fa-trash"/></span>
                                    <my-status class="float-right"
                                        v-model="template.template.status"
                                    >&nbsp;{{template.template.status || 'unsaved'}}</my-status>

                            </template>

                            <b-card-body  
                                class="border-bottom">
                                <b-card-title><h5 class="font-weight-bold text-lg">Header <b-badge variant="dark" class="text-xs bg-greyish text-dark">optional</b-badge></h5></b-card-title>
                                <b-card-sub-title class="mb-2 text-sm">
                                    Add a title or choose which type of media you'll use for this header.</b-card-sub-title>
                                <b-card-text>
                                <b-row>
                                    <b-col cols="6">
                                        <my-v-select  class="mb-1"
                                            emptyDisplay="None" :selectDefault="true" :clearable="false"
                                            v-model="templateSimple.header.format" :disabled="nonEditable"
                                            options="data:hsm/message_format_types">
                                        </my-v-select> 
                                    </b-col>
                                    <b-col cols="6">
                                        <my-v-select class="w-100" ref="attachment" v-if="hasMediaHeader"
                                        options="getx:/api/tmpl/quickmedia"
                                        optionKey="url" optionLabel="title" clearable
                                        v-model="templateSimple.examples.header_handler" 
                                        :filter="{
                                            type : templateSimple.header.format || ''
                                        }">
                                            <template #option="{ item }">
                                            <my-icon type="fileType" :value="item.type"/>
                                            {{item.title}} {{item.type == templateSimple.header.format}}
                                            </template>  
                                            <template #selected-option="{ item }">
                                            <my-icon type="fileType" :value="item.type"/>&nbsp;{{item.title}}
                                            </template>
                                        </my-v-select>
                                    </b-col>
                                </b-row>
                                 <base-input 
                                    prelabel :name="'Sample URL of media'"
                                    v-if="hasMediaHeader"  :disabled="nonEditable"
                                    :placeholder="`Provide URL of sample ${templateSimple.header.format}`"
                                    v-model="templateSimple.examples.header_handler">
                                </base-input>
                                <base-input
                                    prelabel name="Header Text"
                                    v-if="templateSimple.header.format == 'TEXT'"  :disabled="nonEditable"
                                     :textLimit="60" required
                                     rules="required|max:60|HBNumVar:*,0,1" 
                                     helpMessage="Your title can include only one variable"
                                    v-model="templateSimple.header.text">
                                </base-input>
                                <span cols="12" class="body-card-body-variable-grid">
                                    <VGrid v-if="templateSimple.varMap && hasTextHeaderVariable"  theme="default" class="w-100" style="min-height:100px"
                                    :columns="sampleVar.columns"
                                    :source="templateSimple.varMap.header"
                                    @afteredit=afterVarEdit></VGrid>
                                </span>

                                </b-card-text>
                            </b-card-body>

                            <b-card-body  
                                class="border-bottom">
                                <b-card-title><h5 class="font-weight-bold text-lg">Body</h5></b-card-title>
                                <b-card-sub-title class="mb-2 text-sm">
                                    Enter the text for your message in the language you've selected.
                                </b-card-sub-title>
                                <b-card-text class="body-card-body">
                                    <b-row>
                                        <b-col cols="12">
                                            <base-text-area :disabled="nonEditable" name="Body"
                                                placeholder="Type here" v-model="templateSimple.body.text" 
                                                rules="required|max:1024|HBNumVar:*,0,60" rows=10
                                                :textLimit="1024"
                                                :textCompleteStrategies="strategies">
                                            </base-text-area>
                                        </b-col> 
                                    </b-row>  
                                    <b-row v-if="templateSimple.varMap">
                                        <b-col cols="12" class="body-card-body-variable-grid">
                                            <VGrid theme="default" class="w-100" style="min-height:100px"
                                            :columns="sampleVar.columns"
                                            :source="templateSimple.varMap.body"
                                            @afteredit=afterVarEdit></VGrid>
                                        </b-col>
                                    </b-row>   

                                </b-card-text>

                            </b-card-body>

                            <b-card-body  
                                class="border-bottom">
                                <b-card-title><h5 class="font-weight-bold text-lg">Footer <b-badge variant="dark" class="text-xs bg-greyish text-dark">optional</b-badge></h5></b-card-title>
                                <b-card-sub-title class="mb-2 text-sm">
                                    Add a short line of text to the bottom of your message template.</b-card-sub-title>
                                <b-card-text>
                                <base-input :disabled="nonEditable"
                                    v-model="templateSimple.footer.text" :textLimit="60"
                                    rules="max:60|oneline" >
                                </base-input>
                                </b-card-text>
                            </b-card-body>

                            <b-card-body  
                                class="border-bottom">
                                <b-card-title class="d-flex">
                                    <div class="flex-grow-1">
                                        <h5 class="font-weight-bold text-lg">Buttons   <b-badge variant="dark" class="text-xs bg-greyish text-dark">optional</b-badge></h5>
                                    </div>   
                                    
                                        <b-button-group  v-if="!nonEditable"
                                            size="xs" variant="outline-dark" class="d-block" >
                                            <b-button size="xs"  variant="outline-dark" 
                                                :disabled="!canAddButton"
                                                @click="addButton('QUICK_REPLY')"
                                            >+ Button</b-button>
                                            <b-button size="xs" variant="outline-dark"
                                             :disabled="!canAddLink"
                                                @click="addButton('URL')"
                                            >+ Link</b-button>
                                            <b-button size="xs" variant="outline-dark"
                                             :disabled="!canAddPhone"
                                                @click="addButton('PHONE_NUMBER')"
                                            >+ Call Button</b-button>
                                        </b-button-group>
                                    
                                </b-card-title>
                                <b-card-sub-title class="mb-2 text-sm">
                                    Create buttons that let customers respond to your message or take action.</b-card-sub-title>
                                <b-card-text>
                                    <b-list-group flush>
                                        <b-list-group-item v-for="(button,index) in templateSimple.buttons.buttons" :key="'btn-'+index"
                                            class="bg-greyish border b-list-group-item-button">
                                             <div  v-if="!nonEditable"
                                                class="text-white float-left bg-grey number-button" pointer>
                                               {{index+1}}
                                            </div>
                                            <div  v-if="!nonEditable"
                                                class="text-white float-right bg-greyer delete-button"
                                                pointer @click="deleteButton(index)">
                                               <i class="fa fa-trash delete-button-icon" />
                                            </div>
                                            <base-input  :disabled="nonEditable"
                                                v-if="button.type=='QUICK_REPLY'" class="mb-0"
                                                prelabel label="Button Text" 
                                                v-model="button.text" :textLimit="20" required
                                                rules="required|max:20" >
                                            </base-input>
                                            <div v-if="button.type=='PHONE_NUMBER'">
                                                <base-input :disabled="nonEditable" class="mb-0" 
                                                    prelabel label="Button Text"
                                                    v-model="button.text" :textLimit="20" required
                                                    rules="required|max:20" >
                                                </base-input>
                                                <base-input :disabled="nonEditable" :class="'mb-0'"
                                                    prelabel name="Phone Number"
                                                    v-model="button.phone_number" :textLimit="20" required
                                                    rules="required|phone" >
                                                </base-input>
                                            </div>
                                            <div v-if="button.type=='URL'">
                                                <base-input :disabled="nonEditable" class="mb-0"
                                                    prelabel label="Button Text"
                                                    v-model="button.text" :textLimit="20" required
                                                    rules="required|max:20" >
                                                </base-input>
                                                <base-input :disabled="nonEditable" :class="'mb-0'"
                                                    prelabel name="Link URL" 
                                                    helpMessage="You can append only one variable at the of url"
                                                    v-model="button.url" :textLimit="2000"
                                                     rules="required|max:2000|HBNumVar:end,0,1" >
                                                </base-input>
                                                <base-input 
                                                    prelabel :name="'Sample URL'"
                                                    v-if="button.url && button.url.indexOf('{{1}}') > -1"  :disabled="nonEditable"
                                                    placeholder="Provide complete URL of sample link"
                                                    v-model="templateSimple.examples.button_url">
                                                </base-input>
                                            </div>
                                        </b-list-group-item>
                                    </b-list-group>
                                </b-card-text>
                            </b-card-body>

                            <b-card-footer>
                                <b-button type="submit" variant="primary" class="float-right">Save</b-button>
                            </b-card-footer>

                        </b-card>
                        </b-form>
                        </validation-observer>
                    </b-col>
                    <b-col cols="3">
                        <template-preview
                            :template="templatePreview"
                        >
                        </template-preview>    
                    </b-col>
                </b-row>   
            </template>
        </master-view>

        <ValidationObserver ref="form" v-slot="{ invalid }">
        <b-modal v-if="newItem" :id="modelName" :title="(newItem.id ? 'Edit' : 'Add') + ' WABA Template '"
            body-class="my-normalize-v2">

            <BaseVSelect size="sm" label="Select WABA Channel"
                options="getx:/api/options/channels"
                v-model="newItem.channelId"  required rules="required"
                :filter="{
                    'channelType' : 'wa360', sandbox : false
                }"
                class="mb-0"/>

            <BaseVSelect size="sm" label="From HSM Template"
                options="getx:/api/tmpl/hsm"
                v-model="newItem.hsmTemplateId" @option="onHSMCloneOption"  required rules="required"
                class="mb-0"/>

            <BaseVSelect size="sm" label="Message Category"  placeholder="Select Message Category"
                options="data:hsm/message_category_types"
                v-model="newItem.category"  filterable searchable required rules="required"
                class="mb-0"/>
                
            <base-input  size="sm"  :disabled="nonEditable" class="mb-0"
                label="Template Name"
                v-model="newItem.name" :textLimit="512" required rules="required|min:4|max:512" >
            </base-input>

           <BaseVSelect size="sm" label="Message Language"  placeholder="Select Message Language"
                options="data:languages"
                v-model="newItem.lang" optionKey="waba" filterable searchable required rules="required"
                :filter="{
                    '!!waba'  : true
                }"
                class="mb-0"/>

            <template #modal-footer>
                <button @click="createItem" 
                    :disabled="!isValidNewItem || invalid"
                    class="btn btn-sm btn-primary">Create</button>
            </template>

        </b-modal>
        </ValidationObserver>

        <b-modal v-if="templatePreview" :id="modelNameSamples" size="lg"
            :title="'Add Sample Content'">
            <b-row>
                <b-col>
                    <p class="text-sm">To help us understand what kind of message you want to send, you have the option to provide specific content examples for your template. 
                    You can add a sample template for one or all languages you are submitting.</p>
                    
                    <p class="text-sm">Make sure not to include any actual user or customer information, and provide only sample content in your examples. 
                        <a href="https://developers.facebook.com/docs/whatsapp/message-templates/guidelines"> Learn More </a>
                    </p>
                    <b-list-group>

                    </b-list-group>     
                </b-col>    
                <b-col>
                    <template-preview :template="templatePreview" />
                </b-col>    
            </b-row>    
        </b-modal>
        <b-modal v-if="templatePreview" :id="modelNamePreview" 
            :title="'Template Preview'"
            @ok="onSubmit">
                <template-preview :template="templatePreview" />
        </b-modal>
        <b-modal id="SHOW_CLIENT_ERROR" size="lg"
            :title="'WABA Response'">
            <pre>{{ERROR_JSON | json}}</pre>
        </b-modal>
    </div>
</template>

<script>
    import MasterView from '../../Layout/MasterView.vue'
    import MyChannelSelect from '@/@common/custom/components/MyChannelSelect.vue'
    import MyHSMTmplSelect from '@/@common/custom/components/MyHSMTmplSelect.vue'
    import MyText from '../../../@common/custom/components/MyText.vue'
    import MyVSelect from '../../../@common/custom/components/MyVSelect.vue'
    import MyStatus from '../../../@common/custom/components/MyStatus.vue'
    import BaseTextArea from '../../../@common/argon/components/Inputs/BaseTextArea.vue'
    import BaseInput from '../../../@common/argon/components/Inputs/BaseInput.vue'
    import {createWABATmplSample, createWABATmplSimple,cloneWABATmplSample,toHSM} from "@/@common/utils/WABATmpl";
    import BaseSelect from '../../../@common/argon/components/Inputs/BaseSelect.vue'
    import TemplatePreview from '../../../@common/custom/components/TemplatePreview.vue'
    import JsonXPath from "@/@common/utils/JsonXPath";
    import TmplUtils from '@/@common/utils/TmplUtils';
    import debounce from "debounce";
    import VGrid from "@revolist/vue-datagrid";

    export default {
        components: {
            MasterView,
            MyChannelSelect,MyHSMTmplSelect,
                MyText,
                MyVSelect,
                BaseTextArea,
                BaseInput,
                BaseSelect,
                TemplatePreview,MyStatus,VGrid
        },
        data: () => ({
            filters: [
                {
                    name: 'sync',
                    label: 'Sync',
                    value : false
                },
                {
                    label: 'Select Account',
                    name: 'channelId',
                    type: 'lane',
                    value : "",
                },
            ],
            columnFilter:{
                      category:"",
                      code:"",
                      status:"",
                  },
            table: {
                fields: [
                    { key: 'code', label: 'Template Code/Name', sortable: true, filterOptions:{enabled:true,search : true}},
                    { key: 'template.category', label: 'Message Type', sortable: true, 
                    filterOptions:{
                        enabled:true,
                    }},
                    //{ key: 'template.namespace', label: 'namespace' },
                    { key: 'template.status', label: 'Status', sortable: true, 
                    filterOptions:{
                        enabled:true,
                        filterDropdownItems:["approved","rejected"]
                    }},
                    { key: 'template.language', label: 'Language',sortable: false},
                    { key: 'row_actions', label: 'Linked HSM Template',sortable: false},
                ],
                tableClass : 'text-sm', sortBy : "code",
                items: [],
                perPage: 25,
                currentPage: 1,
                rows: 0,
                api: 'api/tmpl/hsm/waba_templates',
            },
            modelName: 'MODAL_WABA_TEMPLATE',
            modelNamePreview: 'MODAL_WABA_TEMPLATE_PREVIEW',
            modelNameSamples: 'MODAL_WABA_TEMPLATE_SAMPLES',
            modalInputs: [],
            oldHash: null,
            model: {
                channelId: '',
            },
            template : createWABATmplSample({}),
            templateSimple : createWABATmplSimple(),
            templates : [],
            newLanguage : null,
            newItem : {
                name : null, category : null, lang : null
            },
            strategies: [{
                match: /(^|\s)\{+([a-z0-9+\-\_\.]*)$/,
                search(term, callback,content) {
                    var re = /({{([\w\d\.\_]+)}})/g;
                    var vars = content.match(re) || [];
                    callback([term || (vars.length+1)+'']);
                },
                template(name) {
                    return name;
                },
                replace(start,end) {
                    let suffix = end.trim().startsWith("}}") ? '' : '}} ';
                    if(start == "data."){
                    return ['$1{{' + start, suffix];
                    }
                    return '$1{{' + start + suffix
                },
            }],
            sampleVar : {
              columns: [
                { name: 'component', prop: "component", readonly : true},
                { name: 'Variable', prop: "numVar", readonly : true},
                { name: 'Data Path', prop: "path"},
                { name: 'Sample Value', prop: "sample"}],
            },
            ERROR_JSON : null
        }),
        computed: {
            items: function () {
                return this.$store.getters.StateAgents
            },
            teams: function () {
                return this.$store.getters.StateTeams
            },
            isValidNewItem: function () {
                return this.newItem.category && this.newItem.name;
            },
            canAddButton : function(){
                if(this.templateSimple?.buttons?.buttons){
                    return (this.templateSimple.buttons.buttons.length < 3) && !this.templateSimple.buttons.buttons.some(function(btn){
                        return btn.type !== 'QUICK_REPLY';
                    });
                } return true;
            },
            canAddLink : function(){
                if(this.templateSimple?.buttons?.buttons){
                    return (this.templateSimple.buttons.buttons.length < 2) && !this.templateSimple.buttons.buttons.some(function(btn){
                        return btn.type === 'URL' || btn.type === 'QUICK_REPLY';
                    });
                } return true;
            }, 
            canAddPhone : function(){
                if(this.templateSimple?.buttons?.buttons){
                    return (this.templateSimple.buttons.buttons.length < 2) && !this.templateSimple.buttons.buttons.some(function(btn){
                        return btn.type === 'PHONE_NUMBER' || btn.type === 'QUICK_REPLY';
                    });
                } return true;
            },
            nonEditable : function(){
                return !!this.template?.template?.status;
            },
            wabaEditable(){
                return !!this.template?.template?.status;
                //360 not allowing update, fb does, but no api for now except partner apis
                //let status = (this.template?.template?.status || "").toLowerCase()
                //return ["approved", "rejected","paused"].indexOf(status) > -1;
            },
            hasMediaHeader : function(){
                return ["IMAGE","VIDEO","DOCUMENT"].indexOf(this.templateSimple?.header?.format) > -1;
            },
            hasTextHeaderVariable : function(){
                return (
                    this.templateSimple?.header?.format == "TEXT" 
                    && this.templateSimple?.header?.text
                    && this.templateSimple?.header?.text.indexOf("{{1}}") > -1
                );
            },
            templatePreview(){
                return {
                    //template : this.templateSimple.body.text,
                    template : this.templateSimple.examples.body_preview,
                    header : (this.templateSimple.header.format == 'TEXT') 
                            ? this.templateSimple.examples.header_preview 
                            : null,
                    attachments : ['IMAGE','VIDEO','DOCUMENT'].indexOf(this.templateSimple.header.format) > -1 ? [{
                        mediaType : this.templateSimple.header.format
                    }] : null,
                    footer : this.templateSimple.footer.text,
                    options : {
                        buttons : (this.templateSimple?.buttons?.buttons || []).map(function (btn) {
                            return {
                                label : btn.text,
                                type : btn.type
                            }
                        })
                    },
                    model : this.templateSimple?.model,
                    data : {
                        ...this.templateSimple?.model?.data,
                        body : this.templateSimple.examples.body_text.map(function(param) {
                            return param.text || param.variable
                        })
                    }
                }
            }
        },
        watch : {
            'newLanguage' : function (nV,oV) {
                console.log("watch.newLanguage",nV,oV);
                this.addTemplate(nV);
            },
            '$route.params.channelId' : function(){
                this.onLoad();
            },
            "newItem.name" : function(){
                this.newItem.name = this.newItem.name.replace(" ","_").toLowerCase().replace(/[^A-Za-z0-9_]/g,'');
            },
            "templateSimple.body.text" : debounce(function(neVal){
                this.afterTextEdit();
            },100),
            "templateSimple.header.text" : debounce(function(neVal){
                this.afterTextEdit();
            },100)
        },
        mounted: function () {
            this.onLoad();
            this.afterTextEdit = debounce(this.afterTextEdit,100);
            this.afterTextEdit();
        },
        methods: {
            async onLoad(){
                if(this.$route.params.channelId){
                    this.filters[1].value = this.$route.params.channelId;
                } else {
                    this.template = {};
                }
                if(this.$route.query.hsm){
                    this.newItem.hsmTemplateId = this.$route.query.hsm
                    this.$bvModal.show(this.modelName);
                }
            },
            async onHSMCloneOption(option){
                if(option && option.item){
                    this.newItem.channelId = this.filters[1].value;
                    this.newItem.name = option.item.code;
                    console.log("option",option.item)
                    this.newItem.category = (option.item.categoryType || option.item?.meta?.messageType || "").toUpperCase();
                    this.newItem.lang = option.item.lang;
                    this.newItem.hsm = option.item;
                } else {
                    this.newItem.hsm = null;
                }
            },
            async deleteItem(item) {
                if(item.id){
                    await this.$service.delete(this.table.api, item);
                    this.$refs.templatesView.apply();
                } else {
                    this.onDelete(item);
                }
            }, 
            async createItem () {
                let success = await this.$refs.form.validate();
                if(success === true){
                    this.selectTemplate({
                        channelId : this.newItem.channelId || this.filters[1].value,
                        code : this.newItem.name,
                        category : this.newItem.category,
                        lang : this.newItem.lang
                    });
                    this.addTemplate(this.newItem.lang,this.newItem.hsm);
                    this.$refs.form.reset();
                    this.$bvModal.hide(this.modelName);
                }
            },
            async onSubmit(){
                // this will be called only after form is valid. You can do an api call here to register users
                try {

                    let templateRequest =  {
                        channelId : this.template.channelId,
                        id : this.template.id,
                        hsmTemplateId : this.template.hsmTemplateId,
                        varMap : this.templateSimple.varMap
                    }

                    if(!this.nonEditable || this.wabaEditable){
                        templateRequest.template = {
                            category : this.template.template.category,
                            language : this.template.template.language,
                            name : this.template.template.name,
                            components : this.template.template.components.filter(function(cmp){
                                if((!cmp.type && cmp.type == "NONE")
                                    || (cmp.type == "HEADER" && !cmp.format)
                                    || (cmp.type == "FOOTER" && !cmp.text)
                                    || (cmp.type == "BUTTONS" && (!cmp.buttons || !cmp.buttons.length))
                                ){
                                    return false;
                                } return true;
                            }),
                        };
                    }

                    let resp = await this.$service.post("/api/tmpl/hsm/waba_templates",templateRequest);
                    this.template.id = resp.results[0].id;
                    this.template.lang = resp.results[0].lang;
                    this.template.code = resp.results[0].code;
                    this.template.template = resp.results[0].template;
                    console.log("resp",resp)
                } catch(e){
                    console.error("eeee",e)
                    this.ERROR_JSON = e.response.data.errors[0].body;
                    this.$bvModal.show("SHOW_CLIENT_ERROR");
                    this.$refs.templateStructure.setErrors(e.response.data.veeErrors)
                }
            },
            onSaveTamplete (){
                this.$bvModal.show(this.modelNamePreview);
            },
            async onAction(argument) {
                switch (argument.name) {
                    case "ADD_ITEM" : 
                    default:
                        console.log('NoMapping', argument)
                }
            },
            async onChange(row,field){
                if(field == "hsmTemplateId"){
                    await this.$service.submit('api/tmpl/hsm/link',{
                        templateId : row.id,
                        hsmTemplateId : row.hsmTemplateId
                    })
                }
            },
            refreshSelectedTemplates(){
                this.templates = this.$refs.templatesView.getItems().filter((template)=>{
                    return template.code == this.template.code;
                });
            },
            async selectTemplate(item) {
                this.template = item;
                this.templateSimple = createWABATmplSimple(this.template);
                this.refreshSelectedTemplates();
            },
            toHSM(item){
                console.log("toHSM",item)
                this.$router.push({
                        name : 'pushtemplate',
                        params : {
                            mode : 'edit', itemId : 'clone',
                            template : toHSM(item)
                        }
                })
            },
            async onRows(rows){
                if(this.$route.params.channelId && this.$route.params.code && this.$route.params.lang){
                    console.log("rows",rows)
                    let temp = rows.filter((row) => {
                        return (row.channelId == this.$route.params.channelId
                            && row.code == this.$route.params.code
                            && row.lang == this.$route.params.lang
                        );
                    })[0];
                    if(temp){
                        this.selectTemplate(temp);
                    }
                }
            },
            async addTemplate(newLanguage,hsm){
                if(!newLanguage){
                    return;
                }
                this.fixit();
                let newTemplate = this.templates.filter((tmp)=> tmp.lang== newLanguage)[0];
                if(!newTemplate){
                    newTemplate = cloneWABATmplSample(Object.assign({},this.template,{
                        lang : newLanguage
                    }),hsm);
                    this.$refs.templatesView.getItems().push(newTemplate);
                }
                if(newTemplate){
                    this.selectTemplate(newTemplate);
                }
            },
            onDelete(item){
                var templates = this.$refs.templatesView.getItems();
                for(var i in templates){
                    let tmpl = templates[i];
                    if(!(
                        tmpl.channelId!=item.channelId 
                        || tmpl.code!=item.code
                        || tmpl.lang!=item.lang)){
                        templates.splice(i,1);
                        this.refreshSelectedTemplates();
                        if(this.templates[0]){
                            this.selectTemplate(this.templates[0])
                        } else {
                            this.selectTemplate({});
                        }
                        break;
                    };
                }
            },
            addButton(type){
                if(!this.templateSimple.buttons.buttons){
                    this.template.template.buttons = [];
                    this.templateSimple.buttons.buttons = this.template.template.buttons;
                }
                this.templateSimple.buttons.buttons.push({ type: type})
            },
            deleteButton : function (index) {
                this.templateSimple.buttons.buttons.splice(index,1);
                this.templateSimple.varMap.buttons.splice(index,1);
            },
            fixit :  debounce(function(params) {
                this.newLanguage = null;
            }),
            afterTextEdit(){
                let THAT = this;
                ["body","header"].map(function(component){
                    if(!THAT.templateSimple[component].text) return;
                    let body = TmplUtils.convertToOrderedVars(THAT.templateSimple[component].text,/({{(\d+)}})/g);
                    let body_preview = THAT.templateSimple[component].text;
                    let templateSimple = THAT.templateSimple;
                    THAT.templateSimple.varMap[component] = body.vars.map(function(vr,i){
                        let path = templateSimple.varMap[component][i]?.path || "data." + component + "_var_" + vr.number;
                        body_preview = body_preview.replace(vr.variable,"{{"+path+"}}")
                        return {
                            component : component,
                            numVar : vr.variable,
                            variable : vr.variable,
                            path : path,
                            sample : templateSimple.varMap[component][i]?.sample,
                        }
                    });
                    THAT.templateSimple.examples[component+"_preview"] = body_preview; 
                });
                 (THAT.templateSimple?.buttons?.buttons ||[]).map(function(btn){
                    if(btn.type == "URL"){
                       THAT.templateSimple.varMap.buttons.map(function(btnVar){
                            if(btnVar.sample){
                                THAT.templateSimple.examples["button_url"] = btnVar.sample; 
                            }
                       })
                    }
                 });
            },
            afterVarEdit(e){
                let path = e.detail.model.path || "data." + e.detail.model.component + "_var_"+ e.detail.model.numVar.replace(/(\{\{)|(\}\})/g, '');
                e.detail.model.path = path;
                if(e.detail.prop == "path"){
                    e.detail.model.sample = JsonXPath({path : '$.' +path,json: this.templateSimple.model})[0] || e.detail.model.sample;
                }
                const rs = JsonXPath({
                    path : '$.' +path,
                    json: this.templateSimple.model,
                    resultType: "all",
                    value : e.detail.model.sample
                });
                [...this.templateSimple.varMap.header, ...this.templateSimple.varMap.body].map(function(vr){
                    if(vr.path && vr.path == path){
                        vr.sample = e.detail.model.sample;
                    }
                });
                this.templateSimple.__ob__.dep.notify()
          },
        },
    }
</script>
<style lang="scss">
    .m-tmpl-hsm-waba {
        .delete-button,.number-button {
            width: 30px;
            height: 30px;
            border: 1px solid;
            border-radius: 50%;
            margin: 8px -34px;
        }
        .delete-button-icon {
            position: absolute;
            margin: 7px 8px;
        }
        .number-button {
            text-align: center;
            padding: 2px;
        }
        .b-list-group-item-button .mb-0 .form-group{
            margin-top: 2px!important;
            margin-bottom: 2px!important;
        }
        .help-feedback {
            font-size: .8em;
            text-align-last: right;
            float: right;
        }
        .body-card-body {
            .form-control-label {
                display: none;
            }
            .body-card-body-variable{
                border: 1px solid #d0d7dc;
                // font-size: 1em;
                // line-height: 20px;
            }
             .body-card-body-variable::placeholder{ 
                 font-size: .8em;
             }
            .body-card-body-variable+.body-card-body-variable {
                border-top: 0px;
                // border-bottom: 1px solid #d0d7dc;
                // border-left: 1px solid #d0d7dc;
                // border-right: 1px solid #d0d7dc;
            }
        }
        .body-card-body-variable-grid{
            width: 100%;
            .main-viewport {
                height: 100%;
                .viewports {
                    width: 100%;
                }
            }

        }
        input,textarea {
            font-size: 13px;
        }
    }
</style>
