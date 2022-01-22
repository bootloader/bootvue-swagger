<template>
    <div class="container">
        <main>
            <h1 align="center">Mehery Smart Conversations</h1>
            <br />
            <div class="main">
                <table class="price-table">
                    <tbody>
                        <tr>
                            <td class="price-blank"></td>
                            <td class="price-table-popular">Most popular</td>
                        </tr>
                        <tr
                            v-for="(row, labelID, index, key) in labels"
                            v-bind:class="[
                                labelID == 'planName' ? 'price-table-head' : '',
                            ]">
                                <td v-if="['text','price','boolean'].indexOf(row.type) != -1">{{ row.label }} <i class="fas fa-info-circle" v-if="row.hintText != ''" :title="row.hintText"></i></td>
                                <td v-if="['header'].indexOf(row.type) != -1" :colspan="planData.length+1" :class="row.type">{{ row.label }}</td>
                                <td v-for="item in planData"  v-if="row.type =='price'" :class="labelID">
                                    <span v-if="item[labelID] != 'NA'">{{
                                    item[labelID][currency]
                                    }}</span>
                                    <i v-else class="fas fa-times"></i>
                                </td>
                                <td v-for="item in planData"  v-if="row.type =='boolean'">
                                    <i
                                    class="fas"
                                    :class="
                                        item[labelID] ? 'fa-check' : 'fa-times'
                                    "></i>
                                </td>
                                <td v-for="item in planData"  v-if="row.type =='text'">
                                    {{ item[labelID] }}
                                </td>
                                
                            <!-- <td v-if="labelID !== ('features' || 'addOn')">{{ label }}</td>
                            <td
                                v-for="item in planData"
                                v-if="labelID == 'price'"
                                class="price">
                                {{ item[labelID][currency] }}
                            </td>
                            <td
                                v-if="labelID == ('features' || 'addOn')"
                                align="center"
                                :colspan="planData.length+1">
                                Features
                            </td>
                            <td
                                v-for="item in planData"
                                v-if="labelID == 'eachAdditionalAgent'">
                                <span v-if="item[labelID] != 'NA'">{{
                                    item[labelID][currency]
                                }}</span>
                                <i v-else class="fas fa-times"></i>
                            </td>
                            <td
                                v-for="item in planData"
                                v-if="labelID == 'hoduSofAPIOneTimeFee'">
                                <span v-if="item[labelID] != 'NA'">{{
                                    item[labelID][currency]
                                }}</span>
                                <i v-else class="fas fa-times"></i>
                            </td>
                            <td
                                v-for="item in planData"
                                v-if="labelID == 'mitelOpenAPIOneTimeFee'">
                                <span v-if="item[labelID] != 'NA'">{{
                                    item[labelID][currency]
                                }}</span>
                                <i v-else class="fas fa-times"></i>
                            </td>
                            <td
                                v-for="item in planData"
                                v-if="
                                    [
                                        'features',
                                        'price',
                                        'eachAdditionalAgent',
                                        'hoduSofAPIOneTimeFee',
                                        'mitelOpenAPIOneTimeFee',
                                    ].indexOf(labelID) == -1
                                ">
                                <i
                                    v-if="typeof item[labelID] === 'boolean'"
                                    class="fas"
                                    :class="
                                        item[labelID] ? 'fa-check' : 'fa-times'
                                    "></i>
                                <span
                                    v-if="typeof item[labelID] !== 'boolean'"
                                    >{{ item[labelID] }}</span
                                >
                            </td> -->
                        </tr>
                        <tr>
                            <td></td>

                            <td class="price" v-for="i in planData.length">
                                <a href="https://app.mehery.com/partner/auth/register?purpose=smartconversations">Get started</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
        <!-- <td><i class="fas fa-times"></i></td>
                            <td></td> -->
    </div>
