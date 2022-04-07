<template>
    <div>
        <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
            <!-- Card stats -->
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="3">
                        <base-select
                            alternative
                            question
                            type="text"
                            name="Domain"
                            placeholder="Domain"
                            rules="required"
                            required
                            v-model="model.tnt"
                            @change="domainOnChange"
                            :options="domainOptions">
                        </base-select>
                    </b-col>
                    <b-col lg="3">
                        <base-select
                            alternative
                            question
                            type="text"
                            name="Month"
                            placeholder="Month"
                            rules="required"
                            required
                            v-model="model.timestamp"
                            @change="monthOnChange"
                            :options="monthOptions">
                        </base-select>
                    </b-col>
                </b-row>
            </div>
        </base-header>
    <b-container fluid class="mt--9">
        <!--Tables-->
      <b-row class="mt-5">
        <b-col xl="12" class="mb-5 mb-xl-0">
            <social-traffic-table :tableData="getDataTable"></social-traffic-table>
        </b-col>
      </b-row>
      <!--End tables-->
    </b-container>
    <br/>
    <br/>
    <br/>
    <br/>
    </div>
</template>
<script>
    import * as chartConfigs from '@/@common/argon/components/Charts/config'
    import StatsCard from '@/@common/argon/components/Cards/StatsCard'
    import SocialTrafficTable from './Dashboard/SocialTrafficTable';

   function initialModeState (){
       return { 
            I: 0,
            Ii:0,
            O:0,
            Oi:0,
            L:0,
            A: 0,
            N:0
        }
    }
    function initialChannelState (){
       return { 
            GUPSHUPW: {
                label: 'WA_GUPSHUP_LEGACY',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-info',
                total:0,
                mode: initialModeState(),
            },
            tg: {
                label: 'TELEGRAM',
                icon: 'ni ni-chart-pie-35',
                total:0,
                type: 'gradient-red',
                mode: initialModeState(),
            },
            tw: {
                label: 'TWITTER',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-orange',
                total:0,
                mode: initialModeState(),
            },
            fb: {
                label: 'FACEBOOK',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-green',
                total:0,
                mode: initialModeState(),
            },
            wa: {
                label: 'WA',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-info',
                total:0,
                mode: initialModeState(),
            },
            wags: {
                label: 'WA_GUPSHUP',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-info',
                total:0,
                mode: initialModeState(),
            },
            wa360: {
                label: 'WA_360D',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-red',
                total:0,
                mode: initialModeState(),
            },
            web: {
                label: 'WEB',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-orange',
                total:0,
                mode: initialModeState(),
            },
            ig: {
                label: 'INSTAGRAM',
                icon: 'ni ni-chart-pie-35',
                type: 'gradient-green',
                total:0,
                mode: initialModeState(),
            },
        }
    }
    export default {
        components: {
            StatsCard,
            SocialTrafficTable
        },
        data() {
            return {
                domainOptions: [],
                monthOptions: [],
                model: {
                    tnt: '',
                    timestamp: '',
                },
                dateWiseSummaryCount: initialChannelState(),
                channelWiseSummaryCount: {},
                summaryCount: {},
                modes:["I","O"],
                tableData: [
                    {
                        name: 'Facebook',
                        visitors: '1,480',
                        progress: 60,
                        progressType: 'gradient-danger',
                    },
                    {
                        name: 'LinkedIn',
                        visitors: '5,480',
                        progress: 70,
                        progressType: 'gradient-success',
                    },
                    {
                        name: 'Google',
                        visitors: '4,807',
                        progress: 80,
                        progressType: 'gradient-primary',
                    },
                    {
                        name: 'Instagram',
                        visitors: '3,678',
                        progress: 75,
                        progressType: 'gradient-info',
                    },
                    {
                        name: 'Twitter',
                        visitors: '2,645',
                        progress: 30,
                        progressType: 'gradient-warning',
                    }
                    ]
            }
        },
        computed:{
            getDataTable(){
                let data = [];
                Object.entries(this.dateWiseSummaryCount).map(v=>{
                    if(v[1].total){
                        console.log("v",v);                        
                        let row =  {
                            name: v[1].label,
                            visitors: '1, 480',
                            progress: 60,
                            progressType: 'gradient-danger',
                            ...v[1].mode
                        }
                        data.push(row)
                    }
                    
                })
                console.log("data",data);
                return data;
            }
        },
        methods: {
            async loadDomains() {
                let resp = await this.$service.get(
                    '/partnerdashboard/pub/domain'
                )
                this.domainOptions = resp.results.map((v) => {
                    return {
                        name: v.company.businessName,
                        value: v.domain,
                    }
                })
                this.model.tnt = this.domainOptions[0].value
                this.loadTimeStamp()
            },
            async loadTimeStamp() {
                let resp = await this.$service.get(
                    '/partnerdashboard/pub/admin/fetch-month',
                    { tnt: this.model.tnt.value }
                )
                this.monthOptions = resp.results.map((v) => {
                    return {
                        name: v.monthStr,
                        value: v.timestamp,
                    }
                })
                this.model.timestamp = this.monthOptions[0].value
                this.loadData()
            },
            async loadData() {
                let _THAT = this;
                let resp = await this.$service.get(
                    '/partnerdashboard/pub/monthwise-summary-save',
                    { ...this.model }
                )
                this.dateWiseSummaryCount = initialChannelState();
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
            domainOnChange() {
                this.loadTimeStamp()
            },
            monthOnChange() {
                this.loadData()
            },
        },
        mounted() {
            this.loadDomains()
        },
    }
</script>
<style lang="scss">
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
</style>
