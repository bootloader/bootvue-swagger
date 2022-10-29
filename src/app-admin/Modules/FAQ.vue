<template>
    <div>
       <!-- <master-view id="agent-session-list" 
            :header="{
                heading: heading,
                subheading: subheading,
                icon: icon,
            }"
            goodTable
            :filters="[{ label : 'ADD FAQ Article', name : 'addfaq'}]"
            :table="{...sessions}"
            :busy="sessions.busy"
            >
            <template #filter(addfaq)>
              <span class="btn btn-success" @click="faqAdd">
                ADD FAQ Article
              </span>
          </template>

            <template #groupBy="code">
              <span class="text-successs badge btn btn-xs btn-dark">
                {{code.item.label}}
              </span>
          </template>
          <template #cell(actions)="row">
                <span class="text-center">
                <span class="far fa-edit mg-1 pointer text-primary text-bold" 
                    v-tooltip="'View Chat'"
                    @click="faqEdit(row.item, row.index, $event.target)" ></span>
                    &nbsp;<span v-if="row.item.feedback"
                    class="bi bi-emoji-smile mg-1 pointer text-primary text-bold" 
                    v-tooltip="row.item.feedback.tag">
                    {{row.item.feedback.score}}
                    </span>
                    </span>
          </template>
        </master-view> -->
        <tree-table
          class="table"
          :columns="sessions.fields"
          :table-data="sessions.items" />
      <div class="chat_archive"  v-bind:class="{closed : !faqMode}" >
        <div class="card card-shadow chat_box_wrapper">
                <div class="card-header msg_head chat-head d-flex justify-content-between">
                    <div class="bd-highlight chat-header-left flex-fill d-flex justify-content-start ">
                        <div class="user_info">
                            <span class="user_name">Test</span>
                        </div>
                    </div>
                    <div  class="chat-header-right">
                        <div class="video_cam">
                            <span  @click="hideChat" v-tooltip="'Close'" style="cursor: pointer;">
                                <i class="fa fa-close"></i>
                            </span> 
                        </div>
                    </div>
                </div>
                <div class="card-body msg_card_body">
                    <v-select   class="w-100"
                        :searchable="false" :clearable="false"
                        :options="parentList"
                        placeholder="Select Parent"
                        v-model="editModal.parent"
                        />
                    <br/>
                    <base-input
                        class="mb-0" prependClass="btn btn-outline-primary"
                        prelabel label="Short Description" 
                        v-model="editModal.translation.en.shortdesc" :textLimit="200" required
                        rules="required|max:100" >
                    </base-input>
                    <base-input
                        class="mb-0" prependClass="btn btn-outline-primary"
                        prelabel label="Title" 
                        v-model="editModal.translation.en.title" :textLimit="200" required
                        rules="required|max:200" >
                    </base-input>
                    <base-text-area  name="Body" layout="flushed"
                        placeholder="Body" v-model="editModal.translation.en.code" 
                        :rows="1"
                        :textLimit="60"
                        >
                    </base-text-area>
                </div>

                <div class="card-footer">
                    <b-row>
                        <b-col cols="6">
                            <span class="btn btn-primary" 
                            @click="addFAQ" v-if="faqMode=='ADD'">
                            Add
                            </span>
                            <span class="btn btn-primary" 
                            @click="updateFAQ" v-if="faqMode=='EDIT'">
                            Update
                            </span> &nbsp; &nbsp;
                            <span class="btn btn-primary" 
                            @click="hideChat">
                            Cancel
                            </span>
                        </b-col>
                    </b-row>    
 

                </div>
            </div>
      </div>        
    </div>

</template>

