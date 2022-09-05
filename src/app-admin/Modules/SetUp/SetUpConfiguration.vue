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
          :busy="table.busy">

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
        
          <template #cell(title)="row">
            <span class="text-md">{{row.item.title}} &nbsp;
              <i v-if="row.item.desc" v-tooltip="row.item.desc" class="fa fa-info-circle pointer"/></span>
          </template>

          <template #cell(value)="row">
            <setup-configuration-key class="text" v-bind:key="'read'+row.item.key"
                  :configurations="row.item.items" readable
                  @saved="loadItems">
            </setup-configuration-key>
          </template>
          <template #cell(actions)="row">
            <setup-configuration-key class="text-primary" v-bind:key="'edit'+row.item.key"
                  :configurations="row.item.items" editable
                  @saved="loadItems">
            </setup-configuration-key>
          </template>

      </master-view>

    </div>
</template>

<script>
    import SetupConfigurationKey from './SetupConfigurationKey.vue';
    export default {
        components: {
            SetupConfigurationKey
        },
        data: () => ({
            heading: 'Configuration Setup',
            subheading: 'Control Agent Panel setting',
            icon: 'pe-7s-users icon-gradient bg-happy-itmeo fa fa-tools',
            actions : [],
            table : {
              fields: [ 
                { key : 'title', label : "Property" },
                { key : 'value', label : "Value" },
               //{ key : 'meta.key', label : "key" },
                //{ key : 'config.value', label : "Value" },
                //{ key : 'config.description', label : "Desc",sortable: false },
                { key : 'actions', label : "Action" ,sortable: false}],
              items : [],
              perPage: 100,
              currentPage: 1,
              rows : 0,
              groupBy : 'group',
              busy : false,
              paginationOptions:{
                 enabled: false,
              }
            },
        }),
        computed : {
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
              let mapped = {};
              this.table.items = resp.results.map(function(item){
                if(item.config.value  === null || item.config.value  === undefined){
                    item.config.value  = item.meta.defaultValue;
                }
                return item;
              }).reduce(function(list,item){
                let superKey = item?.meta?.superKey;
                if(!superKey){
                  list.push({
                    title : item?.meta?.title,
                      desc : item?.meta?.desc,
                    key : item?.meta?.key,
                    group : item?.meta?.group,
                    items : [item],
                  });
                } else if(mapped[superKey]){
                  mapped[superKey].items.push(item);
                  console.log(superKey,item.meta.key);
                  if(superKey == item.meta.key){
                     mapped[superKey].title = item?.meta?.title;
                  }
                } else {
                  mapped[superKey] = {
                    title : item?.meta?.title,
                    desc : item?.meta?.desc,
                    key : superKey,
                    group : item?.meta?.group,
                    items : [item],
                  }
                  list.push( mapped[superKey]);
                }
                return list;
              },[]);
            } finally {
              this.table.busy=false
            }
          }
        }
    }
</script>
<style type="text/css">

</style>
