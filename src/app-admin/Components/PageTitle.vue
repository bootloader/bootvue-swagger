<template>
    <div class="app-page-title">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i :class="icon"/>
                </div>
                <div>
                    <slot name="heading">
                          {{heading}}
                    </slot>
                    <div class="page-title-subheading">
                        <slot name="subheading">
                            {{subheading}}
                        </slot>
                    </div>
                </div>
            </div>
            <div class="page-title-actions">

        <span v-for="(filter,index) in ifFilters" v-bind:key="'filter-'+index" class="filter-wrapper">
              <slot :name="'filter('+filter.name+')'"  v-bind="{filter}"  >
                    <span  v-if="!filter.hidden" >
                    </span>
              </slot>
        </span>

        <span class="action-wrapper" v-if="dateranegeinput && !dateranegeinput.hidden" >
            <date-range-picker v-model="dateranegeinput.range" class=""
            :opens="'left'"
            :time-picker="false"
            control-container-class="reportrange-text btn btn-success"
            :ranges="dateranegeinput.ranges"
            @select="onDateRangeSelect"
            @update="onDateRangeUpdate">

        <!--    input slot (new slot syntax)-->
        <template #input="picker" style="min-width: 350px;">
            <i class="fa fa-calendar-alt" />&nbsp;{{ picker.startDate | date }} - {{ picker.endDate | date }}
        </template>
        </date-range-picker>
        </span>

            <span v-for="(action,index) in actions" v-bind:key="'action-'+index" class="action-wrapper">
                <slot :name="'action('+action.name+')'"  v-bind="{action}"  >
                        <span  v-if="!action.hidden && actionShow[action.name]!==false" >
                            <router-link v-if="action.link" tag="button" :to="action.link"
                                type="button" class="btn-shadow d-inline-flex align-items-center btn"
                                v-bind:class="{
                                    'btn-link' : (action.type == 'link'),
                                    'btn-success' : (!action.type || action.type == 'button')
                                }">
                                <i v-if="action.icon" class="mr-2" :class="action.icon" />
                                {{action.label}} 
                            </router-link>

                            <div v-else-if="action.type == 'lane'" class="d-inline-flex align-items-center" style="min-width: 220px;">
                                <v-select  :options="input.lane.options"  class="w-100"
                                    v-model="input.lane.value"
                                    :searchable="false" :clearable="false"
                                    placeholder="Select Account"
                                    @input="clickAction(action)">
                                    <template #selected-option="option">
                                        <div class="">
                                        <span class="contact_type contact_type-24 fab"
                                                v-bind:class="MyDict.social[option.contactType]"></span>&nbsp;&nbsp;{{ option.lane }}</div>
                                    </template>
                                    <template #open-indicator="{ attributes }">
                                        <span v-bind="attributes" class="fa fa-caret-down"></span>
                                    </template>
                                    <template #option="{ contactType, lane }">
                                        <span class="contact_type contact_type-24 fab"
                                                v-bind:class="MyDict.social[contactType]"></span>  {{ lane }}
                                    </template>
                            </v-select>
                            </div>

                            <div v-else-if="action.type == 'search'" class="d-inline-flex">
                                <input class="form-control" type="text" name="" v-model="input.search.value" :placeholder="action.placeholder">
                            </div>

                            <div  v-else-if="action.type == 'apply'"  class="d-inline-flex" >
                                <button  @click="clickAction(action)" class="btn-shadow  align-items-center btn btn-success">
                                    <i v-if="action.icon" class="" :class="action.icon"/>{{action.label}}</button>
                            </div>

                            <div v-else class="d-inline-flex" > 
                                <b-button v-b-modal="action.modal"
                                    @click="clickAction(action)" 
                                    class="btn-shadow  align-items-center btn"
                                    v-bind:class="{
                                        'btn-link' : (action.type == 'link'),
                                        'btn-success' : (!action.type || action.type == 'button')
                                    }">
                                    <i v-if="action.icon" class="mr-2" :class="action.icon"/>
                                    {{action.label}}
                                </b-button>
                            </div>

                        </span>

                    </slot> 
                </span>
            </div>
        </div>
        <div style="clear: both;height: 0px;"></div>
    </div>
</template>

