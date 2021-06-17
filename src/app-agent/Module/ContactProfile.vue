<template>
<div class="card mb-sm-3 mb-md-0 card_contact_profile">
    
    <div class="card-header">
        <span class="fa fa-close float-right"
        @click="MyFlags.agent.showProfile=false;MyFlags.agent.mvu='CHATBOX'"></span>
        <center>{{MyFlags.agent.profileView}}</center>

    </div>
    <div class="card-body vld-parent">
        <loading :active.sync="isLoading" 
        :can-cancel="false"  
        :loader="'dots'"
        :is-full-page="false"></loading>

        <div class="information" style="display: flex;" hidden>
                <img :src="activeChat.profilePic || MyDict.profilePic" class="rounded-circle user_img">
        </div>
        <div v-if="MyFlags.agent.profileView == 'info' && activeChat.contact && activeChat.contact.profile" class="contact-profile-info" >
            <div v-if="activeChat.contact.profile.name">
               <span class="fa fa-user"/>&nbsp;<label>Name</label> : <data>{{activeChat.contact.profile.name}}</data>
            </div>

            <div v-if="activeChat.contact.profile.profileId">
               <span class="fa fa-fingerprint"/>&nbsp;<label>PID</label> : <data>{{activeChat.contact.profile.profileId}}</data>
            </div>
            
            <div  v-if="activeChat.contact.profile.email">
                <span class="fa fa-envelope"/> &nbsp;<label>Email</label> :  <data>{{activeChat.contact.profile.email}}</data>
            </div>

            <div  v-if="activeChat.contact.profile.mobile">
                <span class="fa fa-phone"/>&nbsp;<label>Phone</label> : <data>{{activeChat.contact.profile.mobile}}</data>
            </div>

            <div v-for="label in activeChat.contact.profile.labels">
                <span class="fa fa-tag"/>&nbsp;<label>{{label.name || label.key}}</label> : <data>{{label.value}}</data>
            </div>

        </div>    


        <small v-if="MyFlags.agent.profileView == 'history'" >
        <b-table id="agent-session-list" :striped=true
                     :bordered=true
                     :outlined=false
                     :small=true
                     :hover=true
                     :dark=false
                     :fixed=false
                     :foot-clone=false
                     :responsive=true
                     :borderless=true
                     :items="sessions.items"
                     :fields="sessions.fields">
                <template #cell(assignedToAgent)="row">
                    <font-awesome-icon v-if="row.item.mode=='BOT'" icon="robot" :style="{ color: 'grey' }" />
                    <font-awesome-icon v-if="row.item.mode=='AGENT'" icon="user" :style="{ color: 'grey' }" />
                    &nbsp;{{ row.item.assignedToAgent}}
                </template>
                <template #cell(time)="row">
                    {{ (row.item.startSessionStamp||row.item.fistResponseStamp||row.item.lastInComingStamp||row.item.assignedDeptStamp||row.item.assignedAgentStamp||row.item.lastResponseStamp||row.item.closeSessionStamp) | formatDate}}
                </template>
                <template #cell(contactType)="row">
                    <span class="contact_type"
                                v-bind:class="MyDict.social[row.item.contactType]"
                                ></span>
                </template>
                <template #cell(startSessionStamp)="row">
                    {{ row.item.startSessionStamp | formatDate}}
                </template>
                <template #cell(fistResponseStamp)="row">
                    {{ row.item.fistResponseStamp | formatDate}} 
                </template>
                <template #cell(closeSessionStamp)="row">
                    {{ row.item.closeSessionStamp | formatDate}}
                    <font-awesome-icon v-if="row.item.active" icon="circle" :style="{ color: 'green' }" />
                </template>   
                <template #cell(actions)="row">
                    <router-link tag="button" :id="row.item.sessionId" :to="'/app/chat/'+row.item.contactId.replace('/','-')+ '/' + row.item.sessionId + '/' + profileId" active-class="disabled"
                    class="btn btn-outline-primary btn-xs">
                            View Chat
                 </router-link>

                </template>
        </b-table>
 </small>
    </div>
    <div class="card-footer">
            <div v-if="activeChat.contactType">
                <p><span class="contact_type fa" v-bind:class="MyDict.socialPrefix(activeChat.contactType)" />{{activeChat.name}}</p>
            </div>
            
            <div>
                <p v-if="activeChat.email"><span class="fa fa-envelope"/> {{activeChat.email}}</p>
            </div>

            <div>
                <p v-if="activeChat.phone"><span class="fa fa-phone"/> {{activeChat.phone}}</p>
            </div>

            <div v-if="activeChat" id="listGroups">
                <div v-if="activeChat && activeChat.contact" class="contact_labels" >
                    <span v-for="label in labels" class="badge badge-light" >
                        <span v-bind:style="{ 'background-color' : '#'+label.color }">&nbsp;</span>
                        {{label.title}}
                    </span>  
                    <span class="badge badge-light btn-add" v-b-modal.tagmodal>+</span>           
                </div>
            </div>
    </div>
        
        <b-modal v-if="activeChat && activeChat.contact" id="tagmodal" title="Contact Labels"

            @ok="tagmodalOk"
            content-class="card"
            footer-class="card-footer"
            header-class="card-header"
            header-text-variant="white"
            body-class="card-body"
            dialog-class="card-dialog modal-dialog-sm"
            button-size="sm"
            >
               

                <vue-tags-input
                    v-model="labelInput"
                    :tags="labels"
                    :add-only-from-autocomplete="true"
                    :autocomplete-items="quickLabels"
                    :autocomplete-min-length="0"
                    :placeholder="'Select Labels'"
                    @tags-changed="onLabelChange">



                    <div slot="autocomplete-item"
                        slot-scope="props"
                        class="my-item"
                        @click="props.performAdd(props.item)" >
                    
                        <i v-bind:style="{ 'background-color': '#' + props.item.color }">&nbsp;</i>&nbsp;

                        <i class="material-icons" >
                      {{ props.item.category }}
                        </i> {{ props.item.title }}
                    </div>


                    <div slot="tag-left"
                        slot-scope="props"
                        class="my-tag-left"
                        @click="props.performOpenEdit(props.index)">
                        <i v-bind:style="{ 'background-color': '#' + props.tag.color }">&nbsp;</i>&nbsp;
                    </div>

                </vue-tags-input>
        </b-modal>

