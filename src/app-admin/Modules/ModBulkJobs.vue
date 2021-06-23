<template>
    <div>
        <page-title :heading=heading :subheading=subheading :icon=icon
        :actions=actions
        :daterange=input.daterange v-on:dateRangeOnUpdate="dateRangeOnUpdate" ></page-title>


       <b-table id="agent-session-list" :striped=true
                     :bordered=true
                     :outlined=false
                     :small=true
                     :hover=true
                     :dark=false
                     :fixed=false
                     :foot-clone=false
                     :per-page="sessions.perPage"
                     :current-page="sessions.currentPage"
                     :items="sessions.items"
                     :fields="sessions.fields">
                <template #cell(assignedToAgent)="row">
                    <font-awesome-icon v-if="row.item.mode=='BOT'" icon="robot" :style="{ color: 'grey' }" />
                    <font-awesome-icon v-if="row.item.mode=='AGENT'" icon="user" :style="{ color: 'grey' }" />
                    &nbsp;{{ row.item.assignedToAgent}}
                </template>
                <template #cell(contact)="row">
                    <i  class="fab"  v-bind:class="MyDict.socialPrefix(row.item.contactType)"> </i>
                      {{row.item.lane}}
                </template>
                <template #cell(createdStamp)="row">
                    {{ row.item.createdStamp | formatDate}}
                </template>  
                <template #cell(actions)="row">
                    <span cursor-pointer class="far fa-file-alt" :id="'file-details'+ row.index "></span>
                    <b-popover triggers="hover focus" :target="'file-details'+ row.index ">
                      <template #title><small> 
                        <div class="text-align-left"> Name : {{row.item.fileName}}</div>
                        <div class="text-align-left">MD5 : <em>{{row.item.fileMD5}}</em></div>
                        <div class="text-align-left"> Size : {{row.item.fileSize}} KB</div></small>
                      </template>
                    </b-popover>
                    &nbsp;
                    <span v-if="row.item.status=='COMPLETED'" style="cursor: pointer;" class="fa fa-trash"  @click="deleteItem(row.item, row.index, $event.target)" ></span>
                </template>


        </b-table>

          <b-pagination
              v-model="sessions.currentPage"
              :total-rows="sessions.rows"
              :per-page="sessions.perPage"
              aria-controls="agent-session-list"
            ></b-pagination>
        
    </div>

</template>

<script>

    import PageTitle from "../Layout/PageTitleAction.vue";
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
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'Bulk Messages',
            subheading: 'Select date range for report',
            icon: 'pe-7s-chat icon-gradient bg-tempting-azure fa fa-mail-bulk',
            actions : [{
              label : "Send New", name : "BULK_PUSH_NEW", link : "/app/moderate/bulk-push-new",
              type : "link"
            }],
            input : {
                daterange : {
                    hidden : true,
                    startDate : null,
                    endDate : null,
                }
            },
            sessions : {
                fields: [ 
                    { key : 'contact', label : "Account" },
                    { key : 'bulkSessionId', label : "SessionId" },
                    { key : 'templateId', label : "TemplateId" },
                    { key : 'message', label : "Message" },
                    { key : 'messageCount', label : "Messages" },
                    { key : 'createdBy', label : "by" },
                    { key : 'createdStamp', label : "@" },
                    { key : 'status', label : "Status" },
                    //{ key : 'lastInComingStamp', label : "lastInComingStamp" },
                    //{ key : 'lastResponseStamp', label : "lastResponseStamp" },
                    //{ key : 'closeSessionStamp', label : "Closed@" },
                   // { key : 'actions', label : "Action" }
                ],
                items : [],
                perPage: 25,
                currentPage: 1,
                rows : 0
            },
            session : null,
        }),
        mounted : function (argument) {
          //this.dateRangeOnUpdate();
          this.getItems();
        },
        methods: {
          async getItems (){
            var resp = await this.$service.get("/api/message/bulk/push/logs",{
                "contactType": "WHATSAPP",
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
               this.getItems();
          },
          async deleteItem (r,index) {
              var resp = await this.$store.dispatch('PostRequest',{
                url : "/api/message/session/import/trash",
                params : r
              });
              this.sessions.items = resp.results;
              this.sessions.rows = this.sessions.items.length;
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
 
</style>