</template>
<script>
    import jslocator from '../../../services/jslocator'
    import countryToCurrency from 'country-to-currency'
    export default {
        data() {
            return {
                text: {},
                labels: {
                    planName: {label:'',type:'text',hintText:''},
                    channel: {label:'',type:'text',hintText:''},
                    price: {label:'Mehery License Fees (per month)',type:'price',hintText:''},
                    perWASessionTemplate: {label:'Per WA Session / Template *',type:'text',hintText:''} ,
                    nonWaMessageFee: {label:'Per Non-WA message Fee',type:'price',hintText:''} ,
                    features: {label:'Features',type:'header',hintText:''},
                    agents: {label:'Agent',type:'text',hintText:''},
                    agentDashboard: {label:'Agent Dashboard',type:'boolean',hintText:''},
                    templateCreationWABA: {label:'Template Creation - WABA',type:'boolean',hintText:''},
                    marketingBroadcasts: {label:'Marketing Broadcasts',type:'boolean',hintText:''} ,
                    quickReplies: {label:'Quick Replies',type:'boolean',hintText:''},
                    whatsAppChatWidget: {label:'WhatsApp Chat Widget',type:'boolean',hintText:''},
                    customerTags: {label:'Customer Tags',type:'boolean',hintText:''} ,
                    sessionTags: {label:'Session Tags',type:'boolean',hintText:''} ,
                    chatDistributionRules: {label:'Chat Distribution rules',type:'boolean',hintText:''} ,
                    aPIsAndWebhooks: {label:'APIs and Webhooks',type:'boolean',hintText:''} ,
                    eCommercePluginForWA: {label:'eCommerce Plugin for WA',type:'boolean',hintText:''},
                    meheryBranding: {label:'Mehery Branding',type:'boolean',hintText:''},
                    botWorkflows: {label:'BOT workflows',type:'boolean',hintText:''},
                    nlpMachineLearning: {label:'NLP and Machine Learning',type:'boolean',hintText:''},
                    addOn: {label:'Add Ons',type:'header',hintText:''} ,
                    eachAdditionalAgent: {label:'Per Additional Agent, per month',type:'price',hintText:''},
                    apiSetup: {label:'CRM, Call Centers - Set-Up Fee',type:'price',hintText:'We will integrate with any Call Center or CRM Solution of your choice.'},
                    perWhatsappNum: {label:'Per Additional WhatsApp number',type:'price',hintText:'Within the same FB Business Manager ID'},
                    setupFee: {label:'Set-up Fees',type:'price',hintText:'Only if Mehery Support is required'},
                    support:  {label:'Support',type:'header',hintText:''},
                    emailWhatsAppSupport: {label: 'Email & WhatsApp Support', type:'boolean', hintText:''},
                },
                planData: [
                    {
                        planName: 'Starter',
                        channel: 'WA Only',
                        price: {
                            INR: '₹ 8,999',
                            USD: '$ 109.99',
                            EUR: '€ 99.99',
                            IDR: 'IDR 1.65mio',
                            GPB: '£ 84.99',
                            NZD: 'A$ 159.99',
                            AUD: 'A$ 159.99',
                        },
                        sessionTemplateFees: 'As per Table',
                        perWASessionTemplate: 'WA Fees + 20%',
                        nonWaMessageFee:'NA',
                        agents: false,
                        agentDashboard: false,
                        templateCreationWABA: true,
                        marketingBroadcasts: true,
                        quickReplies: false,
                        whatsAppChatWidget: true,
                        customerTags: false,
                        sessionTags: false,
                        chatDistributionRules: false,
                        aPIsAndWebhooks: true,
                        eCommercePluginForWA: false,
                        meheryBranding: false,
                        botWorkflows: 'BASIC',
                        nlpMachineLearning: false,
                        eachAdditionalAgent: {
                            INR: '₹2,000',
                            USD: '$25',
                            EUR: '€23.00',
                            IDR: 'IDR 375k',
                            GPB: '£20.00',
                            NZD: 'A$37.50',
                            AUD: 'A$37.50',
                            
                        },
                        apiSetup:{
                            INR: '₹ 8,000',
                            USD: '$	100',
                            EUR: '€ 92',
                            IDR: 'IDR 1.50mio',
                            GPB: '£	80',
                            NZD: 'A$150',
                            AUD: 'A$150',
                        },
                        perWhatsappNum:{
                            INR: '₹ 8,000',
                            USD: '$	100',
                            EUR: '€ 92',
                            IDR: 'IDR 1.50mio',
                            GPB: '£	80',
                            NZD: 'A$150',
                            AUD: 'A$150',
                        },
                        setupFee:{
                            INR: '₹ 79,996',
                            USD: '$	1,000',
                            EUR: '€ 1,000',
                            IDR: 'IDR 1.50mio',
                            GPB: '£	800',
                            NZD: 'A$ 1,500',
                            AUD: 'A$ 1,500',
                        },
                        emailWhatsAppSupport: true,
                    },
                    {
                        planName: 'Advanced',
                        channel: 'All Channels',
                        price: {
                            INR: '₹ 24,999',
                            USD: '$	299.99',
                            EUR: '€ 274.99',
                            IDR: 'IDR 4.50 mio',
                            GPB: '£	229.99',
                            NZD: 'A$ 429.99',
                            AUD: 'A$ 429.99',
                        },
                        sessionTemplateFees: 'As per Table',
                        perWASessionTemplate: 'WA Fees + 20%',
                        nonWaMessageFee:{
                            USD:'$ 0.0050',
                            EUR:'€ 0.0046',
                            INR:'₹ 0.10',
                            IDR:'IDR 75',
                            GPB:'£ 0.0040',
                            NZD:'A$ 0.0075',
                            AUD:'A$ 0.0075'
                        },
                        agents: false,
                        agentDashboard: false,
                        templateCreationWABA: true,
                        marketingBroadcasts: true,
                        quickReplies: false,
                        whatsAppChatWidget: true,
                        customerTags: false,
                        sessionTags: false,
                        chatDistributionRules: false,
                        aPIsAndWebhooks: true,
                        eCommercePluginForWA: false,
                        meheryBranding: false,
                        botWorkflows: 'Advanced',
                        nlpMachineLearning: false,
                        eachAdditionalAgent: 'NA',
                        apiSetup:{
                            INR: '₹ 8,000',
                            USD: '$	100',
                            EUR: '€ 92',
                            IDR: 'IDR 1.50mio',
                            GPB: '£	80',
                            NZD: 'A$150',
                            AUD: 'A$150',
                        },
                        perWhatsappNum:{
                            INR: '₹ 8,000',
                            USD: '$	100',
                            EUR: '€ 92',
                            IDR: 'IDR 1.50mio',
                            GPB: '£	80',
                            NZD: 'A$150',
                            AUD: 'A$150',
                        },
                        setupFee:{
                            INR: '₹ 79,996',
                            USD: '$	1,000',
                            EUR: '€ 1,000',
                            IDR: 'IDR 1.50mio',
                            GPB: '£	800',
                            NZD: 'A$ 1,500',
                            AUD: 'A$ 1,500',
                        },
                        emailWhatsAppSupport: true,
                    }
                ],
                currency: 'IND',
            }
        },
        computed: {},
        mounted: function () {
            jslocator.get().then((resp) => {
                let country = resp.country_code2
                this.currency = countryToCurrency[country]
                console.log('this.currency', this.currency)
            })
        },
        methods: {},
    }
