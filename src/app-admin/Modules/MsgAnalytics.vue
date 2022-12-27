<template>
    <div class="dashboard">
        <page-title :heading=heading :subheading=subheading :icon=icon>
        </page-title>
    <b-container fluid class="mt--9">
        <!--Tables-->
      <b-row class="mt-5">
        <b-col xl="12" class="mb-5 mb-xl-0">
            <dynamic-left-top-freeze-table 
                headerTitle="Hourly number of messages exchanged" 
                :tableData="getHourDataTable" 
                :loading="loading.hourDataTable"
                :optionOnChange="hourOptionOnChange" 
                :refresh="loadHourwiseSummary"
                :options="hourOptions">
            </dynamic-left-top-freeze-table>
        </b-col>
      </b-row>
      <!--End tables-->
    </b-container>
    
    <b-container fluid class="mt--9">
        <!--Tables-->
      <b-row class="mt-5">
        <b-col xl="12" class="mb-5 mb-xl-0">
            <dynamic-left-top-freeze-table 
                headerTitle="Daily number of messages exchanged" 
                :tableData="getDayDataTable" 
                :daterangeChange="onDaysDaterangeChange"
                :loading="loading.dayDataTable"
                :refresh="loadDaywiseSummary"
                :colHeadFormatter="dateFormatter"
                :daterange="daterange">
            </dynamic-left-top-freeze-table>
        </b-col>
      </b-row>
      <!--End tables-->
    </b-container>
    <!-- <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <b-container fluid class="mt--9"> -->
        <!--Tables-->
      <!-- <b-row class="mt-5">
        <b-col xl="12" class="mb-5 mb-xl-0">
            <dynamic-left-top-freeze-table 
                headerTitle="Monthly number of messages exchanged" 
                :tableData="getDataTable" 
                :loading="loading.dataTable"
                :optionOnChange="monthOnChange"
                :refresh="loadMonthwiseSummarySave" 
                :colHeadFormatter="headerFormatter"
                :options="monthOptions">
            </dynamic-left-top-freeze-table>
        </b-col>
      </b-row> -->
      <!--End tables-->
    <!-- </b-container> -->
   
    <b-container fluid class="mt--9">
        <!--Tables-->
      <b-row class="mt-5">
        <b-col xl="12" class="mb-5 mb-xl-0">
            <dynamic-left-top-freeze-table 
                headerTitle="Number of conversation (WABA)" 
                :tableData="getWabaDataTable" 
                :loading="loading.wabaDataTable"
                :optionOnChange="wabaOnMonthChange"
                :refresh="loadWabaMonthwiseSummary" 
                :colHeadFormatter="headerFormatter"
                :options="monthOptions">
            </dynamic-left-top-freeze-table>
        </b-col>
      </b-row>
      <!--End tables-->
    </b-container>
   
    <b-container fluid class="mt--9">
        <!--Tables-->
      <b-row class="mt-5">
        <b-col xl="12" class="mb-5 mb-xl-0">
            <dynamic-left-top-freeze-table 
                headerTitle="Hourly outbound broadcast messages (WABA)" 
                :tableData="getOutboundMsgHourlyDataTable" 
                :loading="loading.outboundMsgHourlyDataTable"
                :optionOnChange="outboundHourOptionOnChange" 
                :refresh="loadOutboundMsgHourly"
                :sortBy="sortBy()"
                :options="hourOptions">
            </dynamic-left-top-freeze-table>
        </b-col>
      </b-row>
      <!--End tables-->
    </b-container>
    <b-container fluid class="mt--9">
        <!--Tables-->
      <b-row class="mt-5">
        <b-col xl="12" class="mb-5 mb-xl-0">
            <dynamic-left-top-freeze-table 
                headerTitle="Daily outbound broadcast messages (WABA)" 
                :tableData="getBroadcastDayDataTable" 
                :loading="loading.broadcastDayDataTable"
                :daterangeChange="onBroadcastDaysDaterangeChange"
                :refresh="loadBroadcastDaywiseSummary"
                :sortBy="sortBy()"
                :daterange="daterangeBroadcast">
            </dynamic-left-top-freeze-table>
        </b-col>
      </b-row>
      <!--End tables-->
    </b-container>
  
    </div>
