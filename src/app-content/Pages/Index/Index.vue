<template>
    <div class="container">
        <input type="radio" id="tab1" name="tab" checked />
        <label for="tab1">Mehery Smart Conversations</label>
        <input type="radio" id="tab2" name="tab" />
        <label for="tab2">Mehery API</label>
        <div class="line"></div>
        <div class="content-container">
            <div class="content" id="c1">
                <h3>
                    Smart Messaging is for Organizations which need a full
                    function Solution, with BOT interactions, Agent dashboards
                    with quick action elements to enhance Agent productivity,
                    downstream application linkages, eCommerce hooks and more.
                </h3>
                <SmartConversationsMobile
                    :currency="currency"
                    v-if="isMobile()"
                    :labels="labels"
                    :planData="smartConvPlanData" />
                <SmartConversations
                    :currency="currency"
                    :labels="labels"
                    :planData="smartConvPlanData"
                    v-else />
            </div>
            <div class="content" id="c2">
                <h3>
                    Mehery API solution, is for organizations, who have
                    omnichannel solutions from Call Center Application Vendors
                    or CRM vendors and want to plug in social media messengers
                </h3>
                <ApiMobile
                    :currency="currency"
                    :labels="labels"
                    :planData="apiPlanData"
                    v-if="isMobile()" />
                <Api
                    :currency="currency"
                    :planData="apiPlanData"
                    :labels="labels"
                    v-else />
            </div>
        </div>
    </div>
