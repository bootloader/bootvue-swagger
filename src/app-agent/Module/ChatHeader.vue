<template>
        <div class="card-header msg_head chat-head">   
                    <div class="d-block clear-both">               
                        <div class="d-flex bd-highlight card-header-left">
                            <div class="card-header-left-left d-sm-block d-md-none">
                                <router-link tag="i" class="fa fa-arrow-left" 
                                    :to="{ 
                                        name: 'defAgentView', 
                                        params: { 
                                            mvu : 'CONTACTS'
                                    }}"
                                >&nbsp;&nbsp;</router-link >
                            </div>
                            <div class="img_cont" 
                                @click="showContactProfile">
                                <img v-if="activeChat" :src="activeChat.profilePic || MyDict.profilePic" class="rounded-circle user_img">
                                <span class="online_icon" hidden ></span>
                            </div>
                            <div class="user_info"
                                v-if="activeChat">
                                <span class="user_name" @click="showContactProfile" >{{contactName}}</span>
                                <div v-if="assignedToAgent" class="user_assignment">
                                    <v-select v-if="chatLocal.active && chatLocal.isModeAgent" :options="agentOptions" v-model="assignedToAgent"
                                    @option:selected="onAssignedToAgent" label="code"
                                    :components="{Deselect}">
                                        <template #selected-option="option">
                                          <div class="user_assignment-selected">Assigned to {{ option.code }}</div>
                                        </template>
                                        <template #open-indicator="{ attributes }">
                                          <span v-bind="attributes" class="fa fa-caret-down"></span>
                                        </template>
                                        <template #option="{ code, name, session}">
                                        <i v-if="!session || !session.isEnabled || !session.isLoggedIn" class="fa fa-times-circle"/>
                                        <i v-else-if="session.isAway" class="fa fa-question-circle"/>
                                        <i v-else-if="session.isOnline" class="fa fa-check-circle"/> 
                                        <i v-else-if="!session.isOnline" class="fa fa-minus-circle"/>

                                        {{ code }}<em>  - {{ name }}</em>
                                        </template>
                                    </v-select>
                                    <span v-else-if="!chatLocal.active" class="vs__selected">
                                        Assigned to {{assignedToAgent.code  || 'NONE'}}
                                    </span>
                                      <span v-else-if="!chatLocal.isModeAgent" class="vs__selected">
                                        Mode : {{activeChat.mode || 'NONE'}}
                                    </span>    
                                </div>
                            </div>

                            <div class="chat_actions" hidden>
                                <button  @click="closSession" title="Close Chat"
                                class="btn"><i class="fa fa-check-circle"></i></button>                            
                            </div>
                        </div>

                        <div  class="card-header-right">
                            <div v-if="activeChat" class="quick-options">
                                <b-dropdown id="dropdown-offset" offset="10"
                                    class="float-right quick_option_menu d-sm-block d-md-none"
                                    ref="quick_option_menu" no-caret  variant="link" block right
                                    toggle-tag="span" toggle-class="quick-option float-right">
                                    <template #button-content>
                                       <i class="fas fa-ellipsis-v"></i>
                                    </template>
                                    <b-dropdown-item @click="showContactProfile('info')">
                                        <i class="fa fa-user"></i>&nbsp;&nbsp;Profile Info
                                    </b-dropdown-item>
                                    <b-dropdown-item  @click="showContactProfile('history')">
                                         <i class="fa fa-history"></i>&nbsp;&nbsp;Chat History
                                    </b-dropdown-item>
                                    <b-dropdown-item class="chat_tags dropdown-tags">
                                        <span v-if="activeChat" class="tag-chat-status tag-darker" :class="'tag-chat-status-'+ activeChat.status"
                                        v-b-modal.chattags >
                                            {{activeChat.status}}
                                        </span>
                                         <span   span v-if="activeChat && activeChat.tagId &&  activeChat.tagId.length"
                                        class="tag-chat-status tag-lighter"
                                        v-b-modal.chattags>
                                            {{formatters.contactTags(activeChat.tagId[0]).title + ( activeChat.tagId.length > 1 ? ' +' +(activeChat.tagId.length-1) + " More" : "")}}
                                        </span>
                                        <span v-else class="tag-chat-status tag-lighter fa fa-plus" v-b-modal.chattags></span>
                                    </b-dropdown-item>
                                </b-dropdown>
                                <span class="float-right quick-option d-none d-md-block" 
                                     v-bind:class="{'my-selected' : profileViewInfo }"
                                    @click="showContactProfile('info')" v-tooltip="'Profile Info'" >
                                    <i class="fa fa-user"></i>
                                </span> 
                                <span class="float-right quick-option d-none d-md-block"
                                     v-bind:class="{'my-selected' : profileViewHistory }"
                                     @click="showContactProfile('history')" v-tooltip="'Chat History'" >
                                    <i class="fa fa-history"></i>
                                </span> 
                            </div>
                        </div>

                        <div  class="card-header-right"  @mouseover="showChatOptions = true"
                                @mouseleave="showChatOptions = false">
                        </div>

                    </div> 
                    
                    <div class="clear-both card-header-lower d-none d-md-block"> 

                        <div class="chat_tags text-align-right float-right ">

                            <span v-if="activeChat" class="tag-chat-status tag-darker" :class="'tag-chat-status-'+ activeChat.status"
                                v-b-modal.chattags >
                                {{activeChat.status}}
                            </span>
                            <span v-if="activeChat && activeChat.tagId &&  activeChat.tagId.length"
                                  class="tag-chat-status tag-lighter"
                                  v-b-modal.chattags
                               >
                                {{formatters.contactTags(activeChat.tagId[0]).title + ( activeChat.tagId.length > 1 ? ' +' +(activeChat.tagId.length-1) + " More" : "")}}
                            </span>
                            <span v-else class="tag-chat-status tag-lighter fa fa-plus" v-b-modal.chattags></span>
                          

                        </div>
                         

                        <div class="chat-actions float-right">
                            
                        </div>

                    </div>
                    <b-modal v-if="isActionable && MyConst.config.CHAT_TAG_ENABLED" id="chattags" ref="chattags" title="Select Chat Status"
                                content-class="card"
                                footer-class="card-footer"
                                header-class="card-header"
                                header-text-variant="white"
                                body-class="card-body"
                                dialog-class="card-dialog modal-dialog-sm"
                                button-size="sm"
                                @ok="updateStatus"
                                >  
                            <span class="cat-title">Chat Status</span><br/>
                            <span v-for="(status,s) in MyDict.chatStatus" v-if="status.editable"
                                class="tag-chat-status-lg" @click="selectStatus(s)"
                                :class="'tag-chat-status-'+ s + ( s== selectedStatus ? ' tag-chat-status-active' : '')">
                                {{status.label}}
                            </span>
                            <div v-for="(category, categoryName) in sortedQuickTags">
                                <hr />
                                <span class="cat-title">{{categoryName}}</span><br/>
                                <span v-for="tag in sortedQuickTags[categoryName]" 
                                    @click="selectTag(tag)"
                                    :class="'tag-chat-status-lg tag ' + 
                                    (tag.selected  ? ' tag-chat-status-active' : '')"
                                    v-bind:style="{'border-color': '#' + tag.color, 'color': '#' + tag.color}">
                                    {{tag.title}}
                                </span>
                                
                            </div>
                            </b-modal>

                </div>
