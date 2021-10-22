<template>
    <div>
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


       <b-table v-if="table" id="agent-session-list" :striped=true
                     :bordered=true
                     :outlined=false
                     :small=true
                     :hover=true
                     :dark=false
                     :fixed=false
                     :foot-clone=false
                     :per-page="table.perPage"
                     :current-page="table.currentPage"
                     :items="table.items"
                     :fields="table.fields">

            <template v-for="slotName in Object.keys($scopedSlots)" v-slot:[slotName]="slotScope">
              <slot :name="slotName" v-bind="slotScope"></slot>
            </template>

        </b-table>

        <b-pagination  v-if="table"
              v-model="table.currentPage"
              :total-rows="table.rows"
              :per-page="table.perPage"
              aria-controls="agent-session-list">        
        </b-pagination>
      

    </div>

</template>

<script>

    import PageTitle from "../Components/PageTitle.vue";
    import { MyFlags,MyDict,MyConst } from './../../services/global';

    export default {
        components: {
          PageTitle,
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
          actionShow : {
              type: Object,
              default: function () {
                  return { message: 'hello' }
              }
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
            session : null,
        }),
        mounted : function (argument) {
          //this.dateRangeOnUpdate();
          if(this.autoApply)
            this.getItems();
        },
        methods: {
          async getItems (){
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
            if(this.table && this.table.api){
              var resp = await this.$service.get(this.table.api,params);
              this.table.items = resp.results;
              this.table.rows = this.table.items.length;
              this.session = resp.meta;
              console.log("sessions",resp,this.table )
            }
          },
          async apply(){
            this.getItems();
          },
          onActionINT : function (argument) {
            console.log("onAction",argument)
            switch(argument.type){
              case "apply" :
                this.getItems();
                break;
              default: {
                this.$emit('action',argument);
              }
            }
          },
          getInput : function (type) {
            return this.$refs.pageTitle.getInput(type);
          }
        },
    }


</script>
<style lang="scss">

</style>
<style type="text/css" scoped >
 
</style>