</template>
<script>
    import SmartConversations from '../Pricing/SmartConversations.vue'
    import ApiMobile from '../Pricing/ApiMobile.vue'
    import SmartConversationsMobile from '../Pricing/SmartConversationsMobile.vue'
    import Api from '../Pricing/Api.vue'
    import jslocator from '../../../services/jslocator'
    import countryToCurrency from 'country-to-currency'
    export default {
        data() {
            return {
                currency: 'USD',
                defaultCur: 'USD',
                supportedCur: ['INR', 'USD', 'EUR', 'IDR', 'GBP', 'NZD', 'AUD'],
                labels: {
                    planName: { label: '', type: 'text', hintText: '' },
                    channel: { label: '', type: 'text', hintText: '' },
                    price: {
                        label: 'Mehery License Fees (per month)',
                        type: 'price',
                        hintText: '',
                    },
                    perWASessionTemplate: {
                        label: 'Per WA Session / Template *',
                        type: 'text',
                        hintText: '',
                    },
                    nonWaMessageFee: {
                        label: 'Per Non-WA message Fee',
                        type: 'price',
                        hintText: '',
                    },
                    features: {
                        label: 'Features',
                        type: 'header',
                        hintText: '',
                    },
                    agents: { label: 'Agent', type: 'text', hintText: '' },
                    agentDashboard: {
                        label: 'Agent Dashboard',
                        type: 'boolean',
                        hintText: '',
                    },
                    templateCreationWABA: {
                        label: 'Template Creation - WABA',
                        type: 'boolean',
                        hintText: '',
                    },
                    marketingBroadcasts: {
                        label: 'Marketing Broadcasts',
                        type: 'boolean',
                        hintText: '',
                    },
                    quickReplies: {
                        label: 'Quick Replies',
                        type: 'boolean',
                        hintText: '',
                    },
                    whatsAppChatWidget: {
                        label: 'WhatsApp Chat Widget',
                        type: 'boolean',
                        hintText: '',
                    },
                    customerTags: {
                        label: 'Customer Tags',
                        type: 'boolean',
                        hintText: '',
                    },
                    sessionTags: {
                        label: 'Session Tags',
                        type: 'boolean',
                        hintText: '',
                    },
                    chatDistributionRules: {
                        label: 'Chat Distribution rules',
                        type: 'boolean',
                        hintText: '',
                    },
                    aPIsAndWebhooks: {
                        label: 'APIs and Webhooks',
                        type: 'boolean',
                        hintText: '',
                    },
                    eCommercePluginForWA: {
                        label: 'eCommerce Plugin for WA',
                        type: 'boolean',
                        hintText: '',
                    },
                    meheryBranding: {
                        label: 'Mehery Branding',
                        type: 'boolean',
                        hintText: '',
                    },
                    botWorkflows: {
                        label: 'BOT workflows',
                        type: 'text',
                        hintText: '',
                    },
                    nlpMachineLearning: {
                        label: 'NLP and Machine Learning',
                        type: 'boolean',
                        hintText: '',
                    },
                    addOn: { label: 'Add Ons', type: 'header', hintText: '' },
                    eachAdditionalAgent: {
                        label: 'Additional Agents',
                        type: 'price',
                        hintText: 'Per Agent per month',
                    },
                    apiSetup: {
                        label: 'CRM, Call Centers - each API per year',
                        type: 'price',
                        hintText:
                            'Any Call Center or CRM Solution of your choice',
                    },
                    perWhatsappNum: {
                        label: 'Additional WhatsApp numbers',
                        type: 'price',
                        hintText: 'Within the same FB Business Manager ID',
                    },
                    agentApp: {
                        label: 'Agent App for IOS and Android',
                        type: 'price',
                        hintText: 'Pack of 5 Users / per year',
                    },
                    botBuilder: {
                        label: 'BOT Flow Builder UI ',
                        type: 'price',
                        hintText: 'For 5 developers. Per Year',
                    },
                    additionalChannels: {
                        label: 'Additional Channels',
                        type: 'price',
                        hintText: 'Per Channel, Per month',
                    },
                    setupFee: {
                        label: 'Set-up Fees',
                        type: 'price',
                        hintText: 'Only if Mehery Support is required',
                    },
                    support: { label: 'Support', type: 'header', hintText: '' },
                    emailWhatsAppSupport: {
                        label: 'Email & WhatsApp Support',
                        type: 'boolean',
                        hintText: '',
                    },
                },
                apiPlanData: [
                    {
                        planName: 'Starter',
                        channel: 'WA Only',
                        popular: false,
                        price: {
                            INR: '₹ 16,000',
                            USD: '$ 200',
                            EUR: '€ 220',
                            IDR: 'IDR 3.00 mio',
                            GBP: '£ £170',
                            NZD: 'A$ 300',
                            AUD: 'A$ 300',
                        },
                        sessionTemplateFees: 'As per Table',
                        perWASessionTemplate: 'WA Fees + 20%',
                        nonWaMessageFee: {
                            USD: '$ 0.0060',
                            EUR: '€ 0.0066',
                            INR: '₹ 0.12',
                            IDR: 'IDR 90',
                            GBP: '£ 0.0051',
                            NZD: 'A$ 0.0090',
                            AUD: 'A$ 0.0090',
                        },
                        agents: 5,
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
                        botWorkflows: 'Basic',
                        nlpMachineLearning: false,
                        eachAdditionalAgent: {
                            INR: '₹2,400',
                            USD: '$33',
                            EUR: '€23.00',
                            IDR: 'IDR 4,50,000',
                            GBP: '£26.00',
                            NZD: 'A$45',
                            AUD: 'A$45',
                        },
                        apiSetup: {
                            INR: '₹ 50,000',
                            USD: '$	625',
                            EUR: '€ 688',
                            IDR: 'IDR 9.38mio',
                            GBP: '£ 531',
                            NZD: 'A$938',
                            AUD: 'A$938',
                        },
                        perWhatsappNum: {
                            INR: '₹ 10,000',
                            USD: '$	125',
                            EUR: '€ 138',
                            IDR: 'IDR 1.88 mio',
                            GBP: '£	106',
                            NZD: 'A$188',
                            AUD: 'A$188',
                        },
                        agentApp: {
                            INR: '₹ 50,000',
                            USD: '$	625',
                            EUR: '€ 688',
                            IDR: 'IDR 9.38mio',
                            GBP: '£ 531',
                            NZD: 'A$938',
                            AUD: 'A$938',
                        },
                        botBuilder: {
                            INR: '₹80,000',
                            USD: '$1,000',
                            EUR: '€688',
                            IDR: 'IDR 15.00 mio',
                            GBP: '£850',
                            NZD: 'A$1,500',
                            AUD: 'A$1,500',
                        },
                        additionalChannels:{
                            INR: '₹ 8,000',
                            USD: '$	100',
                            EUR: '€ 110',
                            IDR: 'IDR 1.50 mio',
                            GBP: '£ 85',
                            NZD: 'A$150',
                            AUD: 'A$150',
                        },
                        setupFee: {
                            INR: '₹ 1,20,000',
                            USD: '$	1,500',
                            EUR: '€ 1,650',
                            IDR: 'IDR 22.50 mio',
                            GBP: '£	1,275',
                            NZD: 'A$ 2,250',
                            AUD: 'A$ 2,250',
                        },
                        emailWhatsAppSupport: true,
                    },
                    {
                        planName: 'Advanced',
                        channel: 'All Channels',
                        popular: true,
                        price: {
                            INR: '₹ 46,000',
                            USD: '$	575',
                            EUR: '€ 633',
                            IDR: 'IDR 8.63 mio',
                            GBP: '£	489',
                            NZD: 'A$ 863',
                            AUD: 'A$ 863',
                        },
                        sessionTemplateFees: 'As per Table',
                        perWASessionTemplate: 'WA Fees + 20%',
                        nonWaMessageFee: {
                            USD: '$ 0.0060',
                            EUR: '€ 0.0066',
                            INR: '₹ 0.12',
                            IDR: 'IDR 90',
                            GBP: '£ 0.0051',
                            NZD: 'A$ 0.0090',
                            AUD: 'A$ 0.0090',
                        },
                        agents: "Unlimited",
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
                        apiSetup: {
                            INR: '₹ 50,000',
                            USD: '$	625',
                            EUR: '€ 688',
                            IDR: 'IDR 9.38mio',
                            GBP: '£ 531',
                            NZD: 'A$938',
                            AUD: 'A$938',
                        },
                        perWhatsappNum: {
                            INR: '₹ 10,000',
                            USD: '$	125',
                            EUR: '€ 138',
                            IDR: 'IDR 1.88 mio',
                            GBP: '£	106',
                            NZD: 'A$188',
                            AUD: 'A$188',
                        },
                        agentApp: {
                            INR: '₹ 50,000',
                            USD: '$	625',
                            EUR: '€ 688',
                            IDR: 'IDR 9.38mio',
                            GBP: '£ 531',
                            NZD: 'A$938',
                            AUD: 'A$938',
                        },
                        botBuilder: {
                            INR: '₹80,000',
                            USD: '$1,000',
                            EUR: '€688',
                            IDR: 'IDR 15.00 mio',
                            GBP: '£850',
                            NZD: 'A$1,500',
                            AUD: 'A$1,500',
                        },
                        additionalChannels:"NA",
                        setupFee: {
                            INR: '₹ 2,40,000',
                            USD: '$ 3,000',
                            EUR: '€ 3,300',
                            IDR: 'IDR 45.00 mio',
                            GBP: '£ 2,550',
                            NZD: 'A$ 4,500',
                            AUD: 'A$ 4,500',
                        },
                        emailWhatsAppSupport: true,
                    },
                ],
                smartConvPlanData: [
                    {
                        planName: 'Starter',
                        channel: 'WA Only',
                        price: {
                            INR: '₹ 16,000',
                            USD: '$ 200',
                            EUR: '€ 220',
                            IDR: 'IDR 3.00 mio',
                            GBP: '£ 170',
                            NZD: 'A$ 300',
                            AUD: 'A$ 300',
                        },
                        sessionTemplateFees: 'As per Table',
                        perWASessionTemplate: 'WA Fees + 20%',
                        nonWaMessageFee: {
                            USD: '$ 0.0060',
                            EUR: '€ 0.0066',
                            INR: '₹ 0.12',
                            IDR: 'IDR 90',
                            GBP: '£ 0.0051',
                            NZD: 'A$ 0.0090',
                            AUD: 'A$ 0.0090',
                        },
                        agents: '5',
                        agentDashboard: true,
                        templateCreationWABA: true,
                        marketingBroadcasts: true,
                        quickReplies: true,
                        whatsAppChatWidget: true,
                        customerTags: true,
                        sessionTags: true,
                        chatDistributionRules: true,
                        aPIsAndWebhooks: true,
                        eCommercePluginForWA: false,
                        meheryBranding: true,
                        botWorkflows: 'Basic',
                        nlpMachineLearning: false,
                        eachAdditionalAgent: {
                            INR: '₹2,400',
                            USD: '$33',
                            EUR: '€23.00',
                            IDR: 'IDR 4,50,000',
                            GBP: '£26.00',
                            NZD: 'A$45',
                            AUD: 'A$45',
                        },
                        apiSetup: {
                            INR: '₹ 50,000',
                            USD: '$	625',
                            EUR: '€ 688',
                            IDR: 'IDR 9.38mio',
                            GBP: '£ 531',
                            NZD: 'A$938',
                            AUD: 'A$938',
                        },
                        perWhatsappNum: {
                            INR: '₹ 10,000',
                            USD: '$	125',
                            EUR: '€ 138',
                            IDR: 'IDR 1.88 mio',
                            GBP: '£	106',
                            NZD: 'A$188',
                            AUD: 'A$188',
                        },
                        agentApp: {
                            INR: '₹ 50,000',
                            USD: '$	625',
                            EUR: '€ 688',
                            IDR: 'IDR 9.38mio',
                            GBP: '£ 531',
                            NZD: 'A$938',
                            AUD: 'A$938',
                        },
                        botBuilder: {
                            INR: '₹80,000',
                            USD: '$1,000',
                            EUR: '€688',
                            IDR: 'IDR 15.00 mio',
                            GBP: '£850',
                            NZD: 'A$1,500',
                            AUD: 'A$1,500',
                        },
                        additionalChannels:{
                            INR: '₹ 8,000',
                            USD: '$	100',
                            EUR: '€ 110',
                            IDR: 'IDR 1.50 mio',
                            GBP: '£ 85',
                            NZD: 'A$150',
                            AUD: 'A$150',
                        },
                        setupFee: {
                            INR: '₹ 1,20,000',
                            USD: '$	1,500',
                            EUR: '€ 1,650',
                            IDR: 'IDR 22.50 mio',
                            GBP: '£	1,275',
                            NZD: 'A$ 2,250',
                            AUD: 'A$ 2,250',
                        },
                        emailWhatsAppSupport: true,
                    },
                    {
                        planName: 'ADVANCED',
                        channel: 'All Channels',
                        price: {
                            INR: '₹ 46,000',
                            USD: '$ 575',
                            EUR: '€ 633',
                            IDR: 'IDR 8.63 mio',
                            GBP: '£ 489',
                            NZD: 'A$ 863',
                            AUD: 'A$ 863',
                        },
                        sessionTemplateFees: 'As per Table',
                        perWASessionTemplate: 'WA Fees + 20%',
                        nonWaMessageFee: {
                            USD: '$ 0.0060',
                            EUR: '€ 0.0066',
                            INR: '₹ 0.12',
                            IDR: 'IDR 90',
                            GBP: '£ 0.0051',
                            NZD: 'A$ 0.0090',
                            AUD: 'A$ 0.0090',
                        },
                        agents: 'Unlimited',
                        agentDashboard: true,
                        templateCreationWABA: true,
                        marketingBroadcasts: true,
                        quickReplies: true,
                        whatsAppChatWidget: true,
                        customerTags: true,
                        sessionTags: true,
                        chatDistributionRules: true,
                        aPIsAndWebhooks: true,
                        eCommercePluginForWA: true,
                        meheryBranding: false,
                        botWorkflows: 'Advanced',
                        nlpMachineLearning: false,
                        eachAdditionalAgent: 'NA',
                        apiSetup: {
                            INR: '₹ 50,000',
                            USD: '$	625',
                            EUR: '€ 688',
                            IDR: 'IDR 9.38mio',
                            GBP: '£ 531',
                            NZD: 'A$938',
                            AUD: 'A$938',
                        },
                        perWhatsappNum: {
                            INR: '₹ 10,000',
                            USD: '$	125',
                            EUR: '€ 138',
                            IDR: 'IDR 1.88 mio',
                            GBP: '£	106',
                            NZD: 'A$188',
                            AUD: 'A$188',
                        },
                        agentApp: {
                            INR: '₹ 50,000',
                            USD: '$	625',
                            EUR: '€ 688',
                            IDR: 'IDR 9.38mio',
                            GBP: '£ 531',
                            NZD: 'A$938',
                            AUD: 'A$938',
                        },
                        botBuilder: {
                            INR: '₹80,000',
                            USD: '$1,000',
                            EUR: '€688',
                            IDR: 'IDR 15.00 mio',
                            GBP: '£850',
                            NZD: 'A$1,500',
                            AUD: 'A$1,500',
                        },
                        additionalChannels:{
                            INR: '₹ 8,000',
                            USD: '$	100',
                            EUR: '€ 110',
                            IDR: 'IDR 1.50 mio',
                            GBP: '£ 85',
                            NZD: 'A$150',
                            AUD: 'A$150',
                        },
                        setupFee: {
                            INR: '₹ 2,40,000',
                            USD: '$ 3,000',
                            EUR: '€ 3,300',
                            IDR: 'IDR 45.00 mio',
                            GBP: '£ 2,550',
                            NZD: 'A$ 4,500',
                            AUD: 'A$ 4,500',
                        },
                        emailWhatsAppSupport: true,
                    },
                    {
                        planName: 'Super',
                        channel: 'All Channels',
                        price: {
                            INR: '₹ 1,00,000',
                            USD: '$ 1,250',
                            EUR: '€ 1,375',
                            IDR: 'IDR 18.75 mio',
                            GBP: '£ 1,063',
                            NZD: 'A$ 1,875',
                            AUD: 'A$ 1,875',
                        },
                        sessionTemplateFees: 'As per Table',
                        perWASessionTemplate: 'WA Fees + 20%',
                        nonWaMessageFee: {
                            USD: '$ 0.0060',
                            EUR: '€ 0.0066',
                            INR: '₹ 0.12',
                            IDR: 'IDR 90',
                            GBP: '£ 0.0051',
                            NZD: 'A$ 0.0090',
                            AUD: 'A$ 0.0090',
                        },
                        agents: 'Unlimited',
                        agentDashboard: true,
                        templateCreationWABA: true,
                        marketingBroadcasts: true,
                        quickReplies: true,
                        whatsAppChatWidget: true,
                        customerTags: true,
                        sessionTags: true,
                        chatDistributionRules: true,
                        aPIsAndWebhooks: true,
                        eCommercePluginForWA: true,
                        meheryBranding: false,
                        botWorkflows: 'Advanced',
                        nlpMachineLearning: true,
                        eachAdditionalAgent: 'NA',
                        apiSetup: {
                            INR: '₹ 50,000',
                            USD: '$	625',
                            EUR: '€ 688',
                            IDR: 'IDR 9.38mio',
                            GBP: '£ 531',
                            NZD: 'A$938',
                            AUD: 'A$938',
                        },
                        perWhatsappNum: {
                            INR: '₹ 10,000',
                            USD: '$	125',
                            EUR: '€ 138',
                            IDR: 'IDR 1.88 mio',
                            GBP: '£	106',
                            NZD: 'A$188',
                            AUD: 'A$188',
                        },
                        agentApp: {
                            INR: '₹ 50,000',
                            USD: '$	625',
                            EUR: '€ 688',
                            IDR: 'IDR 9.38mio',
                            GBP: '£ 531',
                            NZD: 'A$938',
                            AUD: 'A$938',
                        },
                        botBuilder: {
                            INR: '₹80,000',
                            USD: '$1,000',
                            EUR: '€688',
                            IDR: 'IDR 15.00 mio',
                            GBP: '£850',
                            NZD: 'A$1,500',
                            AUD: 'A$1,500',
                        },
                        additionalChannels:{
                            INR: '₹ 8,000',
                            USD: '$	100',
                            EUR: '€ 110',
                            IDR: 'IDR 1.50 mio',
                            GBP: '£ 85',
                            NZD: 'A$150',
                            AUD: 'A$150',
                        },
                        setupFee: {
                            INR: '₹ 2,40,000',
                            USD: '$ 3,000',
                            EUR: '€ 3,300',
                            IDR: 'IDR 45.00 mio',
                            GBP: '£ 2,550',
                            NZD: 'A$ 4,500',
                            AUD: 'A$ 4,500',
                        },
                        emailWhatsAppSupport: true,
                    },
                ],
            }
        },
        computed: {},
        mounted: function () {
            jslocator.get().then((resp) => {
                let country = resp.country_code2
                let currency = countryToCurrency[country]
                this.currency =
                    this.supportedCur.indexOf(currency) != -1
                        ? currency
                        : this.defaultCur
                console.log('this.currency', this.currency)
            })
        },
        methods: {
            isMobile() {
                if ('maxTouchPoints' in navigator)
                    return navigator.maxTouchPoints > 0 ? true : false
                else
                    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                        navigator.userAgent
                    )
            },
        },
        components: {
            SmartConversations,
            ApiMobile,
            SmartConversationsMobile,
            Api,
        },
    }