</template>
<script>
    import * as chartConfigs from '@/@common/argon/components/Charts/config'
    import StatsCard from '@/@common/argon/components/Cards/StatsCard'
    import DynamicLeftTopFreezeTable from './Dashboard/DynamicLeftTopFreezeTable.vue'
    import PageTitle from "../Components/PageTitle.vue";

import moment from 'moment';

   function initialModeState (){
       return { 
            I: 0,
            // Ii:0,
            O:0,
            // Oi:0,
            // L:0,
            // A: 0,
            // N:0
        }
    }
    function initialChannelState (mode){
       return {

            GUPSHUPW: {
                label: 'WhatsApp',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-info',
                total:0,
                mode: mode,
            },
            mailto: {
                label: 'Email',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-info',
                total:0,
                mode: mode,
            },
            tg: {
                label: 'Telegram',
                icon: 'ni ni-chart-pie-35',
                total:0,
                type: 'gradient-red',
                mode: mode,
            },
            tw: {
                label: 'Twitter',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-orange',
                total:0,
                mode: mode,
            },
            fb: {
                label: 'Facebook',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-green',
                total:0,
                mode: mode,
            },
            wa: {
                label: 'WhatsApp',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-info',
                total:0,
                mode: mode,
            },
            waba: {
                label: 'WhatsApp',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-info',
                total:0,
                mode: mode,
            },
            wags: {
                label: 'WhatsApp',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-info',
                total:0,
                mode: mode,
            },
            wa360: {
                label: 'WhatsApp',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-red',
                total:0,
                mode: mode,
            },
            web: {
                label: 'Webchat',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-orange',
                total:0,
                mode: mode,
            },
            ig: {
                label: 'Instagram',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-green',
                total:0,
                mode: mode,
            },
        }
    }
    export default {
        components: {
            StatsCard,
            DynamicLeftTopFreezeTable,
            PageTitle
        },
        data() {
            return {
                heading: 'Message Analytics',
                subheading: 'Select date range for report',
                icon: 'pe-7s-graph3 icon-gradient bg-tempting-azure',
                loading:{
                    dataTable:false,
                    hourDataTable:false,
                    outboundMsgHourlyDataTable:false,
                    broadcastDayDataTable:false,
                    dayDataTable:false,
                    wabaDataTable:false
                },
                domainOptions: [],
                monthOptions: [],
                model: {
                    tnt: '',
                },
                timestamp: '',
                wabaTimestamp: '',
                hrMsg:12,
                dateWiseSummaryCount: initialChannelState(initialModeState()),
                hourWiseCountMap:initialChannelState(null),
                dayWiseSummaryCount:initialChannelState(null),
                outboundMsgHourly:{},
                outboundMsgDayily:{},
                channelWiseSummaryCount: {},
                summaryCount: {},
                modes:["I","O"],
                modesHouroutb:{
                    INIT:"Received by Mehery",
                    SENT:"Sent by Mehery",
                    SENTX:"Accepted by WhatsApp",
                    SENT_ERR:"Error from WhatsApp",
                    DLVRD:"Delivered to Customer",
                    READ:"Read by Customer"
                },
                modesoutdaily:{
                    INIT:"Received by Mehery",
                    SENT:"Sent by Mehery",
                    SENTX:"Accepted by WhatsApp",
                    SENT_ERR:"Error from WhatsApp",
                    DLVRD:"Delivered to Customer",
                    READ:"Read by Customer"
                },
                daterange:{
                    startDate : moment().subtract(6,"day").valueOf(),
                    endDate : moment().valueOf(),
                    span : "Today",
                    days:7
                },
                daterangeBroadcast:{
                    startDate : moment().subtract(6,"day").valueOf(),
                    endDate : moment().valueOf(),
                    span : "Today",
                    days:7
                },
                wabaUsesData:initialChannelState(initialModeState()) ,
                hourOptions:[
                    {label:"Last 12 hours", value:12},
                    {label:"Last 24 hours", value:24}
                ],
                hour:12,
            }
        },
        computed:{
            getDataTable(){
                let data = [];
                Object.entries(this.dateWiseSummaryCount).map(v=>{
                    if(v[1].total){
                        let row =  {
                            name: v[1].label,
                            ...v[1].mode
                        }
                        data.push(row)
                    }
                    
                })
                return data;
            },
            getHourDataTable(){
                let data = [];
                Object.entries(this.hourWiseCountMap).map((v,i)=>{
                    if(i === 0) return;
                    if(v[1].mode){
                        let row =  {
                            name: v[1].label,
                            ...v[1].mode
                        }
                        data.push(row)
                    }
                })

                return data;
            },
            getOutboundMsgHourlyDataTable(){
                let data = [];
                var k = JSON.parse(JSON.stringify( this.outboundMsgHourly, this.sortBy()),1);
                Object.entries(k).map(v=>{
                    k[v[0]] = this.outboundMsgHourly[v[0]];
                })
                Object.entries(k).map(v=>{
                    let row =  {
                        name: this.modesHouroutb[v[0]],
                        ...v[1]
                    }
                    data.push(row)
                })

                return data;
            },
            getBroadcastDayDataTable(){
                let data = [];
                var k = JSON.parse(JSON.stringify( this.outboundMsgDayily, this.sortBy()),1);
                Object.entries(k).map(v=>{
                    k[v[0]] = this.outboundMsgDayily[v[0]];
                })
                Object.entries(k).map(v=>{
                        let row =  {
                            name: this.modesHouroutb[v[0]],
                            ...v[1]
                        }
                        data.push(row)
                })
                return data;
            },
            getDayDataTable(){
                let data = [];
                Object.entries(this.dayWiseSummaryCount).map(v=>{
                    if(v[1].mode){
                        let row =  {
                            name: v[1].label,
                            ...v[1].mode
                        }
                        data.push(row)
                    }
                })

                return data;
            },
            getWabaDataTable(){
                let data = [];
                Object.entries(this.wabaUsesData).map(v=>{
                    if(v[1].total){
                        let row =  {
                            name: v[1].label,
                            ...v[1].mode
                        }
                        data.push(row)
                    }
                    
                })
                return data;
            }
        },
        methods: {
            sortBy(){
                return Object.keys(this.modesHouroutb);
            },
            timeFormatter(ms){
                let date = moment(parseInt(ms));
                return date.local().format('HH:mm');
            },
            getMinute(ms){
                let date = moment(parseInt(ms));
                return date.local().format('mm');
            },
            getHour(ms){
                let date = moment(parseInt(ms));
                return date.local().format('ha');
            },
            getHourMin(ms){
                let date = moment(parseInt(ms)).subtract(1,"hour");
                return date.local().format('ha');
            },
            getHourPlus(ms){
                let date = moment(parseInt(ms)).add(1,"hour");
                return date.local().format('ha');
            },
            dateFormatter(ms){
                let date = moment(parseInt(ms),"YYYYMMDD");
                return date.local().format('DD MMM');
            },
            headerFormatter(key){
                switch (key) {
                    case "I":
                        return "User Initiated"
                    case "O": 
                        return "Business Initiated" 
                }
            },
            onDaysDaterangeChange(range){
                this.daterangeBroadcast.startDate = range.startDate;
                this.daterangeBroadcast.endDate = range.endDate;
                let startDate = moment(range.startDate);
                let endDate = moment(range.endDate);
                this.daterangeBroadcast.days = endDate.diff(startDate, 'days');
                this.loadDaywiseSummary();
            },
            onBroadcastDaysDaterangeChange(range){
                this.daterange.startDate = range.startDate;
                this.daterange.endDate = range.endDate;
                let startDate = moment(range.startDate);
                let endDate = moment(range.endDate);
                this.daterange.days = endDate.diff(startDate, 'days');
                this.loadBroadcastDaywiseSummary();
            },
            async loadDomains() {
                let resp = await this.$service.get(
                    '/admin/domain'
                )
                this.domainOptions = resp.results.map((v) => {
                    return {
                        name: v.domain+" ("+v.company.businessName+")",
                        value: v.domain,
                    }
                })
                this.model.tnt = this.domainOptions[0].value
                this.loadTimeStamp()
            },
            async loadTimeStamp() {
                let resp = await this.$service.get(
                    '/admin/fetch-month',
                    { tnt: this.model.tnt }
                )
                this.monthOptions = resp.results.map((v) => {
                    return {
                        name: v.monthStr,
                        value: v.timestamp,
                    }
                })
                this.timestamp = this.monthOptions[0].value
                this.wabaTimestamp = this.monthOptions[0].value
                this.timestampMonthwiseCount = this.monthOptions[0].value
                this.loadHourwiseSummary()
                this.loadDaywiseSummary()
                this.loadMonthwiseSummarySave()
                this.loadWabaMonthwiseSummary()
                this.loadOutboundMsgHourly()
                this.loadBroadcastDaywiseSummary()

            },
            getDateFormate(milliseconds){
                return moment(milliseconds).format("DD/MM/YYYY");
            },
            async loadDaywiseSummary(){
                let _THAT = this;
                this.loading.dayDataTable = true;
                let daySummary = await this.$service.get(
                    '/admin/daywise-summary',
                    { ...this.model,
                        timestamp:0,
                        dateRange1:_THAT.getDateFormate(_THAT.daterange.startDate), 
                        dateRange2:_THAT.getDateFormate(_THAT.daterange.endDate),
                        days:this.daterange.days
                    }
                )
                this.loading.dayDataTable = false;
                this.dayWiseSummaryCount = initialChannelState(null);
                Object.entries(daySummary.results[0].dateWiseSummaryCount).map(
                    (v) => {
                        let key  = v[0].split('_')
                        if(v[0].split('_').length == 3){
                            let channel = key[1]+"("+key[2]+")";
                            _THAT.dayWiseSummaryCount[channel] = {..._THAT.dayWiseSummaryCount[key[1]]};
                            _THAT.dayWiseSummaryCount[channel].mode = v[1];
                            _THAT.dayWiseSummaryCount[channel].label = _THAT.dayWiseSummaryCount[channel].label+"("+key[2]+")"
                        } else {
                            _THAT.dayWiseSummaryCount[key[1]].mode = v[1];
                        }
                    }
                )
               
            },
            getHourWiseData(resp,hr){
                let _THAT = this;
                let data = {};
                let length = Object.entries(resp).length;
                Object.entries(resp).reduce((a,b,i)=>{
                    let time = parseInt(_THAT.getMinute(i== 1 ? a[0] : b[0]));

                    if(time == 0 && i == 1){
                        data[_THAT.getHourMin(a[0])+"-"+_THAT.getHour(a[0])] = b[1]
                        return b;
                    }
                    if(!a && length == i+1 && time != 0){
                        data[_THAT.getHour(b[0])+"-"+_THAT.getHourPlus(b[0])] = b[1];
                        return false;
                    }
                    if(a && b){
                        data[_THAT.getHour(a[0])+"-"+_THAT.getHour(b[0])] = a[1]+b[1];
                        return null;
                    } else return b;
                });
                data = Object.entries(data).map(v=>{
                    return v;
                })
                data = data.slice(-hr);
                let newData = {};
                data.map(v=>{
                    newData[v[0]]=v[1]
                })
                return newData
            },
            async loadHourwiseSummary(){
                let _THAT = this;
                this.loading.hourDataTable = true;
                let hourSummary = await this.$service.get(
                   '/admin/hourwise-summary',
                   { ...this.model,timestamp:0,hr:this.hour}
                )
                this.loading.hourDataTable = false;

                this.hourWiseCountMap = initialChannelState(null);
                Object.entries(hourSummary.results[0].hourWiseCountMap).map(
                    (v) => {
                        let key  = v[0].split('_')
                        if(v[0].split('_').length == 3){
                            let channel = key[1]+"("+key[2]+")";
                            _THAT.hourWiseCountMap[channel] = {..._THAT.hourWiseCountMap[key[1]]};
                            _THAT.hourWiseCountMap[channel].mode = _THAT.getHourWiseData(v[1], this.hour);
                            _THAT.hourWiseCountMap[channel].label = _THAT.hourWiseCountMap[channel].label+"("+key[2]+")"
                        } else {
                            _THAT.hourWiseCountMap[key[1]].mode = _THAT.getHourWiseData(v[1], this.hour);
                        }
                    }
                )
            },
            async loadWabaMonthwiseSummary(){
                let _THAT = this;
                this.loading.wabaDataTable = true;
                let wabaResp = await this.$service.get(
                    '/admin/monthwise-summary/waba',
                    { ...this.model, timestamp:this.wabaTimestamp }
                )
                this.loading.wabaDataTable = false;
                this.wabaUsesData = initialChannelState(initialModeState());
                wabaResp.results.map( v => {
                        let channel = 'waba'
                        let mode = v.type == "user_initiated" ? "I" : "O";
                        _THAT.wabaUsesData[channel].mode[mode] = _THAT.wabaUsesData[channel].mode[mode] + 1 ;
                        _THAT.wabaUsesData[channel].total = _THAT.wabaUsesData[channel].total + 1;
                    }
                )
            },
            async loadMonthwiseSummarySave(){
                let _THAT = this;
                this.loading.dataTable = true;
                let resp = await this.$service.get(
                    '/admin/monthwise-summary-save',
                    { ...this.model, timestamp:this.timestamp }
                )
                this.loading.dataTable = false;
                this.dateWiseSummaryCount = initialChannelState(initialModeState());
                Object.entries(resp.results[0].dateWiseCountMap).map(
                    (v) => {
                        let channel = v[0].split('_')[2]
                        Object.entries(v[1]).map((w) => {
                            let mode = w[0];
                            if(this.modes.indexOf(mode) < 0) return;
                            _THAT.dateWiseSummaryCount[channel].mode[
                                mode
                            ] =
                                _THAT.dateWiseSummaryCount[channel].mode[mode] + w[1];
                            _THAT.dateWiseSummaryCount[channel].total = _THAT.dateWiseSummaryCount[channel].total +  + w[1];
                        })
                    }
                )
                this.summaryCount = resp.results[0].summaryCount
            },
            async loadOutboundMsgHourly(){
                let _THAT = this;
                this.loading.outboundMsgHourlyDataTable = true;
                let hourSummary = await this.$service.get(
                   '/admin/hourwise-msg-status-summary',
                   { ...this.model,timestamp:0,hr:this.hrMsg}
                )
                this.loading.outboundMsgHourlyDataTable = false;
                _THAT.outboundMsgHourly = {};
                Object.entries(hourSummary.results[0].hourWiseCountMap).map(
                    (v) => {
                        let data = _THAT.getHourWiseData(v[1], this.hrMsg);
                        _THAT.outboundMsgHourly[v[0]] = data;
                    }
                )
            },
            async loadBroadcastDaywiseSummary(){
                let _THAT = this;
                this.loading.broadcastDayDataTable = true;
                let daySummary = await this.$service.get(
                    '/admin/datewise-msg-status-summary',
                    { ...this.model,
                        timestamp:0,
                        dateRange1:_THAT.getDateFormate(_THAT.daterange.startDate), 
                        dateRange2:_THAT.getDateFormate(_THAT.daterange.endDate),
                        days:this.daterange.days
                    }
                )
                this.loading.broadcastDayDataTable = false;
                this.outboundMsgDayily = {};
                Object.entries(daySummary.results[0].dateWiseSummaryCount).map(v=>{
                    Object.entries(v[1]).map(w=>{
                        this.outboundMsgDayily[v[0]] ? "" : this.outboundMsgDayily[v[0]] = {};
                        this.outboundMsgDayily[v[0]][this.dateFormatter(w[0])] = w[1];
                    })
                })
            },
            domainOnChange() {
                this.loadTimeStamp()
            },
            monthOnChange(e) {
                this.timestamp = e.target.value;
                this.loadMonthwiseSummarySave()
            },
            hourOptionOnChange(e) {
                this.hour = e.target.value
                this.loadHourwiseSummary()
            },
            wabaOnMonthChange(e) {
                this.wabaTimestamp = e.target.value
                this.loadWabaMonthwiseSummary()
            },
            outboundHourOptionOnChange(e){
                this.hrMsg = e.target.value
                this.loadOutboundMsgHourly()
            }
        },
        mounted() {
            this.hour = this.hourOptions[0].value
            this.model.tnt = window.location.host.split(".")[0]
            this.loadTimeStamp()
        },
    }
</script>
<style lang="scss">
body{
    background-color: #3c3c3c !important;
}
.dashboard{
    .el-table .cell {
        padding-left: 0px;
        padding-right: 0px;
    }

    .form-group.is-question {
        .form-control-label{
        color: #fff !important;
        }
    }
    .el-table.table-dark{
    background-color: #172b4d;
    color: #f8f9fe;
    }

    .el-table.table-dark th,
    .el-table.table-dark tr{
    background-color: #172b4d;
    }

    .el-table.table-dark td,
    .el-table.table-dark th.is-leaf{
    border-bottom: none;
    }

    .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
        color:#172b4d
    }
}
</style>