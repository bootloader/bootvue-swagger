<template>
     <div class="m-contact-search card mb-sm-3 mb-md-0 contacts_card card-shadow scheme-color ">
        <div class="card-header contacts-header ">
            <div class="input-group">
                    <a class="input-group-text menu_btn new-chat fa fa-arrow-left" v-b-toggle 
                    @click="$global.MyFlags.agent.showSessionSearch=!$global.MyFlags.agent.showSessionSearch"
                    @click.prevent>
                </a>
                <input type="text" 
                    v-model="input.search.text"
                    placeholder="Search..." name="session-search" class="form-control search">
                <div class="input-group-prepend">
                    <span v-if="!!input.search.text" 
                        class="input-group-text search_btn" @click="(input.search.text='');localSessionSearch()" >
                        <i class="fa fa-close"></i></span>
                    <span v-if="!input.search.text" 
                        class="input-group-text search_btn" ><i class="fa fa-search"></i></span>
                </div>
                <div class="input-group-append">
                    <a class="input-group-text menu_btn new-chat fa fa-filter edit-search" v-tooltip="'Edit Search'"
                        @click="(showResult=!showResult)">
                    </a>
                </div>
            </div>
            
        </div>
        
        <div class="filter-wrapper col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" v-show="!showResult">

             <span class="action-wrapper text-center" >
                <date-range-picker v-model="dateranegeinput.range" class="session-search-date-picker date-range-picker-mobile"
                :opens="'right'"
                :time-picker="false"
                control-container-class="reportrange-text btn"
                :ranges="dateranegeinput.ranges"
                @select="onDateRangeSelect"
                @update="onDateRangeUpdate">
                    <!--    input slot (new slot syntax)-->
                    <template #input="picker" style="min-width: 350px;">
                        <i class="fa fa-calendar-alt" />&nbsp;{{ picker.startDate | date }} - {{ picker.endDate | date }}
                    </template>
                  </date-range-picker>
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
            <div style="text-align:center">
                <button class="btn btn-sm text-black:hover rounded-pill btn-outline-black-dirty" 
                    @click="loadSession" style="width:120px"> Search </button>
            </div>
            
        </div>
        <div class="search-result m-contact-search contacts_card card-shadow col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 "
            v-show="showResult">
                    <div class="card-body contacts_body">
                        <ul class="contacts contact-list" v-if="filteredContacts && filteredContacts.length>0">
                            
                            <router-link tag="li" v-for="(chat,index) in filteredContacts"  :key="'search-' + chat.sessionId" :data-index="index"
                                    :to="{ 
                                    name: 'defAgentView', 
                                    params: { 
                                        contactId: chat.contactId.replace('/','-'),
                                        sessionId : chat.sessionId,
                                        profileId : chat.contactId,
                                        profileView : 'hide',
                                        mvu : 'CHATBOX'
                                    }}"
                                    v-show="chat.localShow"
                                >
                                <div class="d-flex bd-highlight contact-preview">
                                    <div class="img_cont">
                                        <img v-lazy="{
                                                src : $formatters.https_thumburl(chat.profilePic || $global.MyDict.profilePic),
                                                error : $global.MyDict.profilePic
                                            }"
                                            class="rounded-circle user_img" alt="profilpicture">
                                            <span class="online_icon"></span>
                                            <span class="contact_type fab"
                                            v-bind:class="$global.MyDict.social[chat.contactType]"></span>
                                    </div>
                                    <div class="user_info contact-text">
                                        <span class="font-name" >{{chat.name || chat.contactId}}</span>
                                        <span class="font-preview">{{chat.phone || chat.email}}</span>  
                                    </div>
                                    <div class="contact-flags">
                                        <span class="contact-time">{{chat.closeSessionStamp | formatDate}}</span>
                                    </div>
                                </div>
                            </router-link>
                        </ul>
                        <ul class="contacts contact-list" v-if="filteredContacts.length==0 && !isLoading">
                            <center><small>No active session </small></center>
                        </ul>
                        <loading :active.sync="isLoading" 
                            :can-cancel="false"  
                            :loader="'dots'"
                            :is-full-page="false"></loading>

                        <ul class="contacts contact-list-unassigned">
                            
                        </ul>
            </div>
        </div>
        
    </div>
