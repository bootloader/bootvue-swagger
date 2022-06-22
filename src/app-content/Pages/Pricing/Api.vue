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
                                <td v-if="['text','price','boolean'].indexOf(row.type) != -1">{{ row.label }} <i class="fas fa-info-circle" v-if="row.hintText != ''" :title="row.hintText"  v-tooltip="row.hintText"></i></td>
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
    export default {
        props:{
            currency:String,
            planData:Array,
            labels:Object,
        },
        data() {
            return {
                text: {},
            }
        },
        computed: {},
        mounted: function () {
            
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