<script>

    import PageTitle from "../Components/PageTitle.vue";
    import { MyFlags,MyDict,MyConst } from '../../services/global';
    import AgentChat from './AgentChat';
    import DataProcessor from '../../services/DataProcessor';
    import moment from 'moment'
    import vSelect from 'vue-select'

    import DateRangePicker from 'vue2-daterange-picker'
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
    //import chart1 from './Analytics/chart1';
    //import chart2 from './Analytics/chart2';
    //import chart3 from './Analytics/chart3';
    import formatters from '../../services/formatters';
    import TreeTable from 'vue-tree-table-component'


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
            DateRangePicker,
            vSelect,
            TreeTable
           // chart1,chart2,chart3,
        },
        computed:{
         
            sortedQuickTags  : function () {
                return this.$store.getters.StateQuickTagsSorted;
            },
            editableStatus :function(){
                return Object.keys(MyDict.chatStatus).map((key) => MyDict.chatStatus[key]).filter((status)=>status.editable);
            }
        },
       
        
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'FAQ',
            subheading: 'faq',
            icon: 'pe-7s-chat icon-gradient bg-tempting-azure fa fa-chalkboard-teacher',
            sessions : {
                sortBy: 'lastSessionStamp',
                sortDesc: true,
                fields: [ 
                    { id : 'parent', label : "Parent"},
                    { id : 'shortdesc', label : "Short Title"},
                    { id : 'tittle', label : "Title"}   
                ],
                items : [],
                groupBy : 'code',
                perPage: 25, currentPage: 1,
                rows : 0,
                busy : false,
            },
            editModal:{
                code:"",
                parent:"",
                translation:{
                    en:{
                        shortdesc:"",
                        tittle:"",
                        code:""
                    }
                },
                status:"Y"

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
            parentList:[],
            faqMode:null
        }),
        created:async function(){
           await this.$store.dispatch('LoadQuickTags')
        },
        mounted : function (argument) {
          //this.dateRangeOnUpdate();
          this.loadSessions();
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
            try{
              var resp = await this.$store.dispatch('getAllFAQ');
              console.log("resp",resp);
                let data = resp.results.map(v=>{
                    return {
                        ...v,
                        shortDesc:v.translation?.en?.shortDesc,
                        in_code:v.translation?.en?.code,
                        body:v.translation?.en?.body,
                        title:v.translation?.en?.title 
                    }
                });
                const idMapping = data.reduce((acc, el, i) => {
                    console.log("el.code",el.code,i);
                    acc[el.code?.toUpperCase()] = i;
                    return acc;
                }, {});
                let root;
                data.forEach((el) => {
                // Handle the root element
                    if (!el.parent || el.parent === "" || el.parent == el.code) {
                        root = el;
                        return;
                    }
                    console.log("el.parent",el.parent)
                    // Use our mapping to locate the parent element in our data array
                    const parentEl = data[idMapping[el.parent.toUpperCase()]];
                    // Add our current el to its parent's `children` array
                    parentEl.children = [...(parentEl?.children || []), el];
                });
                console.log("root",data );
              this.sessions.items = data;
              this.sessions.rows = this.sessions.items.length;
            //   this.parentList = this.sessions.items.map(v=>{
            //     return {
            //         label:v.translation.en.shortdesc,
            //         value:v.code
            //     }
            //     })
            //     console.log("this.parentList",this.parentList);
            } finally {
              this.sessions.busy=false
            }
          },
          dateRangeOnUpdate : function (r) {
              this.input.daterange.startDate = r.startDate;
              this.input.daterange.endDate = r.endDate;
              this.loadSessions();
          },
          hideChat : function (argument) {
            this.faqMode = null;
          }, 
          faqEdit: function (r) {
              this.faqMode = "EDIT"
              this.editModal = r;
          },
          faqAdd: function (r) {
                this.faqMode = "ADD"
                this.editModal = {
                    code:"",
                    parent:"",
                    translation:{
                        en:{
                            shortdesc:"",
                            tittle:"",
                            code:""
                        }
                    },
                    status:"Y"

                };
          },
          addFAQ : async function (params) {
            var resp = await this.$store.dispatch('CreateFAQ', this.editModal);
            console.log("resp",resp);
            this.loadSessions();
          },
          updateFAQ : async function (params) {
            var resp = await this.$store.dispatch('UpdateFAQ', this.editModal);
            console.log("resp",resp);
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
    box-shadow:-2px 0px 15px -10px #000;
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