</template>

<script>
    import { MyFlags,MyDict,MyConst,MyFunc } from './../../services/global';
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';
    import formatters from './../../services/formatters';

    
    export default {
        components: {
            vSelect: vSelect,
        },
        props: {
            showContactProfile:Function,
            activeChat:Object || Array,
            chatLocal:Object,
            agentOptions:Array,
            assignedToAgent:Object,
            onAssignedToAgent:Function,
            isActionable:Boolean,
            closSession:Function
        },
        data : () => ({
            MyDict,MyFlags,MyConst, MyFunc,
            showChatOptions : false,
            Deselect: {
                render: function(createElement) {
                    var elm = createElement('span',{
                        domProps : {
                            className : "fa fa-times"
                        }
                    });
                    //elm.className = "fa fa-times";
                    //elm.elm.class = "fa fa-times";
                    console.log("RENDER",elm)
                    //elm.setAttribute('class','fa');
                    return null;
                   // return ("<span>S</span>");
                }
            },
            selectedStatus : null,
            formatters : formatters,
        }),
        computed : {
            sortedQuickTags  : function () {
                return this.$store.getters.StateQuickTagsSorted;
            },
            profileViewInfo : function (argument) {
                return MyFlags.agent.profileView =='info' && MyFlags.agent.showProfile
            }, profileViewHistory : function (argument) {
                return MyFlags.agent.profileView =='history' && MyFlags.agent.showProfile
            },
            contactName (){
                return (this.activeChat?.contact?.name 
                            || this.activeChat?.contact?.phone
                            || this.activeChat?.contact?.email ) || this.activeChat?.name;
            }
        },
        methods: {
            updateStatus : function (status) {
                let tags = [];
                for(var category in this.sortedQuickTags){
                    this.sortedQuickTags[category].map(v=>{
                        v.selected ? tags.push(v) : ""
                    }) 
                }
                this.$store.dispatch('UpdateSessionTags', {
                    status : this.selectedStatus,
                    tags,
                    sessionId : this.activeChat.sessionId
                });
                this.$refs.chattags.hide();
            },
            selectTag : function (tag) {
                this.sortedQuickTags[tag.category].map((v,i)=>{
                     this.sortedQuickTags[tag.category][i].selected = (v.id == tag.id && !v.selected);
                })
            },
            defaultSelectedStatusTag(){
                if(this.activeChat){
                    this.selectStatus(this.activeChat.status);
                    let tagId = this.activeChat.tagId || [];
                    for(var category in this.sortedQuickTags){
                        this.sortedQuickTags[category].map((v,i)=>{
                            this.sortedQuickTags[v.category][i].selected = (tagId.indexOf(v.id)!== -1);
                        })
                    }
                }
            },
            selectStatus : function (status) {
                this.selectedStatus = status;
            },
        },
        mounted() {
            
        }
    }
