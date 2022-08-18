<template>
    <div class="">
        <master-view 
          :header="{
            heading : heading,
            subheading : subheading,
            icon : icon,
          }"
          goodTable
          :table=table
          :actions=actions
          :filters="[{ label : 'Refresh', name : 'sync'}]"
          :busy="table.busy"
          @action="onAction">

          <template #filter(sync)>
              <span class="btn btn-success" @click="loadItems">
                <i class="fa fa-sync"/>
              </span>
          </template>

           <template #groupBy="group">
              <span class="text-successs badge btn btn-xs btn-dark">
                {{ group.item.label }}
              </span>
          </template>

          <template #cell(value)="row">
            <setup-configuration-key class="text" v-bind:key="'read'+row.item.meta.key"
                  :configuration="row.item" readable
                  @saved="loadItems">
            </setup-configuration-key>
          </template>
          <template #cell(actions)="row">
            <setup-configuration-key class="text-primary" v-bind:key="'edit'+row.item.meta.key"
                  :configuration="row.item" editable
                  @saved="loadItems">
            </setup-configuration-key>
          </template>

      </master-view>

    </div>
</template>

<script>

    import PageTitle from "../../Components/PageTitle.vue";
    import { MyFlags,MyDict,MyConst } from '../../../services/global';
    import SetupConfigurationKey from './SetupConfigurationKey.vue';

    function newItem() {
      return {
              "config" : {},
              "meta": {}
            };
    }
    export default {
        components: {
            PageTitle,SetupConfigurationKey
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'Configuration Setup',
            subheading: 'Control Agent Panel setting',
            icon: 'pe-7s-users icon-gradient bg-happy-itmeo fa fa-tools',
            actions : [],
            table : {
              fields: [ 
                { key : 'meta.title', label : "Property" },
                { key : 'value', label : "Value" },
               //{ key : 'meta.key', label : "key" },
                //{ key : 'config.value', label : "Value" },
                { key : 'config.description', label : "Desc" },
                { key : 'actions', label : "Action" }],
              items : [],
              perPage: 100,
              currentPage: 1,
              rows : 0,
              groupBy : 'meta.group',
              busy : false
            },
            oneItem : newItem(),
            modelName :  "MODAL_ADD_USERS",
        }),
        computed : {
            items : function (argument) {
              return this.$store.getters.StateAgents
            },
            teams : function (argument) {
              return this.$store.getters.StateTeams;
            },
            isChanged :  function (argument) {
              return this.oldHash !== JSON.stringify(this.oneItem);
            }
        },
        created : function (argument) {
          this.loadItems();
        },
        methods : {
          async loadItems (){
            try {
              this.table.busy = true;
              this.table.items = [];
              let resp = await this.$store.dispatch('GetConfigs');
              this.table.items = resp.results.map(function(item){
                if(item.config.value  === null || item.config.value  === undefined){
                    item.config.value  = item.meta.defaultValue;
                }
                return item;
              });
            } finally {
              this.table.busy=false
            }
          },
          async saveItem () {
              await this.$store.dispatch('SetConfigs', {
                key : this.oneItem.meta.key,value : this.oneItem.config.value,
              });
              this.oneItem = newItem();
              this.onAction({name : "CANCEL"});
              this.loadItems();
          },
          async cancelItem(item) {
             this.oneItem = newItem();
             this.onAction({name : "CANCEL"});
          }, 
          async editItem(item) {
              this.oneItem = newItem();
              for(var i in item){
                this.oneItem[i] = JSON.parse(JSON.stringify(item[i]));
              }
              this.onAction({name : "EDIT_ITEM"});
             //await this.$store.dispatch('DeleteQuickReps', item);
          },
          onAction : function (argument) {
            switch(argument.name){
              case "ADD_ITEM" :
                this.oldHash = JSON.stringify(this.oneItem);
                this.$bvModal.show(this.modelName)
                console.log("ADD_ITEM",argument);
                break;
              case "EDIT_ITEM" :
                this.oldHash = JSON.stringify(this.oneItem);
                this.$bvModal.show(this.modelName)
                console.log("ADD_ITEM",argument);
                break;
              case "CANCEL" :
                this.$bvModal.hide(this.modelName)
                break;
              default:
                console.log("NoMapping",argument) 
            }
          },



        }


    }
</script>
<style type="text/css">

</style>
