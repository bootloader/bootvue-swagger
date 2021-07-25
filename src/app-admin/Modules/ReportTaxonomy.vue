<template>
    <div>
        <page-title :heading=heading :subheading=subheading :icon=icon
        :daterange=input.daterange v-on:dateRangeOnUpdate="dateRangeOnUpdate" ></page-title>

    <div style="width: 100%;clear: both;">
          <vue-multi-select
            v-model="input.tagtypes.selected"
            :btnLabel="input.tagtypes.btnLabel"
            :options="input.tagtypes.options"
            :selectOptions="input.tagtypes.values"
            @close="filter"/>
    </div>

    <hr/>

    <div style="width: 100%;clear: both;">
            <vue-word-cloud
              style=" height: 300px; width: 80%; margin: auto; "
              :words="tags"
              :font-size-ratio="5" :spacing=".25"
              :color="([, weight]) => weight > 10 ? 'DeepPink' : weight > 5 ? 'RoyalBlue' : 'Indigo'"
              font-family="Roboto"
            />
    </div>


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
                <template #cell(contactId)="row">
                    <i  class="fab"  v-bind:class="MyDict.socialPrefix(row.item.contactId)"> </i>
                    {{ row.item.contactName || row.item.contactId}}
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
                    <span style="cursor: pointer;" class="far fa-comment-alt"  @click="showChat(row.item, row.index, $event.target)" > </span>
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
    import VueWordCloud from 'vuewordcloud';

    import vueMultiSelect from 'vue-multi-select'; 
    import 'vue-multi-select/dist/lib/vue-multi-select.css';

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
            AgentChat, VueWordCloud,vueMultiSelect
           // chart1,chart2,chart3,
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'Taxonomy',
            subheading: 'Select date range for report',
            icon: 'pe-7s-chat icon-gradient bg-tempting-azure fa fa-tags',
            input : {
                daterange : {
                    startDate : null,
                    endDate : null,
                },
                tagtypes : {
                  btnLabel : values => values.length > 0 ? (values.join(',')) : 'Select Type',
                  options : { multi: true, labelName: 'Filter Types'},
                  values : [],
                  selected : []
                }
            },
            sessions : {
                fields: [
                    { key : 'type', label : "Type" , sortable: true},
                    { key : 'tag', label : "Tag", sortable: true },
                    { key : 'count', label : "Count", sortable: true },
                    //{ key : 'lastInComingStamp', label : "lastInComingStamp" },
                    //{ key : 'lastResponseStamp', label : "lastResponseStamp" },
                    //{ key : 'actions', label : "Action" }
                ],
                items : [],
                perPage: 25,
                currentPage: 1,
                rows : 0
            },
            session : null,
            allItems : [], tagTypesSelected : []

        }),
        computed : {
            tags : function () {
                if(!this.sessions || !this.sessions.items){
                  return [];
                }
                return this.sessions.items.map(function (item) {
                    return [item.tag, item.count];
                });
            }
        },
        mounted : function (argument) {
          this.dateRangeOnUpdate();
        },
        methods: {
          async getSessions (){
            var resp = await this.$store.dispatch('GetTaxonomy',{
              "agent": "TEAM",
              "contactType": "MESSAGE_TWITTER",
              "dateRange1": this.input.daterange.startDate,
              "dateReange2": this.input.daterange.endDate
            });
            this.allItems = resp.results;
            this.input.tagtypes.values = Object.keys(resp.results.reduce(function (mp,item) {
                mp[item.type] = (mp[item.type] || 0) + item.count;
                return mp;
            },{}))


            this.filter();
            //console.log("sessions",resp,this.sessions )
          },
          filter : function (argument) {
              var that = this;
              this.sessions.items = this.allItems.filter(function (item) {
                  if(!that.input.tagtypes.selected || !that.input.tagtypes.selected.length)
                    return true;
                  return that.input.tagtypes.selected.indexOf(item.type) > -1
              });
              this.sessions.rows = this.sessions.items.length;
          },
          dateRangeOnUpdate : function (r) {
               console.log("dateRangeOnUpdate",r);
               this.input.daterange.startDate = this.input.daterange.startDate.getTime();
               this.input.daterange.endDate = this.input.daterange.endDate.getTime();
               this.getSessions();
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
