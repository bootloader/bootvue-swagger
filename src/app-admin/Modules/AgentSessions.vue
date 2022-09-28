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
                    <span class="btn btn-success margin-right-5px" @click="openFilterPopup">
                      <i class="fa fa-filter"/>
                    </span>
                    <span class="btn btn-success" @click="loadSessions">
                      <i class="fa fa-refresh"/>
                    </span>
                </template>

                <template #top-row="row">
                      <b-th><input type="search" v-model="filters.assignedToAgent"  class="form-control form-control-sm" /></b-th>
                      <b-th><input type="search" v-model="filters.contactName"  class="form-control form-control-sm" /></b-th>
                      <b-th>&nbsp;</b-th>
                      <b-th>&nbsp;</b-th>
                      <b-th>
                        <select class="form-control form-control-sm" v-model="filters.fistResponseStamp" @click.stop.prevent>
                            <option value="">--</option>
                            <option :value="option.value" v-for="option in fistResponseOptions" :key="option.value">{{ option.label }}</option>
                        </select>
                      </b-th>
                      <b-th>
                        <select class="form-control form-control-sm" v-model="filters.lastSessionStamp" @click.stop.prevent>
                          <option value="">--</option>
                          <option :value="option.value" v-for="option in closeSessionOptions" :key="option.value">{{ option.label }}</option>
                        </select>    
                      </b-th>
                </template>
                <template #cell(assignedToAgent)="row">
                    <my-icon type="chatmode" :value="row.item.mode" />
                    {{ row.item.assignedToAgent}}
                    <span v-if="row.item.assignedToDept">
                      ({{row.item.assignedToDept}})
                    </span>
                     <span v-if="row.item.assignedToQueue">
                      | {{row.item.assignedToQueue}}
                    </span>
                </template>
                <template #cell(contactId)="row">
                     <MyText options="getx:/api/options/channels" class="mr-2 btn btn-xs btn-outline-grey text-xs text-uppercase"
                          v-model="row.item.local.channelId" invalidDisplay="DEMO"
                          optionLabel="channelCode"/>

                    <i  class="fab"  v-bind:class="MyDict.socialPrefix(row.item.contactType)"> </i>
                    {{ row.item | contactName}}

                    <span cursor-pointer class="fa fa-info-circle" :id="'template-details-'+ row.index ">
                    </span>
                    <b-popover triggers="hover focus" :target="'template-details-'+ row.index "
                      custom-class="">
                      <template #default class="message-preview"> 
                          <div class="message-text text-bold ">{{row.item.contactName}}</div>
                          <div class="message-text text-bolder" v-if="row.item.subject">{{row.item.subject}}</div>
                          <div class="message-text text-italic text-xs">{{row.item.contactId}}</div>
                          <div class="message-text text-italic text-sm">{{row.item.sessionId}}</div>
                      </template>
                    </b-popover>

                </template>
                <template #cell(startSessionStamp)="row">
                    {{ row.item.startSessionStamp | formatDate}}
                </template>
                <template #cell(fistResponseStamp)="row">
                    {{ row.item.fistResponseStamp | formatDate}} 
                </template>
                <template #cell(lastSessionStamp)="row">
                    <span class="fa text-xs" :class="{
                        'text-success' : row.item.local.open,
                        'text-danger' : row.item.local.expired,
                        'text-info' : row.item.local.resolved,
                        'fa-dot-circle' : row.item.primary,
                        'fa-circle' : !row.item.primary
                      }" />
                      {{ row.value | formatDate}}
                </template>   
                <template #cell(actions)="row">
                    <span class="text-center">
                    <span class="far fa-comment-alt mg-1 pointer text-primary text-bold" 
                      v-tooltip="'View Chat'"
                     @click="showChat(row.item, row.index, $event.target)" ></span>
                      &nbsp;<span v-if="row.item.feedback"
                        class="bi bi-emoji-smile mg-1 pointer text-primary text-bold" 
                        v-tooltip="row.item.feedback.tag">
                        {{row.item.feedback.score}}
                      </span>
                      </span>
                </template>

                <template #filter(daterange)>
                    <MyDatePicker 
                      :daterange="input.daterange"
                      @dateRangeOninit="dateRangeOnUpdate"
                      @dateRangeOnUpdate="dateRangeOnUpdate"
                    > </MyDatePicker>
                </template>
        </master-view>
      <b-modal :id="modelName" :title="'Session Filter'" size="lg" hide-footer>
        <div class="filter-wrapper col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <span class="action-wrapper text-center" >
               <MyDatePicker  class="session-search-date-picker date-range-picker-mobile"
                      :daterange="input.daterange"
                      :ranges="input.dataranges"
                      @dateRangeOninit="dateRangeOnUpdate"
                      @dateRangeOnUpdate="dateRangeOnUpdate" >
                    <template #input="picker" style="min-width: 350px;">
                        <i class="fa fa-calendar-alt" />&nbsp;{{ picker.startDate | date }} - {{ picker.endDate | date }}
                    </template>
                </MyDatePicker>

            </span>
            <br/>
            <div class="section-divider">
                 <span class="cat-title section-title">Chat Status</span>
            </div>
            <div>
                <span v-for="(status,s) in editableStatus" v-bind:key="s"
                    class="tag-chat-status-lg tag" @click="selectStatus(s)"
                    :class="'tag-chat-status-'+ s + (selectedStatus.indexOf(s) != -1 ? ' tag-chat-status-active' : '')">
                    {{status.label}}
                </span>
            </div>

            <div v-for="(category, categoryName) in sortedQuickTags" v-bind:key="categoryName" class="mt-3">
                <div class="section-divider">
                    <span class="cat-title section-title">{{categoryName}}</span>
                </div>
                <span v-for="(tag, index) in sortedQuickTags[categoryName]"  v-bind:key="index"
                    @click="selectTag(tag)"
                    :class="'tag-chat-status-lg tag ' + 
                    (tag.selected  ? ' tag-chat-status-active' : '')">
                    {{tag.title}} 
                </span>
                
            </div>
            <hr />
            <i  class="note" :class="searchError ? 'shake-horizontal' : ''">Select a minimum of one filter element to continue</i>
            <div style="text-align:center">
                <b-button class="btn btn-sm text-black:hover rounded-pill btn-outline-black-dirty" 
                    @click="loadSessions" style="width:120px"> Search </b-button>
            </div>
            <hr />
            <i class="note">The search works on the principle of AND / OR operation when elements from multiple categories are selected. AND is applied across different categories and OR is applied within the category</i>
        </div>
        <template #modal-footer>
        
      </template>
      </b-modal>
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
    import moment from 'moment'
    import DateRangePicker from 'vue2-daterange-picker'
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
    //import chart1 from './Analytics/chart1';
    //import chart2 from './Analytics/chart2';
    //import chart3 from './Analytics/chart3';
    import formatters from '../../services/formatters';
    function hour0(mmt){
            return mmt.hour(0).minute(0).seconds(0).milliseconds(0);
    }
    function hour24(mmt){
        //return mmt.hour(24).minute(0).seconds(0).milliseconds(0);
        return mmt.hour(23).minute(59).seconds(59).milliseconds(999);
    }

    export default {
        components: {
            PageTitle,
            AgentChat,
            DateRangePicker
           // chart1,chart2,chart3,
        },
        computed:{
          filtered() {
                if(!this.sessions.items.length) return [];
                const filtered = this.sessions.items.filter(item => {
                  return Object.keys(this.filters).every(key =>{
                    if(key === "lastSessionStamp"){
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
                    } else if(key === "fistResponseStamp"){
                       switch (this.filters[key]) {
                        case 0: 
                          return item[key] == 0;
                        case "attended":
                         return item[key] != 0;
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
              },
            sortedQuickTags  : function () {
                return this.$store.getters.StateQuickTagsSorted;
            },
            editableStatus :function(){
                return Object.keys(MyDict.chatStatus).map((key) => MyDict.chatStatus[key]).filter((status)=>status.editable);
            }
        },
        filters : {
          contactName(session){
            return session.contactName || session?.contact?.name || session.contactId;
          },
          date(val) {   
            return val ? val.toLocaleDateString() : ''
          }
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'Chat Sessions',
            subheading: 'Select date range for report',
            icon: 'pe-7s-chat icon-gradient bg-tempting-azure fa fa-chalkboard-teacher',
            sessions : {
                sortBy: 'lastSessionStamp',
                sortDesc: true,
                fields: [ 
                    { key : 'assignedToAgent', label : "Assigned", sortable: true},
                    { key : 'contactId', label : "Contact", sortable: false},
                    { key : 'actions', label : "Action", sortable: false },
                    { key : 'startSessionStamp', label : "Start@", sortable: true},
                    { key : 'fistResponseStamp', label : "Agent@", sortable: false },
                    //{ key : 'lastInComingStamp', label : "lastInComingStamp" },
                    //{ key : 'lastResponseStamp', label : "lastResponseStamp" },
                    { key : 'lastSessionStamp', label : "Closed@", sortable: true, sortByFormatted:true,
						            formatter: (v,k,item) => (item.closeSessionStamp || item.updatedStamp)},
                    //{ key : 'actions', label : "Action" }
                ],
                items : [],
                perPage: 20, currentPage: 1,
                rows : 0,
                busy : false,
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
              lastSessionStamp:"",
              fistResponseStamp:"",
            },
            input : {
                dataranges : ['Today','Last 7 Days','Yesterday','This month','Last month'],
                daterange : {
                    startDate : null,
                    endDate : null,
                    span : "Today"
                }
            },
            session : null,
            filteron:true,
            formatters,
            modelName :  "MODAL_FILTER",
            selectedStatus : [],
            selectedTag:null,
            searchError : false,
            daterange : {
                startDate : null,
                endDate : null,
                span : "Today"
            },
        }),
        created:async function(){
           await this.$store.dispatch('LoadQuickTags')
        },
        mounted : function (argument) {
          //this.dateRangeOnUpdate();
          //this.loadSessions();
        },
        methods: {
          openFilterPopup(){
            this.$bvModal.show(this.modelName)
          },
          selectTag : function (tag) {
              this.sortedQuickTags[tag.category].map((v,i)=>{
                    this.sortedQuickTags[tag.category][i].selected = (v.id == tag.id) ?  !v.selected : v.selected;
              })
              // this.selectedTag = this.selectedTag  && this.selectedTag.id == tag.id ?  null : tag;
          },
          selectStatus : function (status) {
              let sIndex = this.selectedStatus.indexOf(status);
                sIndex != -1 ? this.selectedStatus.splice(sIndex, 1) : this.selectedStatus = [...this.selectedStatus, status];
              console.log("this.selectedStatus", this.selectedStatus, status, sIndex);
          },
          onDateRangeUpdate : function (r) {
              if(this.daterange){
                  this.daterange.startDate = r.startDate;
                  this.daterange.endDate = r.endDate;
              }
          },
          async loadSessions (){
            let tags = [];
            for(var category in this.sortedQuickTags){
                this.sortedQuickTags[category].map(v=>{
                    v.selected ? tags.push(v) : ""
                }) 
            }
            // if(!tags.length && !this.selectedStatus.length){
            //     this.searchError = true;
            //     setTimeout(() => {
            //         this.searchError = false;
            //     }, 2000);
            //     return;
            // }
            this.$bvModal.hide(this.modelName)
            this.sessions.busy=true
            try{
              var resp = await this.$store.dispatch('GetSessions',{
                "agent": "TEAM",
                "contactType": "MESSAGE_TWITTER",
                status : this.selectedStatus, 
                tags : tags,
                rangeStamp : (this.input.daterange.endDate - this.input.daterange.startDate),
                startStamp : this.input.daterange.startDate,
                endStamp :  this.input.daterange.endDate
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

  .tag{
    border-color: #000 !important;
    color: #000 !important;
  }
  .tag.tag-chat-status-active{
      color: #fff !important;
  }
.tag-chat-status-active{
    background-color: #000 !important;
    border-color: #000 !important;
    color: #fff !important;
    font-weight: normal !important;
    border-width: 1px !important;
}
.margin-right-5px{
  margin-right: 5px;
}  
</style>
<style lang="scss" scoped="">
    .action-wrapper {
        display: block ;
    }
    .filter-wrapper {
        padding:15px 20px;
        display: block;
        background: #fff;
        overflow-y: scroll;
        height: 100%;

        .section-divider {
            width: 100%;
            height: 13px; 
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05); 
            text-align: left;
            .section-title {
                font-size: 12px; 
                background-color: #ffffff; 
                padding: 0 5px;
                border-radius: 5px;
            }
        }

    }
    .session-search-wrapper{
        background: #fff !important;
    }
    .search-result{
        background: #fff !important;
        padding: 0;
        overflow-y: scroll;
    }
   .tag{
       margin: 0 4px 4px 0;
       user-select: none;
       cursor: pointer;
       background-color: #fff;
        text-transform: uppercase;
   }
    .contact-preview {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;

        font-size: 16px;
        
        .img_cont,
        .user_img {
            width: 40px;
            height: 40px;
            flex-grow: 0;
        }

        .contact-text {
            flex-grow: 1;
            margin-left: 15px;
            height: 40px;
            color : rgba(21, 21, 21, 0.68);
            width: calc(100% - 160px);
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .contact-flags {
            float: right;
            text-align: right;
            align-self :baseline;
            flex-grow: 0;
            .contact-time{
                font-size: .6em;
                text-align: right;
                float: right;
            }
        }

    }
   .note{
       font-size: 12px;
   }
   .text-center{
        text-align: center;
        display: block;
    }
</style>

<style lang="scss">
    .m-session-search{
        .contacts-header {
            .contact-search {
                border-radius: 15px 0 0 15px !important;
                background-color: rgba(0,0,0,0.3) !important;
                border: 0 !important;
                line-height: 20px;
                margin-top: 0px;
                margin-bottom: 0px;
                background: transparent;
                outline: 0;
                color: white !important;
                resize: none;
                background: transparent;
                border: 0 !important;
                outline: 0;
                &:focus{
                    box-shadow:none !important;
                    outline:0px !important;
                }
            }
        }
    }
    .session-search-date-picker.vue-daterange-picker {
        min-height: 35px;
        .reportrange-text{
            min-height: calc(2.25rem + 0px);
            margin-top: 0px;
            font-size: inherit;
            font-weight: bold;
            border-color: #000000 !important;
            color: #fff;
        }
        .daterangepicker.show-calendar .ranges {
            padding: 0px !important;
        }
    }

    .btn-outline-black-dirty {
        color: #5a5a5a;
        border-color: #5a5a5a;
    }

    .shake-horizontal {
        animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
        color: red;
        display: inline-block;
    }
    @keyframes shake-horizontal {
        0%,
        100% {
            transform: translateX(0);
        }
        10%,
        30%,
        50%,
        70% {
            transform: translateX(-10px);
        }
        20%,
        40%,
        60% {
            transform: translateX(10px);
        }
        80% {
            transform: translateX(8px);
        }
        90% {
            transform: translateX(-8px);
        }
    }

    input[type=search]::-webkit-search-cancel-button {
        -webkit-appearance: searchfield-cancel-button;
    }
    
    .agent-session-list .row td:nth-child(3){
        text-align: center;
    }
    
</style>