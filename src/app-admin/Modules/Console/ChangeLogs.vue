<template>
    <div>
        <master-view 
          :header="{
            heading : 'Change Logs',
            subheading : 'Change Activity Logs',
            icon : 'icon-gradient bg-happy-itmeo fa fa-exclamation-triangle',
          }"
          :table=table
          :filters="[{ label : 'Collection', name : 'collection', value : 'CONFIG_CHANNEL'},
          { label : 'Refresh', name : 'apply'}]" 
          class="text-sm"
          >
        <template #filter(collection)="{filter,apply}">
          <BaseVSelect type="danger" v-model="filter.value"  @change="apply"
            :options="['CONFIG_CHANNEL','CONFIG_CLIENT_KEY']"
          > {{filter.label}}</BaseVSelect>
        </template>
         <template #cell(createdStamp)="row">
           {{row.item.createdStamp|formatStamp}}
         </template>  
          <template #cell(actions)="row">
            <b-button size="xs" @click="row.openView"  class="fas fa-eye text-sm"
                variant="outline-primary">
            </b-button>&nbsp;
          </template>
      </master-view >

    </div>
</template>

<script>
import BaseSelect from '../../../@common/argon/components/Inputs/BaseSelect.vue'
    export default {
        components: {
                BaseSelect
        },
        data: () => ({
            actions : [],
            table : {
              fields: [ 
                { key : 'createdStamp', label : "Timestamp" },
                { key : 'docIdentifier', label : "Identifier" },
                { key : 'createdBy', label : "user" },
                { key : 'activity', label : "activity" },
                { key : 'actions', label : "Action" },
                ],
              items : [],
              perPage: 25, size : 'sm', sortBy: 'createdStamp', sortDir : 'desc',
              currentPage: 1, paging : 'lazy',
              rows : 0,
              api : "api/objects/change_logs"
            },
            collection : 'CONFIG_CHANNEL'
        }),
        computed : {
        },
        created : function (argument) {
          //this.loadItems();
        },
        methods : {
        }
    }
</script>
<style type="text/css">
</style>
