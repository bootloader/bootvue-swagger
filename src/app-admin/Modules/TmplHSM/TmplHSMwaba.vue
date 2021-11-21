<template>
    <div class="m-tmpl-hsm-waba">
        <master-view v-show="!template.code" ref="templatesView" goodTables
            :header="{
                heading: 'WhatsApp Templates',
                subheading: 'All the templates registered with WhatsApp',
                icon: 'icon-gradient bg-happy-itmeo fa fa-whatsapp',
            }"
            :table="table"
            :filters="filters" :actions="[{ label : 'Create Message Template', icon : 'plus', name : 'ADD_ITEM', modal : modelName }]"
            :autoApply="false"
            @action="onAction"
            @rows="onRows">
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
            <template #cell(template_status)="{item}">
                <my-status v-model="item.template.status">&nbsp;{{item.template.status}}</my-status>
            </template>
            <template #cell(row_actions)="{item}">
                <MyHSMTmplSelect v-model="item.hsmTemplateId" @change="onChange(item,'hsmTemplateId')"
                    class="text-sm"
                />
            </template>
            <template #cell(template_code)="{item}">
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
                @click="selectTemplate({})">{{action.name}}</b-button>
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
                                    waba  : true
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
                                <my-v-select  class="mb-1"
                                    emptyDisplay="None" :selectDefault="true" :clearable="false"
                                        v-model="templateSimple.header.format" :disabled="nonEditable"
                                        options="data:waba/message_types">
                                </my-v-select>  
                                <base-input
                                    prelabel name="Header Text"
                                    v-if="templateSimple.header.format == 'TEXT'"  :disabled="nonEditable"
                                     :textLimit="60" required
                                     rules="required|max:60|HBNumVar:*,0,1" 
                                     helpMessage="Your title can include only one variable"
                                    v-model="templateSimple.header.text">
                                </base-input>
                                <base-input 
                                    prelabel :name="'Sample {{1}}'"
                                    v-if="hasTextHeaderVariable"  :disabled="nonEditable"
                                    :textLimit="60"
                                    :placeholder="'Sample value for {{1}}'"
                                    v-model="templateSimple.exmaples.header_text">
                                </base-input> 
                                 <base-input 
                                    prelabel :name="'Sample URL'"
                                    v-if="hasMediaHeader"  :disabled="nonEditable"
                                    :placeholder="`Provide URL of sample ${templateSimple.header.format}`"
                                    v-model="templateSimple.exmaples.header_handler">
                                </base-input>

                                </b-card-text>
                            </b-card-body>

                            <b-card-body  
                                class="border-bottom">
                                <b-card-title><h5 class="font-weight-bold text-lg">Body</h5></b-card-title>
                                <b-card-sub-title class="mb-2 text-sm">
                                    Enter the text for your message in the language you've selected.
                                </b-card-sub-title>
                                <b-card-text>
                                <base-text-area :disabled="nonEditable"
                                    placeholder="Type here" v-model="templateBody.text" 
                                    rules="required|max:1024" rows=10
                                    :textLimit="1024">
                                </base-text-area>
                                </b-card-text>
                            </b-card-body>

                            <b-card-body  
                                class="border-bottom">
                                <b-card-title><h5 class="font-weight-bold text-lg">Footer <b-badge variant="dark" class="text-xs bg-greyish text-dark">optional</b-badge></h5></b-card-title>
                                <b-card-sub-title class="mb-2 text-sm">
                                    Add a short line of text to the bottom of your message template.</b-card-sub-title>
                                <b-card-text>
                                <base-input :disabled="nonEditable"
                                    v-model="templateFooter.text" :textLimit="60"
                                    rules="max:60" >
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
                                                    v-model="button.url" :textLimit="20" required
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
                                                    v-model="templateSimple.exmaples.header_handler">
                                                </base-input>
                                            </div>
                                        </b-list-group-item>
                                    </b-list-group>
                                </b-card-text>
                            </b-card-body>

                            <b-card-footer>
                                <b-button v-if="!nonEditable"  type="submit" variant="primary" class="float-right">Save</b-button>
                                <b-button v-if="!nonEditable" variant="outline-primary" class="float-right mr-1"
                                    v-b-modal="modelNameSamples" >Add Sample</b-button>
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


        <b-modal v-if="newItem" :id="modelName" :title="(newItem.id ? 'Edit' : 'Add') + ' Template '">
                  <ValidationObserver ref="form" class="my-normalize-v2">
                            <div class="form-group">
                              <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Message Category</label>
                                     <my-v-select  class="text-lg text-grey"
                                        options="data:waba/message_categories" placeholder="Select Message Category"
                                        v-model="newItem.category" filterable searchable
                                        style="min-width: 200px;width:100%;"/>
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                            <base-input :disabled="nonEditable" class="mb-0"
                                label="Template Name"
                                v-model="newItem.name" :textLimit="512" required
                                rules="required|min:4|max:512" >
                            </base-input>

                            <div class="form-group">
                                <ValidationProvider v-slot="v" rules="required">
                                        <label for="examplePassword" class="">Message Language</label>
                                            <my-v-select  class="text-lg text-grey"
                                                options="data:languages" placeholder="Select Message Language"
                                                v-model="newItem.lang" optionKey="waba" filterable searchable
                                                :filter="{
                                                    waba  : true
                                                }"
                                            style="min-width: 50px;width:100%;"/>
                                        <span class="v-input-error">{{ v.errors[0] }}</span>
                                </ValidationProvider>
                            </div>

                </ValidationObserver>

                 <template #modal-footer>
                      <div class="position-relative form-group">
                        <button @click="createItem"
                            :disabled="!isValidNewItem"
                          class="form-control btn btn-primary">Create</button>
                        </div>
                  </template>

        </b-modal>
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
    import {createWABATmplSample, createWABATmplSimple} from "@/@model/WABATmpl";
    import BaseSelect from '../../../@common/argon/components/Inputs/BaseSelect.vue'
    import TemplatePreview from '../../../@common/custom/components/TemplatePreview.vue'

    import debounce from "debounce";

    export default {
        components: {
            MasterView,
            MyChannelSelect,MyHSMTmplSelect,
                MyText,
                MyVSelect,
                BaseTextArea,
                BaseInput,
                BaseSelect,
                TemplatePreview,MyStatus
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
            table: {
                fields: [
                    { key: 'template_code', label: 'Template Code/Name', sortable: true },
                    { key: 'template.category', label: 'Category', sortable: true },
                    //{ key: 'template.namespace', label: 'namespace' },
                    { key: 'template_status', label: 'Status', sortable: true },
                    { key: 'template.language', label: 'Language' },
                    { key: 'row_actions', label: 'Linked HSM Template' },
                ],
                tableClass : 'text-sm',
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
            },
            ERROR_JSON : null,
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
            templateBody : function(){
                return this.template.template.components.filter(function(comp){
                    return comp.type == "BODY";
                })[0] || {};
            },
            templateFooter : function(){
                return this.template.template.components.filter(function(comp){
                    return comp.type == "FOOTER";
                })[0] || {};
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
                    template : this.templateSimple.body.text,
                    title : (this.templateSimple.header.format == 'TEXT') ? this.templateSimple.header.text : null,
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
            }
        },
        mounted: function () {
            this.onLoad();
        },
        methods: {
            async onLoad(){
                if(this.$route.params.channelId){
                    this.filters[1].value = this.$route.params.channelId;
                } else {
                    this.template = {};
                }
            },
            async createItem () {
                let success = await this.$refs.form.validate();
                if(success === true){
                    this.selectTemplate({
                        channelId : this.filters[1].value,
                        code : this.newItem.name,
                        category : this.newItem.category,
                        lang : this.newItem.lang
                    });
                    this.addTemplate(this.newItem.lang);
                    this.$refs.form.reset();
                    this.$bvModal.hide(this.modelName);
                }
            },
            async onSubmit(){
                // this will be called only after form is valid. You can do an api call here to register users
                try {
                    let resp = await this.$service.post("/api/tmpl/hsm/waba_templates",{
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
                    },{
                        params : {
                            channelId : this.template.channelId
                        }
                    });
                    this.template.id = resp.results[0].id;
                    this.template.lang = resp.results[0].lang;
                    this.template.code = resp.results[0].code;
                    this.template.template = resp.results[0].template;

                    console.log("resp",resp)
                } catch(e){
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
                this.templateSimple = createWABATmplSimple();
                if(this.template && this.template.template && this.template.template.components){
                    let templateSimple = this.templateSimple;
                    this.template.template.components.map(function(cmp){
                        if (cmp.type == "HEADER"){
                            templateSimple.header = cmp;
                        } else if(cmp.type == "BODY"){
                            templateSimple.body = cmp;
                        } else if(cmp.type == "FOOTER"){
                            templateSimple.footer = cmp;
                        } else if(cmp.type == "BUTTONS"){
                            templateSimple.buttons = cmp;
                        }
                    })
                }
                this.refreshSelectedTemplates();
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
            async addTemplate(newLanguage){
                if(!newLanguage){
                    return;
                }
                this.fixit();
                let newTemplate = this.templates.filter((tmp)=> tmp.lang== newLanguage)[0];
                if(!newTemplate){
                    newTemplate = createWABATmplSample(Object.assign({},this.template,{
                        lang : newLanguage
                    }));
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
            },
            fixit :  debounce(function(params) {
                this.newLanguage = null;
            })
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
    }
</style>
