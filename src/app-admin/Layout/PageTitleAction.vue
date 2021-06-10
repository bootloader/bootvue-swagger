<template>
    <div class="app-page-title">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i :class="icon"/>
                </div>
                <div>
                    {{heading}}
                    <div
                        class="page-title-subheading">
                        {{subheading}}
                    </div>
                </div>
            </div>
            <div class="page-title-actions">
                <span v-for="action in actions" >
                    <router-link v-if="action.link" tag="button" :to="action.link"
                        type="button" class="btn-shadow d-inline-flex align-items-center btn"
                        v-bind:class="{
                            'btn-link' : (action.type == 'link'),
                            'btn-success' : (!action.type || action.type == 'button')
                        }">
                        <font-awesome-icon v-if="action.icon" class="mr-2" :icon="action.icon"/>
                        {{action.label}} 
                    </router-link>
                    <button v-else @click="clickAction(action)" class="btn-shadow d-inline-flex align-items-center btn"
                        v-bind:class="{
                            'btn-link' : (action.type == 'link'),
                            'btn-success' : (!action.type || action.type == 'button')
                        }">
                        <font-awesome-icon v-if="action.icon" class="mr-2" :icon="action.icon"/>
                        {{action.label}} 
                    </button>
                </span>

               <date-range-picker v-if="dateranegeinput" v-model="dateranegeinput.range"
                    :opens="'left'"
                    :time-picker="false"
                    :ranges="dateranegeinput.ranges"
                    @select="onDateRangeSelect"
                    @update="onDateRangeUpdate"
               >
                <!--    input slot (new slot syntax)-->
                <template #input="picker" style="min-width: 350px;">
                  {{ picker.startDate | date }} - {{ picker.endDate | date }}
                </template>
              </date-range-picker>


            </div>
        </div>
    </div>
</template>

<script>
    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faStar,
        faPlus
    } from '@fortawesome/free-solid-svg-icons'
    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

    import DateRangePicker from 'vue2-daterange-picker'
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
    import VueMoment from 'vue-moment'
    import moment from 'moment'

    library.add(
        faStar,
        faPlus,
    );


    function hour0(mmt){
        return mmt.hour(0).minute(0).seconds(0).milliseconds(0);
    }
    function hour24(mmt){
        return mmt.hour(23).minute(59).seconds(59).milliseconds(999);
    }

    export default {
        components: {
            'font-awesome-icon': FontAwesomeIcon,
             DateRangePicker,
        },

        data () {

            return {
                //DateRangeDateKeys 
                dateranegeinput : (() => { 
                    if(!this.daterange) return null;

                    var startDate = this.daterange.startDate || hour0(moment()).toDate(),
                    endDate = this.daterange.endDate || hour24(moment()).toDate();

                    return {
                        range: {startDate : startDate, endDate : endDate},
                        ranges : {
                            'Today': [ hour0(moment()).toDate(), hour24(moment()).toDate()],

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
            }
        },
        methods : {
            onDateRangeSelect : function (r) {
                console.log("select",r,);
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
            }
        },

        props: {
            icon: String,
            heading: String,
            subheading: String,
            actions : Array,
            daterange : {
                type: Object
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
  .vue-daterange-picker .form-control.reportrange-text{
    background: #6bab8d;
    color: #FFF;
    font-size: inherit;
    font-weight: bold;
  }
</style>