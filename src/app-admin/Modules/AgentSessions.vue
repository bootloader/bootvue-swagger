<template>
    <div>
       <master-view id="agent-session-list" 
            :header="{
                heading: heading,
                subheading: subheading,
                icon: icon,
            }"
            :filters="[{ label : 'Date Range', name : 'daterange'},{ label : 'Refresh', name : 'sync'}]" 
            :table="{...sessions,items :filtered}"
            :busy="sessions.busy"
            >

                <template #filter(sync)>
                    <span class="btn btn-success" @click="loadSessions">
                      <i class="fa fa-sync"/>
                    </span>
                </template>

                <template #filter(daterange)>
                    <MyDatePicker 
                      :daterange="input.daterange"
                      @dateRangeOninit="dateRangeOnUpdate"
                      @dateRangeOnUpdate="dateRangeOnUpdate"
                    > </MyDatePicker>
                </template>

                <template #top-row="row">
                      <b-th><input type="text" v-model="filters.assignedToAgent"  class="form-control form-control-sm" /></b-th>
                      <b-th><input type="text" v-model="filters.contactName"  class="form-control form-control-sm" /></b-th>
                      <b-th>&nbsp;</b-th>
                      <b-th>&nbsp;</b-th>
                      <b-th>
                        <select class="form-control form-control-sm" v-model="filters.fistResponseStamp" @click.stop.prevent>
                            <option value="">--</option>
                            <option :value="option.value" v-for="option in fistResponseOptions" :key="option.value">{{ option.label }}</option>
                        </select>
                      </b-th>
                      <b-th>
                        <select class="form-control form-control-sm" v-model="filters.closeSessionStamp" @click.stop.prevent>
                          <option value="">--</option>
                          <option :value="option.value" v-for="option in closeSessionOptions" :key="option.value">{{ option.label }}</option>
                        </select>    
                      </b-th>
                </template>
                <template #cell(assignedToAgent)="row">
                    <span class="fa"
                      :class="{
                        'fa-robot' : row.item.mode=='BOT',
                        'fa-user' : row.item.mode=='AGENT',
                        'fas fa-fast-forward' : row.item.mode=='WEBHOOK',
                      }"
                     />
                    &nbsp;{{ row.item.assignedToAgent}}
                    <span v-if="row.item.assignedToDept">
                      ({{row.item.assignedToDept}})
                    </span>
                     <span v-if="row.item.assignedToQueue">
                      | {{row.item.assignedToQueue}}
                    </span>
                </template>
                <template #cell(contactId)="row">
                    <i  class="fab"  v-bind:class="MyDict.socialPrefix(row.item.contactId)"> </i>
                    {{ row.item.contactName || row.item.contactId}}

                    <span cursor-pointer class="fa fa-info-circle" :id="'template-details-'+ row.index ">
                    </span>
                    <b-popover triggers="hover focus" :target="'template-details-'+ row.index "
                      custom-class="message-preview">
                      <template #default class="message-preview"> 
                          <div class="message-text">Name : {{row.item.contactName}}</div>
                          <div class="message-text">Id : {{row.item.contactId}}</div>
                          <div class="message-text">Session : {{row.item.sessionId}}</div>
                      </template>
                    </b-popover>

                </template>
                <template #cell(startSessionStamp)="row">
                    {{ row.item.startSessionStamp | formatDate}}
                </template>
                <template #cell(fistResponseStamp)="row">
                    {{ row.item.fistResponseStamp | formatDate}} 
                </template>
                <template #cell(closeSessionStamp)="row">
                    <span class="fa fa-circle text-xs" :class="{
                        'text-success' : row.item.local.open,
                        'text-danger' : row.item.local.expired,
                        'text-info' : row.item.local.resolved,
                      }" />
                      {{ row.item.closeSessionStamp| formatDate}}
                </template>   
                <template #cell(actions)="row">
                    <span class="far fa-comment-alt mg-1 pointer"  @click="showChat(row.item, row.index, $event.target)" ></span>
                </template>


        </master-view>

      <div class="chat_archive"  v-bind:class="{closed : !session}" >
          <agent-chat v-if="session" :session="session" :key="session.sessionId"
          @close="hideChat"
          @update="updateChat">
          </agent-chat>
      </div>        
    </div>

</template>

