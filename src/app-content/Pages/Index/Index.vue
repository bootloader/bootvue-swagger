<template>
    <div class="container">
        <input type="radio" id="tab1" name="tab" checked />
        <label for="tab1">Mehery Smart Conversations</label>
        <input type="radio" id="tab2" name="tab" />
        <label for="tab2">Mehery API</label>
        <div class="line"></div>
        <div class="content-container">
            <div class="content" id="c1">
                <h3>Get access to Smart Messaging services which include connectivity to your branded Facebook Messenger, Telegram, Twitter DM, a native web chat and a WhatsApp Business API Account</h3>
                <SmartConversations/>
            </div>
            <div class="content" id="c2">
                <h3>Get access to Mehery's Messaging API services which include connectivity to your branded Facebook Messenger, Telegram, Twitter DM, a native web chat and a WhatsApp Business API Account</h3>
                <Api/>
            </div>
        </div>
    </div>
</template>
<script>
    import jslocator from '../../../services/jslocator'
    import countryToCurrency from 'country-to-currency'
    import SmartConversations from '../Pricing/SmartConversations.vue'
    import Api from '../Pricing/Api.vue'
    export default {
    components() {
        Api,
        SmartConversations;
    },
    data() {
        return {};
    },
    computed: {},
    mounted: function () {
        jslocator.get().then((resp) => {
            let country = resp.country_code2;
            this.currency = countryToCurrency[country];
            console.log("this.currency", this.currency);
        });
    },
    methods: {},
    components: { SmartConversations, Api }
}
</script>
<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    body,
    html {
        margin: 0;
        padding: 0;
        height: 100%;
    }
    body {
        font-family: sans-serif;
        background: linear-gradient(45deg, #3949ab, #1e88e5);
        .container {
            width: 100%;
            max-width: 1170px;
            margin: 0 auto;
            position: relative;
            font-size: 0;
            box-shadow: 0 0 100px RGBa(0, 0, 0, 0.5);
            border-radius: 3px;
            input {
                display: none;
                &:checked + label {
                    background: #eee;
                }
                @for $i from 1 through 4 {
                    &#tab#{$i}:checked {
                        ~ .line {
                            left: #{($i - 1) * 50%};
                        }
                        ~ .content-container #c#{$i} {
                            opacity: 1;
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
                    background: #ccc;
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
                background: #eee;
                position: relative;
                font-size: 16px;
                .content {
                    position: absolute;
                    padding: 10px;
                    width: 100%;
                    top: 0;
                    opacity: 0;
                    transition: 0.25s ease;
                    color: #333;
                    h3{
                        text-align: center;
                        margin-top: 30px;
                        font-size: 26px;
                    }
                }
            }
        }
    }
</style>
