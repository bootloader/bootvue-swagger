<template>
    <div class="m-master-view">
        <page-title :heading=header.heading :icon=header.icon
        :actions=actions :filters=filters :subheading=header.subheading @action="onActionINT" 
        ref="pageTitle">
            <template v-for="slotName in Object.keys($scopedSlots)" v-slot:[slotName]="slotScope">
              <slot :name="slotName" v-bind="{apply,...slotScope}"></slot>
            </template>
          <template #subheading>
              <slot name="header-subheading">
                  {{header.subheading}}
              </slot>
          </template>
        </page-title>

      <slot name="body">

        <div v-if="goodTable && table" class="bg-white" >
            <vue-good-table 
              :columns="table.fields"
              :rows="rowItems"
              compactMode
              :group-options="{
                enabled: !!table.groupBy
              }"
              :isLoading.sync="isbusy"
              :styleClass="'vgt-table condensed striped ' + table.tableClass"
            >
              <template slot="table-row" slot-scope="props">
                  <span v-if="$scopedSlots['cell('+ props.column.field  + ')']">
                    <slot :name="'cell('+ props.column.field  + ')'" v-bind="{props,item : props.row}">
                    </slot>
                  </span>  
                  <span v-else>
                    {{props.formattedRow[props.column.field]}}
                  </span>
              </template>
              <template slot="table-header-row" slot-scope="props">
                  <slot :name="'groupBy'" v-bind="{props, item : props.row}">
                  </slot>
              </template>
              <template slot="emptystate">
                  <div class="center-box">
                      <div v-if="!isbusy" class="center-item">
                        <div class="icon-wrapper"> <i :class="[header.icon,'no-item-icon dull']"/></div>
                        <span class="no-item-text"> No {{header.heading}} </span>
                      </div>
                  </div>
              </template>
              <template slot="loadingContent">
                  <div class="center-box">
                        <div class="center-item text-center text-success py-1" style="padding-top: 1em!important;">
                              <b-spinner style="width: 3rem; height: 3rem;" class="align-middle">
                              </b-spinner>
                            <span class="no-item-text text-success"> Loading {{header.heading}} </span>
                        </div>
                    </div>
              </template>
            </vue-good-table> 
        </div> 
        <div v-else-if="table" class="bg-white p-0">

          <b-table id="agent-session-list" :striped=true :class="[table.tableClass]" v-if="table.items"
                        empty-filtered-text="No Records"
                        :bordered="table.bordered || true"
                        :outlined="table.outlined || false"
                        :small="table.small || false"
                        :hover="table.hover || true"
                        :dark="table.dark || false"
                        :fixed="table.fixed || false"
                        :foot-clone="table.footClone || false"
                        :per-page="table.perPage"
                        :current-page="table_current_page"
                        :items="table.items"
                        :fields="table.fields"
                        :sort-by="table.sortBy"
                        :busy.sync="isbusy"
                        show-empty
                        filter>
                <template v-for="slotName in Object.keys($scopedSlots)" v-slot:[slotName]="slotScope">
                  <slot :name="slotName" v-bind="slotScope"></slot>
                </template>
                <template #empty>
                    <div class="center-box">
                        <div class="center-item">
                          <div class="icon-wrapper"> <i :class="[header.icon,'no-item-icon dull']"/></div>
                          <span class="no-item-text"> No {{header.heading}} </span>
                        </div>
                    </div>
                </template>
                <template #emptyfiltered="scope">
                    <div class="center-box">
                        <div class="center-item">
                          <div class="icon-wrapper"> <i :class="[header.icon,'no-item-icon dull']"/></div>
                          <span class="no-item-text"> --- {{ scope.emptyFilteredText }} ---- </span>
                        </div>
                    </div>
                </template>
                <template #table-busy>
                    <div class="center-box">
                        <div class="center-item text-center text-success py-1" style="padding-top: 1em!important;">
                              <b-spinner style="width: 3rem; height: 3rem;" class="align-middle">
                              </b-spinner>
                           <span class="no-item-text text-success"> Loading {{header.heading}} </span>
                        </div>
                    </div>
                </template>
            </b-table>
            <div v-else class="center-box">
                <div v-if="isbusy" class="text-center text-success my-2">
                  <b-spinner class="align-middle"></b-spinner>
                </div>
                <div v-else class="center-item">
                  <div> <i :class="[header.icon,'no-item-icon dull']"/></div>
                   <span class="no-item-text"> No {{header.heading}} </span>
                </div>
            </div>
            <b-pagination  v-if="table && table.items && table.items.length>table.perPage"
                  class="pb-3 pt-0 px-4"
                  v-model="table_current_page"
                  :total-rows="table.rows"
                  :per-page="table.perPage"
                  aria-controls="agent-session-list">        
            </b-pagination>

        </div> 

      </slot>  

    </div>

