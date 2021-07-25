<template>
    <div>
        <page-title :heading=heading :icon=icon
        :actions=actions >
          <template #subheading>
            <span v-if="session">
              published by {{session.createdBy}} @ {{session.createdStamp | formatDate}}
            </span>
          </template>

        </page-title>


       <b-table id="agent-session-list" :striped=true
                     :bordered=true
                     :outlined=false
                     :small=true
                     :hover=true
                     :dark=false
                     :fixed=false
                     :foot-clone=false
                     :per-page="table.perPage"
                     :current-page="table.currentPage"
                     :items="table.items"
                     :fields="table.fields">
                <template #cell(account)="row">
                    <i  class="fab"  v-bind:class="MyDict.socialPrefix(session.contactType)"> </i>
                      {{session.lane}}
                </template>
                <template #cell(contact)="row">
                    <i  class="fab"  v-bind:class="MyDict.socialPrefix(session.contactType)"> </i>
                      {{row.item.contact.phone}}
                </template>
                <template #cell(createdBy)="row">
                      {{row.item.sender}}
                </template>
                <template #cell(sendType)="row">
                      {{row.item.meta.composeType}}-{{row.item.meta.sendType}}
                </template>
                <template #cell(template)="row">
                    <span cursor-pointer class="fa fa-comment" :id="'template-details-'+ row.index ">
                    </span>&nbsp;{{row.item.templateId}}
                    <b-popover triggers="hover focus" :target="'template-details-'+ row.index "
                      custom-class="message-preview">
                      <template #default class="message-preview"> 
                          <div class="message-text">{{row.item.text}}</div>
                      </template>
                    </b-popover>
                </template>
                <template #cell(initiated)="row">
                    {{ row.item.stamps.INIT | formatDate}}
                </template>  
                <template #cell(status)="row">
                    <div cursor-pointer class="fa fa-info-circle" :id="'job-status-details-'+ row.index ">
                    </div>
                      {{row.item.status}}
                    <div v-if="row.item.logs" style="line-height: 21px;" 
                      cursor-pointer class="fa fa-exclamation-triangle float-right" :id="'job-logs-details-'+ row.index ">
                    </div> 
                    

                    <b-popover triggers="hover focus" :target="'job-status-details-'+ row.index ">
                      <template #title>
                        <div class="text-align-left row" v-for="(stamp,status) in row.item.stamps" style="width: 400px"> 
                         <small class="col-2"> {{status}} </small> <small class="col-10">:&nbsp;&nbsp;{{stamp | formatDate}}</small>
                        </div>
                      </template>
                    </b-popover>

                    <b-popover v-if="row.item.logs" triggers="hover focus" :target="'job-logs-details-'+ row.index ">
                      <template #title>
                        <small class="text-align-left" v-for="(log,status) in row.item.logs"> 
                         {{log}}
                        </small>
                      </template>
                    </b-popover>

                </template>

        </b-table>

          <b-pagination
              v-model="table.currentPage"
              :total-rows="table.rows"
              :per-page="table.perPage"
              aria-controls="agent-session-list"
            ></b-pagination>
        
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
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'Bulk Messages',
            subheading: 'Select date range for report',
            icon: 'pe-7s-chat icon-gradient bg-tempting-azure fa fa-mail-bulk',
            actions : [{
              label : "View Past Jobs", name : "BULK_PUSH_JOBS", link : "/app/moderate/bulk-push-jobs",
              type : "link"
            }],
            input : {
                daterange : {
                    hidden : true,
                    startDate : null,
                    endDate : null,
                }
            },
            table : {
                fields: [ 
                    { key : 'messageId', label : "Id" },
                    { key : 'contact', label : "Contact" },
                    { key : 'sessionId', label : "SessionId" },
                    { key : 'template', label : "Template" },
                    { key : 'createdBy', label : "by" },
                    { key : 'initiated', label : "@" },
                    { key : 'sendType', label : "SendType" },
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
            var resp = await this.$service.submit("/api/message/bulk/push/messages",{
                "contactType": "WHATSAPP",
                "bulkSessionId" : this.$route.params.bulkSessionId
            });
            this.table.items = resp.results;
            this.table.rows = this.table.items.length;
            this.session = resp.meta;
            console.log("sessions",resp,this.table )
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
<style lang="scss">
  @import "./../../assets/demo-ui/_chat-preview.scss";

</style>
<style type="text/css" scoped >
 
</style>
