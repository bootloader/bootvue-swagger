<template>
    <div>
      <master-view id="agent-session-list" 
          :header="{
            heading: heading,
            subheading: subheading,
            icon: icon,
          }"
          :table="table"
          :actions=actions
          :filters="[{ label : 'Show In-Active', name : 'showInActive'}]"
          :busy="table.busy">

          <template #header-subheading>
            <span v-if="session">
              published by {{session.createdBy}} @ {{session.createdStamp | formatDate}}
            </span>
          </template>

          <template #filters>
             <b-button variant="success" class="fa fa-download mg-1" @click="downloadCSVtemplate"> </b-button>
            <b-button variant="success" class="fa fa-sync mg-1" @click="tally"> </b-button>
          </template>

          <template #leftSummary>
             <h6 class="mt-3">Messages Pushed : {{stats.CRTD}}</h6>
             <b-progress :value="stats.SENT" :max="stats.CRTD" show-value v-tooltip="`
                SCHLD:${stats.SCHLD}
                <br/>SENT:${stats.SENT}
                <br/>SENTX:${stats.SENTX}
                <br/>SENT_ERR:${stats.SENT_ERR}
             `">
                    <b-progress-bar v-if="stats.SENT"  :value="stats.SENT" variant="greyer" class="bg-text">
                      <span> <strong>{{stats.SENT}}</strong> Sent</span>
                    </b-progress-bar>
                    <b-progress-bar v-if="stats.SENT_ERR" :value="stats.SENT_ERR" variant="danger">
                      <span> <strong>{{stats.SENT_ERR}}</strong> Failed</span>
                    </b-progress-bar>
                    <!-- <b-progress-bar v-if="stats._SENT" :value="stats._SENT" variant="greyed">
                      <span> <strong>{{stats._SENT}}</strong> Pending</span>
                    </b-progress-bar> -->
              </b-progress> 
             <h6 class="mt-3">Message Delivery</h6>
             <b-progress :value="stats.DLVRD" :max="stats.CRTD" show-value  variant="greyer" class="bg-text text-black" 
                v-tooltip="`DLVRD:${stats.DLVRD}
                <br/>SENTX_ERR:${stats.SENTX_ERR}
                <br/>CCWIN:${stats.CCWIN}
             `" >
                    <b-progress-bar v-if="stats.DLVRD"  :value="stats.DLVRD" variant="info">
                      <span> <strong>{{stats.DLVRD}}</strong> Delivered</span>
                    </b-progress-bar>
                    <b-progress-bar v-if="stats.SENTX_ERR" :value="stats.SENTX_ERR" variant="danger">
                       <span> <strong>{{stats.SENTX_ERR}}</strong> Failed</span>
                    </b-progress-bar>
                    <!-- <b-progress-bar v-if="stats._DLVRD" :value="stats._DLVRD" variant="greyed">
                        <span><strong>{{stats._DLVRD}}</strong> Not Delivered</span>
                    </b-progress-bar> -->
              </b-progress> 
             <h6 class="mt-3">Read Reciept</h6>
             <b-progress :value="stats.READ" :max="stats.CRTD" show-value v-tooltip="`
                READ:${stats.READ}
             `">
                    <b-progress-bar v-if="stats.READ" :value="stats.READ" variant="success">
                      <span> <strong>{{stats.READ}}</strong> Read </span>
                    </b-progress-bar>
                    <!-- <b-progress-bar v-if="stats._READ"  :value="stats._READ" variant="greyed">
                       <span> <strong>{{stats._READ}}</strong> Not Read</span>
                    </b-progress-bar> -->
              </b-progress> 
          </template>  

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
              </span>&nbsp;{{row.item.template}}
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


      </master-view>

        
    </div>

</template>

<script>

    import PageTitle from "../../Components/PageTitle.vue";
    import { MyFlags,MyDict,MyConst } from '../../../services/global';
    import {Parser, transforms } from 'json2csv';

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
                    //{ key : 'messageId', label : "Id" },
                    { key : 'contact', label : "Contact" },
                    //{ key : 'sessionId', label : "SessionId" },
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
        computed : {
          stats(){
            let stats = {
              SCHLD : 0, CRTD :0, 
              SENT : 0, SENTX : 0, DLVRD : 0, READ : 0,
              SENT_ERR : 0, SENTX_ERR : 0, CCWIN : 0,
              ... (this.session?.stats || {}),
            }
            stats.CRTD = Math.max(stats.CRTD||0,stats.INIT||0,stats.SENT||0,stats.SCHLD||0);
            stats.SENT_ERR = Math.max(stats.SENT_ERR, stats.SENTX_ERR) + stats.CCWIN;
            stats.SENT = (stats.CRTD - stats.SENT_ERR);
            stats._SENT = stats.CRTD - stats.SENT - stats.SENT_ERR;
            stats._DLVRD = stats.SENT - stats.DLVRD;
            stats._READ = stats.DLVRD - stats.READ;
            return stats;
          }
        },
        mounted : function (argument) {
          //this.dateRangeOnUpdate();
          this.onMounted();
        },
        methods: {
          async onMounted(){
            await this.getItems();
            if(this.session?.status != "COMPLETED"){
                setTimeout(()=>{ this.tally()},1000);
            }
          },
          async getItems (){
            var resp = await this.$service.submit("/api/message/bulk/push/messages",{
                "contactType": "WHATSAPP",
                "bulkSessionId" : this.$route.params.bulkSessionId
            });
            this.table.items = resp.results;
            this.table.rows = this.table.items.length;
            this.session = resp.meta;
          },
          async deleteItem (r,index) {
              var resp = await this.$store.dispatch('PostRequest',{
                url : "/api/message/session/import/trash",
                params : r
              });
              this.sessions.items = resp.results;
              this.sessions.rows = this.sessions.items.length;
          },
          async tally(){
            var resp = await this.$service.submit("/api/message/bulk/push/retry",{
                "action": "tally",
                "jobId" : this.$route.params.bulkSessionId
            });
            await this.getItems();
          },
          downloadCSVtemplate(){
              if(Object.keys(this.table.items).length){
                  const json2csvParser = new Parser({transforms : [, transforms.flatten()]});
                  const csv = json2csvParser.parse(this.table.items);
                  console.log("csv",csv);
                  let csvContent = "data:text/csv;charset=utf-8,"+csv;
                  var encodedUri = encodeURI(csvContent);
                  var link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "bulk_push_messages.csv");
                  document.body.appendChild(link); // Required for FF
                  link.click();
              }
          }

        },

    }


</script>
<style lang="scss">
  @import "@/assets/demo-ui/_chat-preview.scss";

</style>
<style type="text/css" scoped >
 
</style>
