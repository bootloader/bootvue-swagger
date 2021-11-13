<template>

    <div v-if="$global.MyFlags.agent.profileView == 'history'" class="text-sm scrollable"  ref="scrollable">
        
        <b-table v-if="oldTable" id="agent-session-list" :striped=true
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
                    <span class="contact_type fab" v-if="row.item.contactType"
                                v-bind:class="$global.MyDict.social[row.item.contactType]"
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
                    <router-link v-if="row.item.sessionId && row.item.contactId" tag="button" :id="row.item.sessionId" 
                        :to="{ 
                            name: 'defAgentView', 
                            params: { 
                                contactId: row.item.contactId.replace('/','-'),
                                sessionId : row.item.sessionId,
                                profileId : profileId,
                                mvu : 'CHATBOX'
                            }}"
                        active-class="disabled"
                        class="btn btn-outline-primary btn-xs">
                            View Chat
                 </router-link>
                  <span v-else>-</span>
                </template>
        </b-table>

        <div style="height:20px;width:100%;position:relative;">
            <loading :active.sync="isLoading" 
            :can-cancel="false"  
            :loader="'dots'"
            :is-full-page="false"></loading>
            <div v-if="!isLoading" class="text-center">
                <b-button @click="loadSessionsNext"
                variant="outline-grey" pill
                class="btn-sm btn p-s1 text-sm"
                >Load More</b-button>
            </div>
        </div>    

    </div>
</template>

<script>

    import Loading from 'vue-loading-overlay';
    import debounce from 'debounce';

    const D20 = 1000*60*60*24*20;
    const DT1 = Date.now() + 24 * 60 * 60 * 1000;

    export default {
        components: {
            Loading: Loading,
            //SmartTagz : SmartTagz
        },
        computed : {
            profileId : function () {
               return this.$route.params.profileId;
            },
        }, 
        data: () => ({
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
            isLoading : false, isLoadingsNext : false, isLoadingAuto : true,
            collection : [],
            labelInput : "", newLabels : null,
            oldTable : true,
            toStamp : 0,
            fromStamp : 0,
        }),
        created () {
        },
        mounted (){
            const tableScrollBody = this.$el;
            tableScrollBody.addEventListener('scroll', this.handleScroll);
            this.loadSessions();
        },
        destroyed () {
            const tableScrollBody = this.$el;
            tableScrollBody.removeEventListener('scroll', this.handleScroll);
        },
        watch: {
            '$route.params.profileId': function (profileId) {
                this.loadSessions();
            },
            '$route.params.profileView': function (profileId) {
                this.loadSessions();
            }
        },
        methods: {
            loadSessions : function(){
                this.toStamp = DT1;
                this.fromStamp = this.toStamp - D20;
                this.sessions.items = [];
                this.isLoadingAuto = true;
                this.loadSessionsNext();
            },
            loadSessionsNext : debounce(async function(){
                if(!this.$route.params.profileId){
                    this.sessions.items = [];
                    this.sessions.rows = 0;
                    return;
                }

                if(this.$route.params.profileView == "history"){
                    this.isLoading = true;
                    var resp = await this.$store.dispatch('GetSessions',{
                        contactId : this.$route.params.profileId,
                        toStamp : this.toStamp,
                        fromStamp : this.fromStamp
                        //contactType : this.activeChat.contactType
                    });
                    let newItems = (resp || []);
                    if(!newItems.length){
                        newItems = [{
                            sessionId : "dummysession"+this.fromStamp,
                            startSessionStamp : this.fromStamp
                        }];
                        this.isLoadingAuto = false;
                    } else {
                        this.isLoadingAuto = true;
                    }

                    this.sessions.items = [...this.sessions.items,...newItems];
                    this.sessions.items = (this.sessions.items).sort(function(a,b){
                        return  (b.startSessionStamp||b.fistResponseStamp||b.lastInComingStamp||b.assignedDeptStamp||b.assignedAgentStamp||b.lastResponseStamp||b.closeSessionStamp) - (a.startSessionStamp||a.fistResponseStamp||a.lastInComingStamp||a.assignedDeptStamp||a.assignedAgentStamp||a.lastResponseStamp||a.closeSessionStamp);
                    });
                    this.sessions.rows = this.sessions.items.length;
                    this.isLoading = false;
                    this.isLoadingsNext = false
                    this.toStamp = this.fromStamp;
                    this.fromStamp = this.fromStamp  - D20 * (this.isLoadingAuto ? 1 : 2);

                    // for(var i in this.sessions.items){
                    //     this.collection.push({
                    //         data : this.sessions.items[i]
                    //     });
                    // }
                }
            },200),
            handleScroll : debounce(async function(event){
                if(event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight){
                    if(!this.isLoading && !this.isLoadingsNext && this.isLoadingAuto){
                        this.isLoadingsNext = true
                        this.loadSessionsNext();
                    }
                }
            },200),
            cellSizeAndPositionGetter(item, index) {
                // compute size and position
                return {
                    width: 300,
                    height: 30,
                    x: 0,
                    y: index * 30
                }
            }
        },

    }


</script>
<style type="text/css" scoped>
    .contact_type{
        height: 23px;
        width: 23px;
    }
    .scrollable {
        height: 100%;
        width: 100%;
        position: relative;
        overflow: scroll;
    }
</style>
<style type="text/css">
</style>
