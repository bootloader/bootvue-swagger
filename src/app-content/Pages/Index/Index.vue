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
                <SmartConversationsMobile :currency="currency" v-if="isMobile()" />
                <SmartConversations :currency="currency" v-else />
            </div>
            <div class="content" id="c2">
                <h3>
                    Mehery API solution, is for organizations, who have
                    omnichannel solutions from Call Center Application Vendors
                    or CRM vendors and want to plug in social media messengers
                </h3>
                <ApiMobile :currency="currency" v-if="isMobile()" />
                <Api :currency="currency" v-else />
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
                currency:"USD",
                defaultCur:"USD",
                supportedCur:["INR","USD","EUR","IDR","GBP","NZD","AUD"]
            }
        },
        computed: {},
        mounted: function () {
            jslocator.get().then((resp) => {
                let country = resp.country_code2;
                let currency = countryToCurrency[country]
                this.currency = this.supportedCur.indexOf(currency) != -1 ? 
                                currency : this.defaultCur;
                console.log('this.currency', this.currency);
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
