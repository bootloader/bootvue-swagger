<template>
    <b-card no-body class="shadow">
        <b-card-header class="bg-transparent border-0">
                <b-row>
                  <b-col lg="8">
                    <h3 class="mb-0">{{headerTitle}}</h3>
                  </b-col>
                    <b-col sm="2" v-if="true" class="text-right">
                      <span class="fa fa-download mt-3" @click="downloadCSVtemplate"></span>
                    </b-col>
                    <b-col lg="2"  v-if="options && options.length">
                        <base-select
                            alternative
                            question
                            type="text"
                            name="Domain"
                            placeholder="Domain"
                            rules="required"
                            required
                            v-model="optionVal"
                            @change="optionOnChange"
                            :options="options"
                            >
                        </base-select>
                    </b-col>
                    <b-col lg="2" v-if="daterange">
                      <date-range-picker v-model="dateranegeinput.range" class=""
                        :opens="'left'"
                        :time-picker="false"
                        control-container-class="reportrange-text"
                        :ranges="dateranegeinput.ranges"
                        :max-date="maxDate"
                        @select="onDateRangeSelect"
                        @update="onDateRangeUpdate">
                        <!--    input slot (new slot syntax)-->
                          <template #input="picker" style="min-width: 350px;">
                              <i class="fa fa-calendar-alt" />&nbsp;{{ picker.startDate | date }} - {{ picker.endDate | date }}
                          </template>
                        </date-range-picker>
                    </b-col>
                    
                </b-row>
        </b-card-header>

        <el-table class="table-responsive table"
                  :default-sort = "{prop: 'name', order: 'ascending'}"
                  :data="tableData">
            <el-table-column label="Channel"
              fixed
              header-align="left"
              min-width="200px"
              prop="name">
              <template v-slot="{row}">
                  <b-media no-body class="align-items-center  ">
                      <b-media-body>
                          <span class="font-weight-600 name mb-0 ml-2 text-sm">{{row.name}}</span>
                      </b-media-body>
                  </b-media>
              </template>
            </el-table-column>
            <el-table-column v-for="column,key in tableData[0]" 
                         :key="key"
                         :prop="key"
                         header-align="center"
                         :label="colHeadFormatter ? colHeadFormatter(key) : key"
                         min-width="120px"
                         v-if="key != 'name'"
                      >
                <template v-slot="{row}">
                  <b-media no-body class="align-items-center  text-center">
                      <b-media-body>
                          <span class="font-weight-600 name mb-0 text-sm">{{row[key]}}</span>
                      </b-media-body>
                  </b-media>
              </template>
        </el-table-column>
        </el-table>

    </b-card>
</template>
<script>
  import { Table, TableColumn} from 'element-ui'
  import moment from 'moment'
  import VueMoment from 'vue-moment';
  import DateRangePicker from 'vue2-daterange-picker'
  import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
  import {Parser} from 'json2csv';

  function hour0(mmt){
    return mmt.hour(0).minute(0).seconds(0).milliseconds(0);
  }
  function hour24(mmt){
    return mmt.hour(23).minute(59).seconds(59).milliseconds(999);
  }
  export default {
    name: 'dynamic-left-top-freeze-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      DateRangePicker
    },
    props:{
      tableData:Array,
      headerTitle:String,
      optionOnChange:Function,
      options:Array,
      daterangeChange:Function,
      colHeadFormatter:Function,
      daterange : {
        type: Object,
        default: function () {
          return null;
        }
      },
    },
    filters: {
      date(val) {   
        console.log("val",val);
        if(val){
          return moment(val).format("DD/MM/YYYY");
        }
        return ''
      }
    },
    computed:{
      maxDate(){
        return hour24(moment()).toDate()
      }
    },
    data() {
      return {
        optionVal: null,
        dateranegeinput : (() => { 
          if(!this.daterange) return null;

          var startDate = this.daterange.startDate || hour0(moment().subtract(7,"day")).toDate(),
          endDate = this.daterange.endDate || hour24(moment()).toDate();

          return {
              range: {startDate : startDate, endDate : endDate},
              ranges : {
                  'Last 7 Days': [hour0(moment().subtract(7,"day")).toDate(), 
                                    hour24(moment()).toDate()],
                  'This month': [hour0(moment().date(1)).toDate(), 
                                      hour24(moment()).toDate()],
                  'Last month': [hour0(moment().subtract(1,"month").date(1)).toDate(), 
                                      hour24(moment().date(0)).toDate()],
              }
          }
        })(),
      };
    },
    watch:{
      options:function(n,o){
        if(this.options)
          this.optionVal = this.options[0]?.value;
      }
    },
    mounted(){
      if(this.options)
          this.optionVal = this.options[0]?.value;
    },
    methods:{
      logEvent: function(e, test) {
          console.log(e, test)
      },
      dateFormat: function (a,b){
        console.log(a,b);
      },
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
          if(this.daterange){
              this.daterange.startDate = r.startDate;
              this.daterange.endDate = r.endDate;
              this.daterangeChange(r);
          }
      },
      startSelection:function(e){
        console.log(e)
      },
      downloadCSVtemplate(){
        if(Object.keys(this.tableData).length){
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(this.tableData);
            console.log("csv",csv);
            let csvContent = "data:text/csv;charset=utf-8,"+csv;
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "bulk_upload_format.csv");
            document.body.appendChild(link); // Required for FF
            link.click();
        }
      }
    }
  }
</script>
<style lang="scss">
.vue-daterange-picker {
    min-height: 35px;
    float: right;
    .reportrange-text{
        min-height: calc(2.25rem + 0px);
        margin-top: 0px;
        font-size: inherit;
        font-weight: normal;
        white-space: nowrap ;
        color: #8898aa;
        border-color: transparent;
        padding: 8px;
        box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
    }
    .daterangepicker.show-calendar .ranges {
        padding: 0px !important;
    }

} 
</style>