</template>

<script>

    import { MyDict } from '../../services/global';
    import DateRangePicker from 'vue2-daterange-picker'
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
    import moment from 'moment'
    import formatters from '../../services/formatters';
    import debounce from 'debounce';
    import throttle from 'throttleit';

    function hour0(mmt){
            return mmt.hour(0).minute(0).seconds(0).milliseconds(0);
    }
    function hour24(mmt){
        //return mmt.hour(24).minute(0).seconds(0).milliseconds(0);
        return mmt.hour(23).minute(59).seconds(59).milliseconds(999);
    }
    export default {
        components: {
            DateRangePicker
        },
        computed : {
            sortedQuickTags  : function () {
                return this.$store.getters.StateQuickTagsSorted;
            },
            editableStatus :function(){
                return Object.keys(MyDict.chatStatus).map((key) => MyDict.chatStatus[key]).filter((status)=>status.editable);
            }
        },
        data:() => ({
            daterange : {
                startDate : null,
                endDate : null,
            },
            dateranegeinput : (() => { 
                var startDate = hour0(moment().subtract(7,"day")).toDate(),
                endDate = hour24(moment()).toDate();

                return {
                    range: {startDate : startDate, endDate : endDate},
                    ranges : {
                        'Today': [ hour0(moment()).toDate(), hour24(moment()).toDate()],
                        'Last 7 Days': [hour0(moment().subtract(7,"day")).toDate(), 
                                            hour24(moment()).toDate()],
                        'Yesterday': [hour0(moment().subtract(1,"day")).toDate(),
                                            hour24(moment().subtract(1,"day")).toDate()],

                        'This month': [hour0(moment().date(1)).toDate(), 
                                            hour24(moment()).toDate()],
                        'Last month': [hour0(moment().subtract(1,"month").date(1)).toDate(), 
                                            hour24(moment().date(0)).toDate()],
                        // 'This year': [hour0(moment().month(0).date(1)).toDate(), 
                        //                     hour24(moment()).toDate()],
                        // 'Last year': [hour0(moment().subtract(1,"year").month(0).date(1)).toDate(), 
                        //                 hour24(moment().month(0).date(0)).toDate()],
                    }
                }
            })(),

            inputSearchText : "",
            input : {
                search: {
                    text : "",
                }
            },
            isLoading : false,
            contacts : [], filteredContacts : [],
            formatters,
            showResult : false,
            selectedStatus : [],
            selectedTag:null
        }),
        filters: {
          date(val) {   
            return val ? val.toLocaleDateString() : ''
          }
        },
        created : function (argument) {
            if(this.daterange){
                if(!this.daterange.startDate){
                    this.daterange.startDate = hour0(moment()).toDate()
                }
                if(!this.daterange.endDate){
                    this.daterange.endDate = hour24(moment()).toDate()
                }  
                this.sanitizeDateRange(this.daterange);
            }
        },
        mounted () {

        },
        watch: {
            'input.search.text': function () {
                this.localSessionSearch();
            }
        },
        methods: {
            sanitizeDateRange : function (daterange) {
                var startDate = moment(daterange.startDate);
                var endDate = moment(daterange.endDate);
                daterange.startDate = hour0(startDate).toDate();
                daterange.endDate = hour24(endDate).toDate();
                return daterange;
            },
            onDateRangeSelect : function (r) {
                var range = this.sanitizeDateRange(r);
                this.dateranegeinput.range.startDate = range.startDate;
                this.dateranegeinput.range.endDate = range.endDate;
            },
            onDateRangeUpdate : function (r) {
                if(this.daterange){
                    this.daterange.startDate = r.startDate;
                    this.daterange.endDate = r.endDate;
                }
            },
            loadSession :  debounce(async function(){
                 let tags = [];
                    for(var category in this.sortedQuickTags){
                        this.sortedQuickTags[category].map(v=>{
                            v.selected ? tags.push(v) : ""
                        }) 
                    }
                try {
                    this.filteredContacts = [];
                    this.isLoading = true;
                    this.showResult = true;
                    console.log("tags",tags);
                    let resp = await this.$service.post('/api/sessions/search', {
                        status : this.selectedStatus, 
                        tags : tags,
                        fronStamp : this.daterange.startDate.getTime(),
                        toStamp :  this.daterange.endDate.getTime()
                    });
                    this.contacts = resp.results.map(function(session){
                        session.localSearch = JSON.stringify(session.contact).toLowerCase();
                        return session;
                    });
                    this.localSessionSearch();
                } finally {
                    this.isLoading = false;
                }
            },50),
            localSessionSearch :  throttle(async function(){
                let THAT = this;
                let search = THAT.input.search.text.toLowerCase();
                this.filteredContacts = (this.contacts || []).filter(function(session) {
                    session.localShow = session.localSearch.indexOf(search) > -1
                    return session.localShow;
                });
            },500),
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
            }
        }
    }
