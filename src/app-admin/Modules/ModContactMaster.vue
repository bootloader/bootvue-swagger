<template>
    <div>
      <MasterView
        :header=header
        :actions=actions
        :table=table
        goodTable
      >

      <template #cell(name)="row">
          <i  class="fab" v-bind:class="MyDict.socialPrefix(row.item.contactType)"> </i>
            {{row.item.name || row.item.csid}}
      </template>

      <template #cell(createdStamp)="row">
            {{row.item.createdStamp | formatDate}}
      </template>

      <template #cell(lastInBoundStamp)="row">
            {{row.item.lastInBoundStamp | formatDate}}
      </template>


      <template #cell(lastOutBoundStamp)="row">
            {{row.item.lastOutBoundStamp | formatDate}}
      </template>
      
      </MasterView>
        
    </div>

</template>

<script>

    import MasterView from "../Layout/MasterView.vue";
    import { MyFlags,MyDict,MyConst } from './../../services/global';

    export default {
        components: {
            MasterView
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            header : {
                heading: 'Contacts',
                subheading: 'Use filters to search',
                icon: 'pe-7s-chat icon-gradient bg-tempting-azure fa fa-address-book',
            },
            actions : [
            {
              label : "Search", name : "LANE_SELECT",
              type : "search", selectFirst : true, placeholder:"Search by phone number"
            },{
              label : "Select Account", name : "LANE_SELECT",
              type : "lane", selectFirst : true
            },{
              label : "Search",
              type : "apply", selectFirst : true
            }],
            input : {
                daterange : {
                    hidden : true,
                    startDate : null,
                    endDate : null,
                }
            },
            table : {
                fields: [ 
                    { key : 'name', label : "Contact", sortable: true, 
                        filterOptions:{
                            enabled:true,
                            
                        }
                    },
                    { key : 'phone', label : "Phone" , filterOptions:{enabled:true}},
                    { key : 'email', label : "Email" , filterOptions:{enabled:true}},
                    { key : 'createdStamp', label : "Joined" },
                    { key : 'lastInBoundStamp', label : "LastIn" },
                    { key : 'lastOutBoundStamp', label : "LastOut" },
                    //{ key : 'status', label : "Status" },
                    //{ key : 'lastInComingStamp', label : "lastInComingStamp" },
                    //{ key : 'lastResponseStamp', label : "lastResponseStamp" },
                    //{ key : 'closeSessionStamp', label : "Closed@" },
                   // { key : 'actions', label : "Action" }
                ],
                items : [],
                perPage: 25,
                currentPage: 1,
                rows : 0,
                api :  "/api/admins/contacts"
            },
            session : null,
        }),
        mounted : function (argument) {
          //this.dateRangeOnUpdate();
         // this.getItems();
        },
        methods: {
          async getItems (){
            var resp = await this.$service.submit("/api/message/bulk/push/messages",{
                "contactType": "WHATSAPP",
                "bulkSessionId" : this.$route.params.bulkSessionId
            });
            this.table.items = resp.results;
            this.table.rows = this.table.items.length;
            this.session = resp.meta;
            console.log("sessions",resp,this.table )
          },
          async deleteItem (r,index) {
              var resp = await this.$store.dispatch('PostRequest',{
                url : "/api/message/session/import/trash",
                params : r
              });
              this.sessions.items = resp.results;
              this.sessions.rows = this.sessions.items.length;
          },

          hideChat : function (argument) {
            this.session = null;
          },
          showChat : function (r) {
            if(this.session && this.session.sessionId == r.sessionId){
              this.session = null;
            } else {
              this.session = r;
            }
          },

        },

    }


</script>
<style lang="scss">

</style>
<style type="text/css" scoped >
 
</style>