</div>


</template>

<script>

    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import Loading from 'vue-loading-overlay';
    import formatters from '../../services/formatters';

    import VueTagsInput from '@johmun/vue-tags-input';


    var tagFormat = function (argument) {
        return {
            id : argument.id,
            category : argument.category,
            title : argument.title,
            text : argument.title,
            color : formatters.hexacode(argument.category)
        };
    }

    export default {
        components: {
            Loading: Loading,
            VueTagsInput,MyDict
            //SmartTagz : SmartTagz
        },
        computed : {
            activeChat : function(){ 
                for(var i in this.$store.getters.StateChats){
                    var chat = this.$store.getters.StateChats[i];
                    if(this.$route.params.profileId == chat.contactId){
                        return chat;
                    }
                }
               for(var i in this.$store.getters.StateChatHistory){
                    var chat = this.$store.getters.StateChatHistory[i];
                    if(this.$route.params.profileId == chat.contactId){
                        return chat;
                    }
                }
                return {};
            },
            profileId : function () {
               return this.$route.params.profileId;
            },
            labels  : function (argument) {
                var THAT = this;
                if(this.$route.params.contactId && this.activeChat)
                    return (THAT.activeChat.contact.labelId || []).map(function (labelId) {
                        return tagFormat(THAT.$store.getters.StateQuickLabels.filter(t => {
                            return t.id == labelId;
                        })[0] || {
                            id : labelId
                        });
                    });
                return [];
            },
            quickLabels : function(){ 
                return (this.$store.getters.StateQuickLabels || []).filter(i => {
                  return i.title.toLowerCase().indexOf(this.labelInput.toLowerCase()) !== -1;
                }).map(function (argument) {
                    return tagFormat(argument);
                });
            },
        }, 
        data: () => ({
            MyDict,MyFlags,MyConst,
            sessions : {
                fields: [ 
                    { key : 'contactType', label : "" },
                    //{ key : 'assignedToAgent', label : "Assigned" },{ key : 'contactId', label : "Contact" },
                    { key : 'time', label : " " },
                    //{ key : 'startSessionStamp', label : "Start@" },
                    //{ key : 'fistResponseStamp', label : "Agent@" },
                    //{ key : 'lastInComingStamp', label : "lastInComingStamp" },
                    //{ key : 'lastResponseStamp', label : "lastResponseStamp" },
                    //{ key : 'closeSessionStamp', label : "Closed@" },
                    { key : 'actions', label : " " }
                ],
                items : [],
                perPage: 25,
                currentPage: 1,
                rows : 0
            },
            isLoading : false,

            labelInput : "", newLabels : null
        }),
        created () {
            // fetch the data when the view is created and the data is
            // already being observed
            this.loadQuickLabels();
        },
        updated (){
        },
        mounted (){
            this.getSessions();
        },
        watch: {
            '$route.params.profileId': function (profileId) {
                this.getSessions();
            }
        },
        methods: {
            async loadQuickLabels(){
                return await this.$store.dispatch('LoadQuickLabels');
            },
            async getSessions (){
                if(!this.$route.params.profileId){
                    this.sessions.items = [];
                    this.sessions.rows = 0;
                    return;
                }

                this.isLoading = true;
                var resp = await this.$store.dispatch('GetSessions',{
                    contactId : this.$route.params.profileId
                    //contactType : this.activeChat.contactType
                });
                this.sessions.items = (resp || []).sort(function(a,b){
                    return  (b.startSessionStamp||b.fistResponseStamp||b.lastInComingStamp||b.assignedDeptStamp||b.assignedAgentStamp||b.lastResponseStamp||b.closeSessionStamp) - (a.startSessionStamp||a.fistResponseStamp||a.lastInComingStamp||a.assignedDeptStamp||a.assignedAgentStamp||a.lastResponseStamp||a.closeSessionStamp);
                });
                this.sessions.rows = this.sessions.items.length;
                this.isLoading = false;
            },
            async tagmodalOk(argument) {
                var resp = await this.$store.dispatch('AttachQuickLabels',{
                    sessionId : this.$route.params.sessionId,
                    labels : this.newLabels || this.labels
                    //contactType : this.activeChat.contactType
                });
                this.activeChat.contact = resp.data;
            },
            onLabelChange : function (newLabels) {
                this.newLabels = newLabels; 
            }
        },

    }