</script>
<style type="text/css" scoped="">
    h2{
        padding-top:20px;
    }
    .m-contact-search.card {
        border-radius: 0px !important;
        min-width: 200px;
    }
    .contacts_body{
        padding: 0 0 !important;
        overflow-y: auto;
        white-space: nowrap;
        background-color: #f5f5f5;
    }

    .contacts-header .new-chat {
        font-size: 20px;
        text-decoration: none;
        line-height: 23px;
    }

    .contacts-header{
        padding: 0.75rem 0.5rem;
    }
    .contacts{
        list-style: none;
        padding: 0;
        max-width: 348px;

        list-style: none;
        max-width: calc(100% - 0px);
    }
    .contacts li{
        width: 100% !important;
        padding: 5px 10px;
        border-bottom: 1px solid #00000008;
        cursor: pointer;
        border-left: 5px solid #0000;
        border-right: 5px solid #0000;
    }
    .contacts li:hover{
        border-left: 5px solid #1d375273;
    }
    .contacts li.router-link-exact-active{
      border-left: 5px solid #1d3752;
      background-color: rgba(0,0,0,0.3);
    }
    .contacts li.router-link-exact-active, .contacts li.active_contact {
        background-color: rgb(0 0 0 / 6%)
    }




    .contact_type {
        width: 24px;
        height: 22px;
        font-size: 12px;
    }
    .contact-preview .contact_type{
      bottom: 0px;
      right: 0px;
      position: absolute;
    }
    

    .contact-text .font-name{
        text-overflow: ellipsis;
        max-width: 187px;
        overflow: hidden;
        /*font-weight: 300;*/
    }
    .contact-text .font-preview{
        text-overflow: ellipsis;
        max-width: 187px;
        overflow: hidden;
        font-size: 10px;
        display: block;
    }
    .cat-title{
        font-size: 12px;
    }
  
    #chattags hr{
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .tag{
        border-color: #000 !important;
        color: #000 !important;
    }
    .tag.tag-chat-status-active{
        color: #fff !important;
    }
    /* .edit-search{
        color: #000;
        border-color: #000;
        float: right;
        position: relative;
        right: 20px;
        top: 11px;
        font-size: 18px;
    } */
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
        padding-bottom: 80px;

        .section-divider {
            width: 100%;
            height: 13px; 
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.137); 
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
   
</style>
<style lang="scss">
    .session-search-date-picker.vue-daterange-picker {
        min-height: 35px;
        .reportrange-text{
            min-height: calc(2.25rem + 0px);
            margin-top: 0px;
            font-size: inherit;
            font-weight: bold;
            border-color: #000000 !important;
        }
        .daterangepicker.show-calendar .ranges {
            padding: 0px !important;
        }
    }

    .btn-outline-black-dirty {
        color: #5a5a5a;
        border-color: #5a5a5a;
    }
</style>