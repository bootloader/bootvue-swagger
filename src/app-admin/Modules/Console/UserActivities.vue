<template>
    <div>
        <master-view 
          :header="{
            heading : 'User Activities',
            subheading : 'Agent Activity Logs',
            icon : 'icon-gradient bg-happy-itmeo fa fa-exclamation-triangle',
          }"
          :table=table
          :filters="[{ label : 'Refresh', name : 'apply'}]" 
          class="text-sm"
          >
         <template #cell(createdAt.stamp)="row">
           {{row.item.createdAt.stamp|formatStamp}}
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
    export default {
        components: {
        },
        data: () => ({
            actions : [],
            table : {
              fields: [ 
                { key : 'createdAt.stamp', label : "Timestamp" },
                { key : 'user', label : "user" },
                { key : 'activity', label : "activity" },
                { key : 'actions', label : "Action" },
                ],
              items : [],
              perPage: 25, size : 'sm', sortBy: 'createdAt.stamp', sortDir : 'desc',
              currentPage: 1, paging : 'lazy',
              rows : 0,
              api : "api/objects/user_activities"
            }
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
