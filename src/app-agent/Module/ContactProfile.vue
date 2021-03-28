<template>
<div class="card mb-sm-3 mb-md-0 card_contact_profile">
    
    <div class="card-header">
        <center>History</center>
    </div>
    <div class="card-body vld-parent">
        <loading :active.sync="isLoading" 
        :can-cancel="false"  
        :loader="'dots'"
        :is-full-page="false"></loading>

        <div class="information" style="display: flex;" hidden>
                <img :src="activeChat.profilePic || MyDict.profilePic" class="rounded-circle user_img">
        </div>
        <small>
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
                    <span class="contact_type fa"
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
                    <router-link tag="button" :id="row.item.sessionId" :to="'/app/chat/'+row.item.contactId+ '/' + row.item.sessionId + '/' + profileId" active-class="disabled"
                    class="btn btn-outline-primary btn-xs">
                            View Chat
                 </router-link>

                </template>
        </b-table>
 </small>
    </div>
    <div class="card-footer">
            <div>
                <p>{{activeChat.name}}</p>
            </div>
            
            <div>
                <p v-if="activeChat.email"><span class="fa fa-envelope"/> {{activeChat.email}}</p>
            </div>

            <div>
                <p v-if="activeChat.phone"><span class="fa fa-phone"/> {{activeChat.phone}}</p>
            </div>

            <div id="listGroups">
                <h1></h1>
            </div>
    </div>


</div>
</template>

<script>

    import { MyFlags,MyDict,MyConst } from './../global';
    import Loading from 'vue-loading-overlay';

    export default {
        components: {
            Loading: Loading
        },
        computed : {
            activeChat : function(){ 
                console.log("id",this.$route.params.contactId); 
                for(var i in this.$store.getters.StateChats){
                    var chat = this.$store.getters.StateChats[i];
                    if(this.$route.params.contactId == chat.contactId){
                        return chat;
                    }
                }
                return {};
            },
            profileId : function () {
               return this.$route.params.profileId;
            }
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
            isLoading : false
        }),
        created () {
            // fetch the data when the view is created and the data is
            // already being observed
            console.log("CP","created...")
        },
        updated (){
        },
        mounted (){
            console.log("CP","mounted...")
            this.getSessions();
        },
        watch: {
            '$route.params.profileId': function (profileId) {
                this.getSessions();
            }
        },
        methods: {
            async getSessions (){
                if(!this.$route.params.profileId){
                    this.sessions.items = [];
                    this.sessions.rows = 0;
                    console.log("CP","No Active Chat")
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
                console.log("sessions",resp,this.sessions );
                this.isLoading = false;
            },
        },

    }


</script>
<style type="text/css" scoped>
    .contact_type{
        height: 23px;
    }
    .card.card_contact_profile .card-body {
        background-color: #f5f5f5!important;
    }
</style>
