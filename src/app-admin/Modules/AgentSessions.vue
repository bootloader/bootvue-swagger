<template>
    <div>
        <page-title :heading=heading :subheading=subheading :icon=icon
        :daterange=input.daterange v-on:dateRangeOnUpdate="dateRangeOnUpdate" ></page-title>


       <b-table id="agent-session-list" :striped=true
                     :bordered=true
                     :outlined=false
                     :small=true
                     :hover=true
                     :dark=false
                     :fixed=false
                     :foot-clone=false
                     :sort-by.sync="sessions.sortBy"
                     :sort-desc.sync="sessions.sortDesc"
                     :per-page="sessions.perPage"
                     :current-page="sessions.currentPage"
                     :items="filtered"
                     :fields="sessions.fields">
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
                    <font-awesome-icon v-if="row.item.mode=='BOT'" icon="robot" :style="{ color: 'grey' }" />
                    <font-awesome-icon v-if="row.item.mode=='AGENT'" icon="user" :style="{ color: 'grey' }" />
                    &nbsp;{{ row.item.assignedToAgent}}
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
                    {{ row.item.closeSessionStamp | formatDate}}
                    <font-awesome-icon v-if="row.item.active" icon="circle" :style="{ color: 'green' }" />
                </template>   
                <template #cell(actions)="row">
                    <span style="cursor: pointer;" class="far fa-comment-alt"  @click="showChat(row.item, row.index, $event.target)" ></span>
                    &nbsp;
                </template>


        </b-table>

          <b-pagination
              v-model="sessions.currentPage"
              :total-rows="sessions.rows"
              :per-page="sessions.perPage"
              aria-controls="agent-session-list"
            ></b-pagination>

      <div class="chat_archive"  v-bind:class="{closed : !session}" >
          <agent-chat v-if="session" :session="session" :key="session.sessionId"
          @close="hideChat">
          </agent-chat>
      </div>        
    </div>

</template>

<script>

    import PageTitle from "../Components/PageTitle.vue";
    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import AgentChat from './AgentChat';

    //import chart1 from './Analytics/chart1';
    //import chart2 from './Analytics/chart2';
    //import chart3 from './Analytics/chart3';

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faTrashAlt,
        faCheck,
        faCalendarAlt,
        faAngleDown,
        faAngleUp,
        faTh,
        faCircle,
        faRobot,faUser
    } from '@fortawesome/free-solid-svg-icons'
    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

    library.add(
        faTrashAlt,
        faCheck,
        faAngleDown,
        faAngleUp,
        faTh,
        faCalendarAlt,
        faCircle,faRobot,faUser
    );

    export default {
        components: {
            PageTitle,
            'font-awesome-icon': FontAwesomeIcon,
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
                        case 0: 
                          return item[key] == 0;
                        case "closed":
                         return item[key] != 0;
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
                rows : 0
            },
            closeSessionOptions: [
              {label : "Closed", value:"closed"},
              {label : "Open", value:0}
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
                }
            },
            session : null,
        }),
        mounted : function (argument) {
          this.dateRangeOnUpdate();
        },
        methods: {
          async getSessions (){
            var resp = await this.$store.dispatch('GetSessions',{
              "agent": "TEAM",
              "contactType": "MESSAGE_TWITTER",
              "startStamp": this.input.daterange.startDate,
              "endStamp": this.input.daterange.endDate
            });
            this.sessions.items = resp.results;
            this.sessions.rows = this.sessions.items.length;
            console.log("sessions",resp,this.sessions )
          },
          dateRangeOnUpdate : function (r) {
               console.log("dateRangeOnUpdate",r);
               this.input.daterange.startDate = this.input.daterange.startDate.getTime();
               this.input.daterange.endDate = this.input.daterange.endDate.getTime();
               this.getSessions();
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