</script>
<style scoped>

/* User Info Panel */    
  .user_info{
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 15px;
  }
  .user_info .user_name{
    font-size: 15px;
    color: white;
    line-height: 15px;
    margin-bottom: 9px;
    display: block;
  }
  .user_info .font-name{
      text-overflow: ellipsis;
      max-width: 187px;
      display: inline-block;
      overflow: hidden;
  }
  .user_info .font-preview{
    text-overflow: ellipsis;
      max-width: 187px;
      overflow: hidden;
  }
  .user_info .user_stamp{
    font-size: 10px;
    color: rgba(255,255,255,0.6);
  }
  .tag-chat-status-lg {
    margin: 3px;
  }
</style>
<style type="text/css">
   
  .user_info .user_assignment .vs__selected {
    font-size: 13px !important;
    color: rgb(255 255 255);
    background: transparent;
    border: none;
  }
  .user_assignment .vs__dropdown-toggle {
    border : none;
    color: #fff;
    background-color: #0000002e;
    border-radius: 6px;
  }
  .user_assignment .vs__selected-options{
    /*min-width: 200px;*/
  }
  .user_assignment .v-select:not(.vs--open) .vs__search {
    /*display: none;*/
    visibility: none;
    width: 0px;
    padding: 0px;
    color: #FFF;
  }
 .user_assignment .vs__clear {
    display: none;;
 }
  .user_assignment .vs__search, .vs__search:focus{
    width: 100%;
  }
  .user_assignment .vs__dropdown-option {
    padding: 3px 7px;
    max-width: 250px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .user_assignment .vs__dropdown-option--highlight {
     background: #ddd;
     color: #000;
  }
  .user_assignment .vs__dropdown-option em {
    color: #929292;
    font-size: smaller;
    text-overflow: ellipsis;
  }
  .user_assignment .vs__dropdown-option .fa-check-circle {
    color: #3aa233;
    font-size: smaller;
  }
  .user_assignment .vs__dropdown-option .fa-minus-circle {
    color: #c10505;
    font-size: smaller;
  }
  .user_assignment .vs__dropdown-option .fa-question-circle {
    color: #f1993c;
    font-size: smaller;
  }
  .user_assignment .vs__dropdown-option .fa-times-circle {
    color: #929292;
    font-size: smaller;
  }
  .tag{
      background-color: #fff;
      text-transform: uppercase;
  }
  .tag-lighter{
      background-color: #fff;
      text-transform: uppercase;
      color:#000;
  }
  .tag-chat-status-active {
    background-color: #000 !important;
    border-color: #000 !important;
    color: #fff !important;
    font-weight: normal !important;
    border-width: 1px !important;
  }
  .dropdown-tags .tag-lighter{
      border: 1px solid #000;
  }
</style>