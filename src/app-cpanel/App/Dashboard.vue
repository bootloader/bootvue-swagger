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
                            feedback
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
                            feedback
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
            <div class="pl-lg-12" v-for="channel in dateWiseSummaryCount">
                <h2>{{channel.label}}</h2>
                <b-row>
                    <b-col xl="3" md="6" v-for="mode in channel.mode">
                        <stats-card
                            :title="mode.label"
                            :type="mode.type"
                            :sub-title="mode.count.toString()"
                            :icon="mode.icon"
                            class="mb-4">
                            <template slot="footer">
                                <span class="text-danger mr-2">5.72%</span>
                                <span class="text-nowrap"
                                    >Since last month</span
                                >
                            </template>
                        </stats-card>
                    </b-col>
                </b-row>
            </div>
        </base-header>
    </div>
</template>
<script>
    import * as chartConfigs from '@/@common/argon/components/Charts/config'
    import StatsCard from '@/@common/argon/components/Cards/StatsCard'

    const MODE = {
        I: {
            label: 'Inbound',
            icon: 'ni ni-active-40',
            type: 'gradient-red',
            count: 0,
        },
        Ii: {
            label: 'Inbound Imp',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-orange',
            count: 0,
        },
        O: {
            label: 'Outbound',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-green',
            count: 0,
        },
        Oi: {
            label: 'Outbound Imp',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-info',
            count: 0,
        },
        L: {
            label: 'L',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-red',
            count: 0,
        },
        A: {
            label: 'A',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-orange',
            count: 0,
        },
        N: {
            label: 'N',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-green',
            count: 0,
        },
    }
    const CHANNEL = {
        GUPSHUPW: {
            label: 'WA_GUPSHUP_LEGACY',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-info',
            mode: { ...MODE },
        },
        tg: {
            label: 'TELEGRAM',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-red',
            mode: { ...MODE },
        },
        tw: {
            label: 'TWITTER',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-orange',
            mode: { ...MODE },
        },
        fb: {
            label: 'FACEBOOK',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-green',
            mode: { ...MODE },
        },
        wa: {
            label: 'WA',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-info',
            mode: { ...MODE },
        },
        wags: {
            label: 'WA_GUPSHUP',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-info',
            mode: { ...MODE },
        },
        wa360: {
            label: 'WA_360D',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-red',
            mode: { ...MODE },
        },
        web: {
            label: 'WEB',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-orange',
            mode: { ...MODE },
        },
        ig: {
            label: 'INSTAGRAM',
            icon: 'ni ni-chart-pie-35',
            type: 'gradient-green',
            mode: { ...MODE },
        },
    }
    export default {
        components: {
            StatsCard,
        },
        data() {
            return {
                domainOptions: [],
                monthOptions: [],
                model: {
                    tnt: '',
                    timestamp: '',
                },
                dateWiseSummaryCount: { ...CHANNEL },
                channelWiseSummaryCount: {},
                summaryCount: {},
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
                this.monthOptions = Object.entries(resp.results[0]).map((v) => {
                    return {
                        name: v[1],
                        value: v[0],
                    }
                })
                this.model.timestamp = this.monthOptions[0].value
                this.loadData()
            },
            async loadData() {
                let _THAT = this
                let resp = await this.$service.get(
                    '/partnerdashboard/pub/monthwise-summary-save',
                    { ...this.model }
                )
                Object.entries(resp.results[0].dateWiseSummaryCount).map(
                    (v) => {
                        let channel = v[0].split('_')[2]
                        Object.entries(v[1]).map((w) => {
                            let mode = w[0]
                            console.log(
                                'his.dateWiseSummaryCount[channel][mode]',
                                _THAT.dateWiseSummaryCount[channel].mode[mode],
                                channel
                            )
                            _THAT.dateWiseSummaryCount[channel].mode[
                                mode
                            ].count =
                                _THAT.dateWiseSummaryCount[channel].mode[mode]
                                    .count + w[1]
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
<style>
    .el-table .cell {
        padding-left: 0px;
        padding-right: 0px;
    }
</style>