<script>

    import DateRangePicker from 'vue2-daterange-picker'
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
    import VueMoment from 'vue-moment'
    import moment from 'moment'


    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';


    import { MyFlags,MyDict,MyConst } from './../../services/global';

    function hour0(mmt){
        return mmt.hour(0).minute(0).seconds(0).milliseconds(0);
    }
    function hour24(mmt){
        //return mmt.hour(24).minute(0).seconds(0).milliseconds(0);
        return mmt.hour(23).minute(59).seconds(59).milliseconds(999);
    }

    export default {
        components: {
             DateRangePicker,vSelect,
        },

        data () {

            return {
                MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
                //DateRangeDateKeys 
                dateranegeinput : (() => { 
                    if(!this.daterange) return null;

                    var startDate = this.daterange.startDate || hour0(moment().subtract(7,"day")).toDate(),
                    endDate = this.daterange.endDate || hour24(moment()).toDate();

                    return {
                        range: {startDate : startDate, endDate : endDate},
                        ranges : {
                            'Today': [ hour0(moment()).toDate(), hour24(moment()).toDate()],
                            'Last 7 Days': [hour0(moment().subtract(7,"day")).toDate(), 
                                                hour24(moment()).toDate()],
                            'Yesterday': [hour0(moment().subtract(1,"day")).toDate(),
                                             hour24(moment().subtract(1,"day")).toDate()],

                            'This month': [hour0(moment().date(1)).toDate(), 
                                                hour24(moment()).toDate()],
                            'Last month': [hour0(moment().subtract(1,"month").date(1)).toDate(), 
                                               hour24(moment().date(0)).toDate()],
                            'This year': [hour0(moment().month(0).date(1)).toDate(), 
                                                hour24(moment()).toDate()],
                            'Last year': [hour0(moment().subtract(1,"year").month(0).date(1)).toDate(), 
                                            hour24(moment().month(0).date(0)).toDate()],
                        }
                    }
                })(),
               //OtherDateKeys 

                input : {
                    lane : {
                      options : [],
                      value : null,
                      sender : ""
                    },
                    search : {
                      value : null,
                    },
                    contacts : "",
                },


            } 
            
        },
        computed : {
            ifFilters(){
                return this.filters || [];
            }
        },
        filters: {
          date(val) {   
            return val ? val.toLocaleString() : ''
          }
        },
        created : function (argument) {
            if(this.daterange){
                if(!this.daterange.startDate){
                    this.daterange.startDate = hour0(moment()).toDate()
                }
                if(!this.daterange.endDate){
                    this.daterange.endDate = hour24(moment()).toDate()
                }  
                this.sanitizeDateRange(this.daterange);
            }
            this.loadLanes();
        },
        methods : {
            sanitizeDateRange : function (daterange) {
                var startDate = moment(daterange.startDate);
                var endDate = moment(daterange.endDate);
                daterange.startDate = hour0(startDate).toDate();
                daterange.endDate = hour24(endDate).toDate();
                return daterange;
            },
            async loadLanes (){
                let resp = await this.$service.getX('/api/options/channels');
                this.input.lane.options = this.$store.getters.StateApi.OptionsChannels;
            },
            onDateRangeSelect : function (r) {
                console.log("select",r);
                var range = this.sanitizeDateRange(r);
                this.dateranegeinput.range.startDate = range.startDate;
                this.dateranegeinput.range.endDate = range.endDate;
            },
            onDateRangeUpdate : function (r) {
                console.log("c_update",r);
                if(this.daterange){
                    this.daterange.startDate = r.startDate;
                    this.daterange.endDate = r.endDate;
                    this.$emit('dateRangeOnUpdate', r);
                }
            },
            clickAction : function (argument) {
                this.$emit('action',argument);
            },
            action : function (name,prop,value) {
                for(var i in this.actions){
                    if(this.actions[i].name == name){
                        this.actions[i][prop] = value;
                        break;
                    }
                }
            },
            getInput : function (name) {
                return this.input[name]?.value
            }
        },

        props: {
            icon: String,
            heading: String,
            subheading: String,
            actions : Array,
            filters : Array,
            daterange : {
                type: Object,
                default: function () {
                    return null;
                }
            },

            actionShow : {
                type: Object,
                default: function () {
                    return { message: 'hello' }
                }
            }
        },

    }
</script>


<style >
  .slot {
    background-color: #aaa;
    padding: 0.5rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .text-black {
    color: #000;
  }

</style>
<style lang="scss">
    .page-title-actions {
        display: flex;
        .action-wrapper {
            margin-left: 3px;
            display: block;
            float:left;
        }

            input.form-control {
                height: calc(2.25rem + 0px);
                margin-top: 0px;
            }
            button.btn {
                height: calc(2.25rem + 0px);
                margin-top: 0px;
                margin-bottom: 0px;
            }
            .v-select {
                input.vs__search {
                    color: #5a5a5a;
                }
                margin-top: 0px;
                height: calc(2.25rem + -1px);
                .vs__dropdown-toggle {
                   // height: calc(2.25rem + -1px);
                }
            }
            .vue-daterange-picker {
                min-height: 35px;
                //height: calc(2.25rem + -1px);
                .reportrange-text{
                    min-height: calc(2.25rem + 0px);
                    margin-top: 0px;
                    font-size: inherit;
                    font-weight: bold;
                }
                .daterangepicker.show-calendar .ranges {
                    padding: 0px !important;
                }

            }

        .filter-wrapper{
            float: left;
            display: flex;
            margin-left: 5px;
        }
    }
</style>
