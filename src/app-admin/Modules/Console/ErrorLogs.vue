<template>
    <div>
        <master-view 
          :header="{
            heading : 'Logs',
            subheading : 'Error Logs',
            icon : 'icon-gradient bg-happy-itmeo fa fa-exclamation-triangle',
          }"
          :table=table
          :filters="[{ label : 'Refresh', name : 'apply'}]" 
          class="text-sm"
          >
         <template #cell(timestamp)="row">
           {{row.value|formatStamp}}
         </template>  
         <template #cell(session)="row">
           {{row.item.sessionId}} <br/>
          <i> {{row.item.contactId}}</i>
         
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
                { key : 'timestamp', label : "Timestamp" },
                { key : 'session', label : "Session" },
                { key : 'message', label : "Message" },
                { key : 'actions', label : "Action" },
                ],
              items : [],
              perPage: 25, size : 'sm', sortBy: 'timestamp', sortDir : 'desc',
              currentPage: 1, paging : 'lazy',
              rows : 0,
              api : "api/objects/logs"
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
