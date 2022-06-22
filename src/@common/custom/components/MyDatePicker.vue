<template>
    <date-range-picker
        v-model="dateranegeinput.range"
        class=""
        :opens="'left'"
        :time-picker="false"
        control-container-class="reportrange-text btn btn-success"
        :ranges="dateranegeinput.ranges"
        @select="onDateRangeSelect"
        @update="onDateRangeUpdate">
        <!--    input slot (new slot syntax)-->
        <template  #input="picker" style="min-width: 350px">
              <slot name="input" v-bind="picker">
                    <i class="fa fa-calendar-alt" />&nbsp;{{
                        picker.startDate | date
                    }}
                    - {{ picker.endDate | date }}
              </slot>
        </template>
        <template v-for="slotName in Object.keys($scopedSlots)" v-slot:[slotName]="slotScope">
              <slot :name="slotName" v-bind="slotScope"></slot>
        </template>
    </date-range-picker>
</template>

<script>
    import DateRangePicker from 'vue2-daterange-picker'
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
    import VueMoment from 'vue-moment'
    import moment from 'moment'

    function hour0(mmt) {
        return mmt.hour(0).minute(0).seconds(0).milliseconds(0)
    }
    function hour24(mmt) {
        //return mmt.hour(24).minute(0).seconds(0).milliseconds(0);
        return mmt.hour(23).minute(59).seconds(59).milliseconds(999)
    }

    function getTime(d){
        return new Date(d).getTime();
    }

    export default {
        props: {
            options: {},
            value: {},
            daterange: {},
            ranges : {
                default : ()=>['Today','Last 7 Days','Yesterday','This month','Last month','This year','Last year'],
            }
        },
        components: {
            DateRangePicker,
        },
        data() {
            return {
                //DateRangeDateKeys
                dateranegeinput: (() => {
                    if (!this.daterange) return null
                    var startDate =
                            this.daterange?.startDate ||
                            hour0(moment().subtract(7, 'day')).toDate(),
                        endDate =
                            this.daterange?.endDate || hour24(moment()).toDate()

                    let rangeOptions = {
                        TODAY: [
                            hour0(moment()).toDate(),
                            hour24(moment()).toDate(),
                        ],
                        'LAST7DAYS': [
                            hour0(moment().subtract(7, 'day')).toDate(),
                            hour24(moment()).toDate(),
                        ],
                        YESTERDAY: [
                            hour0(moment().subtract(1, 'day')).toDate(),
                            hour24(moment().subtract(1, 'day')).toDate(),
                        ],

                        'THISMONTH': [
                            hour0(moment().date(1)).toDate(),
                            hour24(moment()).toDate(),
                        ],
                        'LASTMONTH': [
                            hour0(
                                moment().subtract(1, 'month').date(1)
                            ).toDate(),
                            hour24(moment().date(0)).toDate(),
                        ],
                        'THISYEAR': [
                            hour0(moment().month(0).date(1)).toDate(),
                            hour24(moment()).toDate(),
                        ],
                        'LASTYEAR': [
                            hour0(
                                moment()
                                    .subtract(1, 'year')
                                    .month(0)
                                    .date(1)
                            ).toDate(),
                            hour24(moment().month(0).date(0)).toDate(),
                        ],
                    };

                    let dateranegeinput =  {
                        range: { startDate: startDate, endDate: endDate },
                        ranges: (this.ranges || []).reduce(function(ranges,span){
                            let key = span.replace(/\s/g,"").toUpperCase();
                            if(rangeOptions[key]){
                                ranges[span] = rangeOptions[key]
                            }
                            return ranges;
                        },{})
                    };

                    if((typeof this.daterange.span == 'string') && dateranegeinput.ranges[this.daterange.span ]){
                        dateranegeinput.range.startDate = dateranegeinput.ranges[this.daterange.span][0];
                        dateranegeinput.range.endDate = dateranegeinput.ranges[this.daterange.span][1];
                    }
                    return dateranegeinput;
                })(),
            }
        },
        filters: {
          date(val) {   
            return val ? val.toLocaleString() : ''
          }
        },
        created : function (argument) {
            if(this.daterange){
                //this.sanitizeDateRange(this.dateranegeinput.range);
                this.$emit('dateRangeOninit', {
                    startDate : getTime(this.dateranegeinput.range.startDate),
                    endDate :   getTime(this.dateranegeinput.range.endDate)
                });
            }
        },
        methods : {
            sanitizeDateRange : function (daterange) {
                var startDate = moment(daterange.startDate);
                var endDate = moment(daterange.endDate);
                daterange.startDate = hour0(startDate).toDate();
                daterange.endDate = hour24(endDate).toDate();
                return daterange;
            },
            onDateRangeSelect : function (r) {
                console.log("select",r);
                var range = this.sanitizeDateRange(r);
                this.dateranegeinput.range.startDate = range.startDate;
                this.dateranegeinput.range.endDate = range.endDate;
            },
            onDateRangeUpdate : function (r) {
                console.log("c_update",r);
                this.$emit('dateRangeOnUpdate', {
                    startDate : getTime(r.startDate),
                    endDate : getTime(r.endDate)
                });
            }
        },
    }
</script>