</script>
<style type="text/css" scoped>
    .contact_type{
        height: 23px;
        width: 23px;
    }
    .card.card_contact_profile .card-body {
        background-color: #f5f5f5!important;
    }
    .contact_labels .badge{
        margin: 0px 2px!important;
        padding: 4px 4px!important;
    }
    .contact_labels .btn-add{
        cursor: pointer;
    }
    .card-header{
         text-transform: capitalize;
    }
    .card-header .fa-close {
        cursor: pointer;
    }
    .contact-profile-info {
        font-size: 14px;
    }
    .contact-profile-info label{
        font-style: normal;
        font-size: 13px;
    }
    .contact-profile-info data {
        font-weight: 100;
    }
    .card-footer .contact_type{
        float: left;
        margin-right: 5px;
    } 
    .vue-tags-input .ti-item.ti-selected-item .my-item {
        background: #fdfbea;
        color: #283944;
    }
</style>
<style type="text/css">
    #tagmodal li.ti-tag, #tagmodal li.ti-item{
        background-color: #efefef!important;
        color: #212529!important;
        border: #ccc 1px solid;
    }
     #tagmodal .vue-tags-input .ti-autocomplete {
        width: calc( 100% - 134px);
    }
    .modal-dialog.card-dialog {
        box-shadow: none!important;
    } 
    .modal-body.card-body {
        background-color: #f5f5f5;;
    }
    .modal-footer.card-footer{
        background-color: rgb(247 247 247 / 95%);
    }
</style>
