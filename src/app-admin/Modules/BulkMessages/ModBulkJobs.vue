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
                     :items="filtered"
                     :fields="sessions.fields">
                <template #cell(assignedToAgent)="row">
                    <font-awesome-icon v-if="row.item.mode=='BOT'" icon="robot" :style="{ color: 'grey' }" />
                    <font-awesome-icon v-if="row.item.mode=='AGENT'" icon="user" :style="{ color: 'grey' }" />
                    &nbsp;{{ row.item.assignedToAgent}}
                </template>
                <template #top-row="row">
                    <b-th><input type="search" v-model="filters.lane"  class="form-control form-control-sm" /></b-th>
                    <b-th>&nbsp;</b-th>
                    <b-th>&nbsp;</b-th>
                    <b-th><input type="search" v-model="filters.createdBy"  class="form-control form-control-sm" /></b-th>
                    <b-th>&nbsp;</b-th>
                    <b-th>
                        <select class="form-control form-control-sm" v-model="filters.status" @click.stop.prevent>
                            <option value="">--</option>
                            <option :value="option.value" v-for="option in statusOptions" :key="option.value">{{ option.label }}</option>
                        </select>
                    </b-th>
                    <b-th>&nbsp;</b-th>
                </template>
                <template #cell(contact)="row">
                    <i  class="fab"  v-bind:class="MyDict.socialPrefix(row.item.contactType)"> </i>
                      {{row.item.lane}}
                </template>
                <template #cell(template)="row">
                    <span cursor-pointer class="fa fa-comment" :id="'template-details-'+ row.index ">
                    </span>&nbsp;{{row.item.templateId}}
                    <b-popover triggers="hover focus" :target="'template-details-'+ row.index "
                      custom-class="message-preview">
                      <template #default class="message-preview"> 
                          <div class="message-text">{{row.item.message}}</div>
                      </template>
                    </b-popover>
                </template>
                <template #cell(createdStamp)="row">
                    {{ row.item.createdStamp | formatDate}}
                </template>  
                <template #cell(message)="row">
                    {{row.item.job ? row.item.job.pushedTaskCount : row.item.messageCount}}&nbsp;<router-link v-if="row.item.bulkSessionId" tag="a" 
                      :to="'/app/moderate/bulk-push-msgs/'+row.item.bulkSessionId">
                      view
                    </router-link>
                </template>  
                <template #cell(status)="row">
                    <span cursor-pointer class="fa fa-info-circle" :id="'job-stats-details-'+ row.index ">
                    </span>
                    {{row.item.status}}

                    <b-popover triggers="hover focus" :target="'job-stats-details-'+ row.index ">
                      <template #title>
                        <div class="text-align-left" v-for="(count,stat) in row.item.stats"> 
                          {{stat}} : {{count}}
                        </div>
                      </template>
                    </b-popover>
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

    import PageTitle from "../../Components/PageTitle.vue";
    import { MyFlags,MyDict,MyConst } from '../../../services/global';

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
              label : "Send New", name : "BULK_PUSH_NEW", link : "/app/moderate/bulk-push-new",
              type : "link"
            }],
            input : {
                dataranges : ['Today','Last 7 Days','Yesterday','This month','Last month'],
                daterange : {
                    startDate : null,
                    endDate : null,
                    span : "Today"
                }
            },
            filters:{
              lane:"",
              createdBy:"",
              status:"",
            },
            statusOptions:[
              {label : "RESOLVED", value:"RESOLVED"},
              {label : "COMPLETED", value:"COMPLETED"}
            ],
            sessions : {
                fields: [ 
                    { key : 'contact', label : "Account", sortable: true },
                    { key : 'bulkSessionId', label : "SessionId", sortable: true },
                    { key : 'template', label : "Template", sortable: true },
                    { key : 'createdBy', label : "by", sortable: true },
                    { key : 'createdStamp', label : "Sent@" , sortable: true},
                    { key : 'status', label : "Status" , sortable: true},
                    { key : 'message', label : "Messages", sortable: true },
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
        computed:{
            filtered(){
                if(!this.sessions.items.length) return [];
                const filtered = this.sessions.items.filter(item => {
                  return Object.keys(this.filters).every(key =>{
                    if(key === "status"){
                       switch (this.filters[key]) {
                        case "COMPLETED": 
                          return item[key] == "COMPLETED";
                        case "RESOLVED":
                         return item[key] == "RESOLVED";
                        default:
                          return true;
                       }
                    } else if(key === "contactName"){ 
                        return String(item._searchText).toLowerCase().includes(this.filters[key].toLowerCase())
                    } else{
                      return String(item[key]).toLowerCase().includes(this.filters[key].toLowerCase())
                    }
                  }
                  );
                });
                return filtered.length > 0
                  ? filtered
                  : [
                    ];
              }
        },
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
<style lang="scss">
  @import "@/assets/demo-ui/_chat-preview.scss";

</style>
<style type="text/css" scoped >
 
</style>