</script>
<style scoped>
    main {
        max-width: 1170px;
        margin: 0 auto;
    }
    .main {
        box-shadow: 0 0 24px rgba(0, 0, 0, 0.15);
        margin: 0 auto;
        background: #fff;
        
        width: 100%;
    }
    .price-table {
        width: 100%;
        border-collapse: collapse;
        border: 0 none;
    }
    .price-table tr:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.03);
    }
    .price-table tr td {
        border-left: 1px solid rgba(0, 0, 0, 0.05);
        padding: 8px 24px;
        font-size: 14px;
    }
    .price-table tr td:first-child {
        border-left: 0 none;
    }
    .price-table tr td:not(:first-child) {
        text-align: center;
    }
    .price-table tr:nth-child(even) {
        background-color: #ffffff;
    }
    .price-table tr:hover {
        background-color: #eeeeee;
    }
    .price-table .fa-check {
        color: #5336ca;
    }
    .price-table .fa-times {
        color: #d8d6e3;
    }

    /* Highlighted column */
    .price-table tr:nth-child(2n) td:nth-child(3) {
        background-color: rgba(216, 214, 227, 0.25);
    }
    .price-table tr td:nth-child(3) {
        background-color: rgba(216, 214, 227, 0.15);
        padding: 8px 48px;
    }
    .price-table tr td:nth-child(3) .fa-check,
    .price-table tr:nth-child(2n) td:nth-child(3) .fa-check {
        /* color: #ffffff; */
    }
    /**/

    .price-table tr.price-table-head td {
        font-size: 16px;
        font-weight: 600;
        
        text-transform: uppercase;
    }
    .price-table tr td.header{
        background: #e7e7f1;
        font-size: 18px;
        font-weight: bold;
    }
    .price-table tr.price-table-head {
        background-color: #5336ca;
        color: #ffffff;
    }
    .price-table td.price {
        color: #5336c9;
        padding: 16px 24px;
        font-size: 40px;
        font-weight: 600;
        
        white-space: nowrap;
    }
    .price-table td.price a {
        background-color: #5336ca;
        color: #ffffff;
        padding: 12px 32px;
        margin-top: 16px;
        font-size: 12px;
        font-weight: 600;
        
        text-transform: uppercase;
        display: inline-block;
        border-radius: 64px;
        text-decoration: none;
        white-space: nowrap;
    }
    .price-table td.price-table-popular {
        
        border-top: 3px solid #5336ca;
        color: #5336ca;
        text-transform: uppercase;
        font-size: 12px;
        padding: 12px 48px;
        font-weight: 700;
    }
    .price-table .price-blank {
        background-color: #fafafa;
        border: 0 none;
    }

    .price-table svg {
        width: 90px;
        fill: #5336ca;
    }
    .container {
        z-index: 1;
        position: relative;
        padding: 50px 0 50px 0;
    }
</style>