</template>

<script>

    import PageTitle from "../Components/PageTitle.vue";
    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import 'vue-good-table/dist/vue-good-table.css'
    import { VueGoodTable } from 'vue-good-table';
    import JsonXPath from "@/@common/utils/JsonXPath";

    export default {
        components: {
          PageTitle,VueGoodTable
        },
        props: {
          header: {
            type : Object
          },
          actions : {
            type : Array,
              default: function () {
                  return [];
              }
          },
          filters : {
            type : Array,
              default: function () {
                  return [];
              }
          },
          daterange : {
              type: Object
          },
          table : {
              type: Object
          },
          autoApply : {
              type: Boolean,
              default : true
          },
          goodTable : {
              type: Boolean,
              default : false
          },
          actionShow : {
              type: Object,
              default: function () {
                  return { message: 'hello' }
              }
          },
          size : {
          },
          busy : {
              type: Boolean,
              default : false
          }
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            input : {
                daterange : {
                    hidden : true,
                    startDate : null,
                    endDate : null,
                }
            },
            table_current_page : 1,
            session : null,
            busyintenral : false,
        }),
        computed : {
          isbusy : {
            get(){
              return this.busy || this.busyintenral;
            },
            set(newName){
              return newName;
            }
          },
          rowItems(){
            if(this.goodTable &&  this.table.groupBy){
                let map = {};
                let groupBy = this.table.groupBy;
                this.table.items.map(function(item){
                  let groupByValue = JsonXPath({ path : '$.'+groupBy,json : item})[0] || " DEFAULT ";
                  map[groupByValue] = map[groupByValue] || { 
                    mode : 'span',html: false, 
                    label : groupByValue,
                    children : []
                  };
                  map[groupByValue].children.push(item);
                },[]);
                return Object.values(map);
            } else {
              return this.table.items;
            }
          }
        },
        mounted : function (argument) {
          if(this.goodTable)
            this.convertToGoodTable();

          //this.dateRangeOnUpdate();
          if(this.autoApply)
            this.loadItems();

        },
        methods: {
          convertToGoodTable :  function(){
              this.table.fields.map(function(column){
                  column.field = column.key;
              });
          },
          async loadItems (additionalParams){
            var params = {};
            for(var i in this.actions){
              console.log("actions",i,this.actions[i]);
              var name = this.actions[i].param || this.actions[i].type;
              params[name] = this.getInput(name);//?.lane;
            }
            for(var i in this.filters){
              var name = this.filters[i].name || this.filters[i].param || this.filters[i].type;
              params[name] = this.filters[i].value;
            }
            for(var key in additionalParams){
              params[key] = additionalParams[key];
            }
            if(this.table && this.table.api){
              try {
                this.busyintenral  = true;
                var resp = await this.$service.get(this.table.api,params);
                this.table.items = resp.results;
                this.table.rows = this.table?.items?.length;
                this.session = resp.meta;
              } finally {
                  this.busyintenral = false;
              }
            }
            if(this.table?.items){
              this.$emit("rows", this.table.items);
            }
          },
          async apply(){
            this.loadItems();
          },
          onActionINT : function (argument) {
            console.log("onAction",argument)
            switch(argument.type){
              case "apply" :
                this.loadItems();
                break;
              default: {
                this.$emit('action',argument);
              }
            }
          },
          getInput : function (type) {
            return this.$refs.pageTitle.getInput(type);
          },
          getItems : function () {
            return this.table.items;
          }
        },
    }


</script>
<style lang="scss">
.m-master-view {
  .center-box {
    .center-item > div.icon-wrapper {
      height: 10em;
      width: 10em;
      opacity: 0.05;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      border: 5px solid black;
      border-radius: 50%;
      .no-item-icon {
          font-size: 5em;
          background-image: -webkit-gradient(linear, left top, left bottom, from(#000000), to(#000000)) !important;
          background-clip: text;
          text-fill-color: black;
          -webkit-text-fill-color : black;
          margin: auto;
          padding: 26px;
          &::after {
            position: relative;
            left: -50%;
          }
      }
    }
    .no-item-text {
        line-height: 40px;
        text-transform: uppercase;
        color: #c3c3c3;
        font-weight: bold;
    }
  }
}
</style>
<style type="text/css" scoped >
 
</style>