</script>
<style lang="scss" scoped>
    .container {
        width: 100%;
        max-width: 1170px;
        margin: 0 auto;
        position: relative;
        font-size: 0;
        border-radius: 3px;
        input {
            display: none;
            &:checked + label {
                background: none;
            }
            @for $i from 1 through 4 {
                &#tab#{$i}:checked {
                    ~ .line {
                        left: #{($i - 1) * 50%};
                    }
                    ~ .content-container #c#{$i} {
                        display: block;
                    }
                }
            }
        }
        label {
            display: inline-block;
            font-size: 16px;
            height: 36px;
            line-height: 36px;
            width: 50%;
            text-align: center;
            background: #f4f4f4;
            color: #555;
            position: relative;
            transition: 0.25s background ease;
            cursor: pointer;
            &::after {
                content: '';
                height: 2px;
                width: 100%;
                position: absolute;
                display: block;
                bottom: 0;
                opacity: 0;
                left: 0;
                transition: 0.25s ease;
            }
            &:hover::after {
                opacity: 1;
            }
        }
        .line {
            position: absolute;
            height: 2px;
            background: #1e88e5;
            width: 50%;
            top: 34px;
            left: 0;
            transition: 0.25s ease;
        }
        .content-container {
            position: relative;
            font-size: 16px;
            .content {
                position: relative;
                padding: 10px;
                width: 100%;
                display: none;
                transition: 0.25s ease;
                color: #333;
                h3 {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 20px;
                }
            }
        }
    }
