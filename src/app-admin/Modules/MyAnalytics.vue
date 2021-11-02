<template>
    <div>
        <page-title :heading=heading :subheading=subheading :icon=icon
        :actions=actions
        :filters=filters
        :daterange=input.daterange v-on:dateRangeOnUpdate="dateRangeOnUpdate"
        @action="onAction" >
            <template #filter(agent)="{filter}">
                <MyAgentSelect v-model="filter.value" @change="agentSelect" emptyDisplay="All Teams"> </MyAgentSelect>
            </template>
        </page-title>

        <div class="card mb-3">
            <div class="no-gutters row">
                <div class="col-md-12 col-lg-4">
                    <ul class="list-group list-group-flush">
                        <li class="bg-transparent list-group-item"  >
                            <div class="widget-content p-0" >
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper" v-tooltip="'Total Session'">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Unique Conversations</div>
                                            <div class="widget-subheading">{{summary.uniqueConversation | number('0,0')}}</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers text-success">{{summary.uniqueConversation | number}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="bg-transparent list-group-item"  >
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper" v-tooltip="'Total I/O messages'">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Messages Exchanged</div>
                                            <div class="widget-subheading">{{summary.totalMsgExchanged | number('0,0')}}</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers text-primary">{{summary.totalMsgExchanged | number}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="col-md-12 col-lg-4">
                    <ul class="list-group list-group-flush">
                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Lead Messenger</div>
                                            <div class="widget-subheading"
                                                v-if="summary.leadMessanger && summary.leadMessanger.contactType"
                                            >{{summary.leadMessanger.contactType.replace('MESSAGE_','')}}</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers text-danger"
                                                v-if="summary.leadMessanger && summary.leadMessanger.contactType"
                                            >{{summary.leadMessanger.percentage}}<small class="opacity-5">%</small></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Peak Time</div>
                                            <div class="widget-subheading"
                                                v-if="summary.peakLoad && summary.peakLoad.timestamp">
                                                {{summary.peakLoad.timestamp}}
                                            </div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers text-warning"
                                              v-if="summary.peakLoad && summary.peakLoad.total">
                                                {{summary.peakLoad.total}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="col-md-12 col-lg-4">
                    <ul class="list-group list-group-flush">
                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Start Lag</div>
                                            <div class="widget-subheading">Avg. time to agent response</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers text-success">{{summary.startLag | timespan}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Conversation Duration</div>
                                            <div class="widget-subheading">Avg. session duration</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers text-primary">{{summary.converDuration | timespan}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 col-xl-3">
                <div
                    class="card mb-3 widget-chart widget-chart2 text-left card-btm-border card-shadow-success border-success">
                    <div class="widget-chat-wrapper-outer">
                        <div class="widget-chart-content pt-3 pl-3 pb-1">
                            <div class="widget-chart-flex">
                                <div class="widget-numbers">
                                    <div class="widget-chart-flex">
                                        <div class="fsize-4">
                                            <small class="opacity-5"></small>
                                            <span>{{summary.openConversation | number}}</span></div>
                                    </div>
                                </div>
                            </div>
                            <h6 class="widget-subheading mb-0 opacity-5">Open Conversations</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-3">
                <div
                    class="card mb-3 widget-chart widget-chart2 text-left card-btm-border card-shadow-primary border-primary">
                    <div class="widget-chat-wrapper-outer">
                        <div class="widget-chart-content pt-3 pl-3 pb-1">
                            <div class="widget-chart-flex">
                                <div class="widget-numbers">
                                    <div class="widget-chart-flex">
                                        <div class="fsize-4">
                                            <small class="opacity-5"></small>
                                            <span>{{summary.resolvedConversation | number}}</span></div>
                                    </div>
                                </div>
                            </div>
                            <h6 class="widget-subheading mb-0 opacity-5">Resolved Conversation</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-3">
                <div
                    class="card mb-3 widget-chart widget-chart2 text-left card-btm-border card-shadow-warning border-warning">
                    <div class="widget-chat-wrapper-outer">
                        <div class="widget-chart-content pt-3 pl-3 pb-1">
                            <div class="widget-chart-flex">
                                <div class="widget-numbers">
                                    <div class="widget-chart-flex">
                                        <div class="fsize-4">
                                            <small class="opacity-5"></small>
                                            <span>{{summary.botScore}}</span></div>
                                    </div>
                                </div>
                            </div>
                            <h6 class="widget-subheading mb-0 opacity-5">Satisfaction Score</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-3">
                <div
                    class="card mb-3 widget-chart widget-chart2 text-left card-btm-border card-shadow-danger border-danger">
                    <div class="widget-chat-wrapper-outer">
                        <div class="widget-chart-content pt-3 pl-3 pb-1">
                            <div class="widget-chart-flex">
                                <div class="widget-numbers">
                                    <div class="widget-chart-flex">
                                        <div class="fsize-4">
                                            <span>{{summary.botClosure}}</span></div>
                                            <small class="opacity-5">%</small>
                                    </div>
                                </div>
                            </div>
                            <h6 class="widget-subheading mb-0 opacity-5">BOT Closure</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="row">
            <div class="col-md-6 col-xl-6">
                <b-card :title="'Messages - Team'" class="main-card mb-3" :key="chart.updated">
                  <lineeg
                    :cdata="chart.summary"
                  ></lineeg>
                </b-card>
            </div>
            <div class="col-md-6 col-xl-6">
                <b-card :title="'Messages - Individuals'" class="main-card mb-3" :key="chart.updated">
                  <lineeg
                    :cdata="chart.summaries"
                  ></lineeg>
                </b-card>
            </div>
        </div>


    </div>

</template>

<script>
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';
    import PageTitle from "..//Components/PageTitle.vue";
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'

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
    } from '@fortawesome/free-solid-svg-icons'
    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
    import lineeg from './../Charts/MyLine'
    import {newChartData,updateChartData} from './../Charts/MyLine'
    import MyAgentSelect from '../../@common/custom/components/MyAgentSelect.vue';

    library.add(
        faTrashAlt,
        faCheck,
        faAngleDown,
        faAngleUp,
        faTh,
        faCalendarAlt,
    );



    function toMap(maps) {
        var gbm = {};
        for(var mapname in maps){
            var map = maps[mapname] || {};
            Object.keys(map.graphApiDetails || {}).map((key) => {
                gbm[key] = gbm[key] || { 
                    date : key,
                    _date : key.split("-").reverse().join(""), 
                    values : {}
                }
                gbm[key].values[map.agentName] = map.graphApiDetails[key]
            })
        }
        var cData = newChartData();
        Object.keys(gbm).sort(function (a,b) {
            return gbm[a]._date - gbm[b]._date;
        }).map(function(key){
            var data = gbm[key];
            cData.labels.push(key);
            for(var agentName in data.values){
                cData.series[agentName] = cData.series[agentName] || [];
                cData.series[agentName].push(data.values[agentName])
            }
        });
        return cData;
    }

    export default {
        components: {
            PageTitle,
            VuePerfectScrollbar,
            'font-awesome-icon': FontAwesomeIcon,
           // chart1,chart2,chart3,
            lineeg,
            vSelect,
                MyAgentSelect
        },
        data: () => ({
            heading: 'Analytics Dashboard',
            subheading: 'Select date range for report',
            icon: 'pe-7s-graph3 icon-gradient bg-tempting-azure',
            graphs : [
                {
                    title : "Conversations - Cumulative",
                    data : [65, 59, 80, 81, 56, 55, 40] 
                },
                {
                    title : "Conversations - individuals",
                    data : [65, 59, 80, 81, 56, 55, 40] 
                },
                {
                    title : "Messages - Team",
                    data : [65, 59, 80, 81, 56, 55, 40] 
                },
                {
                    title : "Messages - Individuals",
                    data : [65, 59, 80, 81, 56, 55, 40] 
                },
            ],
            input : {
                daterange : {
                    startDate : null,
                    endDate : null
                }
            },
            actions : [{
              name : "REFRESH", type : "apply", icon : "fa fa-sync"
            }],
            filters : [
                {
                    name : "agent", 
                    type : "agentSelect", 
                    options:[], 
                    value: null
                }],
            summary : {
                "contactType": null,
                "filter": null,
                "agentName": "TEAM",
                "totalInMsgExchanged": 0,
                "totalOutMsgExchanged": 0,
                "totalMsgExchanged": 0,
                "uniqueConversation": 0,
                "openConversation": 0,
                "resolvedConversation": 0,
                "converDuration": 0,
                "startLag": 0,
                "peakLoad": {},
                "botScore" : 0, "botClosure" : 0,
                "graphApiDetails": {

                },
                "leadMessanger": {
                    "contactType": "MESSAGE_WEBSITE",
                    "noOfMessage": 0,
                    "totalContactMessage": 0,
                    "percentage": 0
                }
            },
            agentList : [],
            summaries : [],
            chart : {
                updated : new Date().getTime(),
                summary : newChartData("summary0"),
                summaries : newChartData("summaries0")
            },
            model: {
                agent: '',
            },
        }),
        computed :  {
            // summaryChart : function (argument) {
            //     return this.summaryChart_;
            // }, summariesChart : function (argument) {
            //     return this.summariesChart_;
            // } 
        },
        mounted : function (argument) {
          this.dateRangeOnUpdate();
        },
        methods: {
          getTime : function (date) {
              return date ? date.getTime(): date;
          },
          async loadAnalytics (){
            var resp = await this.$store.dispatch('LoadAnalytics',{
              "agent": this.filters[0].value ? this.filters[0].value : "TEAM",
              "contactType": {},
              "dateRange1": this.getTime(this.input.daterange.startDate),
              "dateReange2": this.getTime(this.input.daterange.endDate)
            });
            this.summary = (resp.data || {});
            this.summaries = (resp.results || []);

            this.chart.updated = new Date().getTime();
            this.chart.summary.update(toMap([resp.data || {}]));
            this.chart.summaries.update(toMap(resp.results || []));
            
            console.log("this.summariesChart",this.chart)
            this.$forceUpdate();
          },
          dateRangeOnUpdate : function (r) {
            this.loadAnalytics();
          },
          agentSelect : function (v) {
            this.filters[0].value = v;
            this.loadAnalytics();
          },
          onAction : function (argument) {
            console.log("onAction",argument)
            switch(argument.type){
              case "apply" :
                this.loadAnalytics();
                break;
              default: {
                console.log("NoMapping",argument) 
              }
            }
          }
        },
        

    }


</script>
<style type="text/css">

</style>