<script>

    import PageTitle from "../Components/PageTitle.vue";
    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import AgentChat from './AgentChat';
    import DataProcessor from './../../services/DataProcessor';

    //import chart1 from './Analytics/chart1';
    //import chart2 from './Analytics/chart2';
    //import chart3 from './Analytics/chart3';

    export default {
        components: {
            PageTitle,
            AgentChat
           // chart1,chart2,chart3,
        },
        computed:{
          filtered() {
                if(!this.sessions.items.length) return;
                const filtered = this.sessions.items.filter(item => {
                  return Object.keys(this.filters).every(key =>{
                    if(key === "closeSessionStamp"){
                      switch (this.filters[key]) {
                        case "resolved": 
                          return item?.local?.resolved;
                        case "opened": 
                          return item?.local?.active;
                        case "expired": 
                          return item?.local?.expired;
                        case "closed":
                         return item?.local?.closed;
                        default:
                          return true;
                      }
                    }else if(key === "fistResponseStamp"){
                       switch (this.filters[key]) {
                        case 0: 
                          return item[key] == 0;
                        case "attended":
                         return item[key] != 0;
                        default:
                          return true;
                       }
                    } else{
                      return String(item[key]).toLowerCase().includes(this.filters[key].toLowerCase())
                    }
                  }
                  );
                });
                return filtered.length > 0
                  ? filtered
                  : [
                      Object.keys(this.sessions.items[0]).reduce(function(obj, value) {
                        obj[value] = '';
                        return obj;
                      }, {})
                    ];
              }
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'Chat Sessions',
            subheading: 'Select date range for report',
            icon: 'pe-7s-chat icon-gradient bg-tempting-azure fa fa-chalkboard-teacher',
            sessions : {
                sortBy: 'assignedToAgent',
                sortDesc: false,
                fields: [ { key : 'assignedToAgent', label : "Assigned", sortable: true},{ key : 'contactId', label : "Contact", sortable: false},
                    { key : 'actions', label : "Action", sortable: false },
                    { key : 'startSessionStamp', label : "Start@", sortable: true},
                    { key : 'fistResponseStamp', label : "Agent@", sortable: false },
                    //{ key : 'lastInComingStamp', label : "lastInComingStamp" },
                    //{ key : 'lastResponseStamp', label : "lastResponseStamp" },
                    { key : 'closeSessionStamp', label : "Closed@", sortable: true},
                    //{ key : 'actions', label : "Action" }
                ],
                items : [],
                perPage: 25,
                currentPage: 1,
                rows : 0,
                busy : false
            },
            closeSessionOptions: [
              {label : "Closed", value:"closed"},
              {label : "Expired", value:"expired"},
              {label : "Resolved", value:"resolved"},
              {label : "Open", value: "opened"}
            ],
            fistResponseOptions:[
              {label : "Attended", value:"attended"},
              {label : "Not Attended", value:0}
            ],
            filters:{
              assignedToAgent:"",
              contactName:"",
              closeSessionStamp:"",
              fistResponseStamp:"",
            },
            input : {
                daterange : {
                    startDate : null,
                    endDate : null,
                    span : "Today"
                }
            },
            session : null,
        }),
        mounted : function (argument) {
          //this.dateRangeOnUpdate();
        },
        methods: {
          async loadSessions (){
            if(!this.input.daterange.startDate){
              console.error("No Data Range Specified")
              return 
            }
            this.sessions.busy=true
            try{
              var resp = await this.$store.dispatch('GetSessions',{
                "agent": "TEAM",
                "contactType": "MESSAGE_TWITTER",
                "startStamp": this.input.daterange.startDate,
                "endStamp": this.input.daterange.endDate
              });
              this.sessions.items = resp.results.map(function(session){
                return DataProcessor.session(session);
              });
              this.sessions.rows = this.sessions.items.length;
              console.log("sessions",resp,this.sessions )
            } finally {
              this.sessions.busy=false
            }
          },
          dateRangeOnUpdate : function (r) {
              console.log("dateRangeOnUpdate",r);
              this.input.daterange.startDate = r.startDate;
              this.input.daterange.endDate = r.endDate;
              this.loadSessions();
          },
          async deleteChat (r,index) {
             var resp = await this.$store.dispatch('DeleteSessionChats',r);
             this.sessions.items.splice(index, 1);
          },
          hideChat : function (argument) {
            this.session = null;
          },
          showChat : function (r) {
            if(this.session && this.session.sessionId == r.sessionId){
              this.session = null;
            } else {
              this.session = r;
            }
          },
          updateChat : function (params) {
            this.loadSessions();
          }

        },

    }


</script>
<style type="text/css" scoped >
  .chat_archive {
    right: 0px;
    position: fixed;
    background-color: #f5f5f5;
    bottom: 0px;
    top: 60px;
    width: 450px;
  }
  .chat_archive.closed {
    width: 0px;
    opacity : 0;
    transition: width 0.5s, opacity 1s ease-in;
  }
  .chat_archive{
    width: 450px;
    opacity : 1;
    transition: width 0.5s ease-out, opacity 0.2s ease-out;
  }
  .chat_archive>div {
    width: 450px;
  }
</style>