</style>
<style lang="scss">
    @import '@/assets/app-content.scss';

    .my-tooltip {
        display: block !important;
        z-index: 100000000;

        .tooltip-inner {
            background: black;
            color: white;
            border-radius: 8px;
            padding: 5px 10px 4px;
        }

        .tooltip-arrow {
            width: 0;
            height: 0;
            border-style: solid;
            position: absolute;
            margin: 5px;
            border-color: black;
            z-index: 1;
        }

        &[x-placement^='top'] {
            margin-bottom: 5px;

            .tooltip-arrow {
                border-width: 5px 5px 0 5px;
                border-left-color: transparent !important;
                border-right-color: transparent !important;
                border-bottom-color: transparent !important;
                bottom: -5px;
                left: calc(50% - 5px);
                margin-top: 0;
                margin-bottom: 0;
            }
        }

        &[x-placement^='bottom'] {
            margin-top: 5px;

            .tooltip-arrow {
                border-width: 0 5px 5px 5px;
                border-left-color: transparent !important;
                border-right-color: transparent !important;
                border-top-color: transparent !important;
                top: -5px;
                left: calc(50% - 5px);
                margin-top: 0;
                margin-bottom: 0;
            }
        }

        &[x-placement^='right'] {
            margin-left: 5px;

            .tooltip-arrow {
                border-width: 5px 5px 5px 0;
                border-left-color: transparent !important;
                border-top-color: transparent !important;
                border-bottom-color: transparent !important;
                left: -5px;
                top: calc(50% - 5px);
                margin-left: 0;
                margin-right: 0;
            }
        }

        &[x-placement^='left'] {
            margin-right: 5px;

            .tooltip-arrow {
                border-width: 5px 0 5px 5px;
                border-top-color: transparent !important;
                border-right-color: transparent !important;
                border-bottom-color: transparent !important;
                right: -5px;
                top: calc(50% - 5px);
                margin-left: 0;
                margin-right: 0;
            }
        }

        &.popover {
            $color: #f9f9f9;

            .popover-inner {
                background: $color;
                color: black;
                padding: 24px;
                border-radius: 5px;
                box-shadow: 0 5px 30px rgba(black, 0.1);
            }

            .popover-arrow {
                border-color: $color;
            }
        }

        &[aria-hidden='true'] {
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.15s, visibility 0.15s;
        }

        &[aria-hidden='false'] {
            visibility: visible;
            opacity: 1;
            transition: opacity 0.15s;
        }
    }
</style>
