<template>
    <div>
      <MasterView ref="masterView"
        :header=header
        :actions=actions
        :table=table
        goodTable size="sm"
        sidebar :itemIdGetter="itemIdGetter"
      >

      <template #cell(name)="row">
          <i  class="fab" v-bind:class="MyDict.socialPrefix(row.item.contactType)"> </i>
            {{row.item.name || row.item.csid}}
      </template>

      <template #cell(actions)="row">
            <span class="mg-1" @click="row.editItem"  v-if="$config.PERMS.CONTACT_CENTER">
              <i  v-if="!row.item.profile" class="fa fa-user-plus pointer" ></i>
              <i v-else class="fa fa-user-check pointer text-success" ></i>
            </span>
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
      
      <template #sidebar(edit)="{itemCopy}">
            <my-source 
                v-if="itemCopy.profile" 
                :options="`get:/api/cusomter/profile?id=${itemCopy.profile.id}`">
                <template #data="{options}">
                  <ul class="list-unstyled">
                      <b-media tag="li" v-for="option in options" v-bind:key="option.id" class="border-greyed border-1px p-1">
                      <template #aside>
                        <img :src="`https://ui-avatars.com/api/?name=${option.item.name.formattedName}&background=F0F0F0&color=333f54`" blank blank-color="#abc" width="64" alt="placeholder" />
                      </template>
                        <b-media-body class="p-1">
                              <h5 class="mt-0 mb-1">{{option.item.name.formattedName}}</h5>
                              <p class="mb-1">
                                <span v-if="option.item.code" class="fa fa-hashtag mg-1 border-1px border-grey p-1"> {{option.item.code}}</span> 
                                <span v-for="phone in option.item.phones" v-bind:key="phone.phone" 
                                  class="fa fa-phone mg-1 border-1px border-grey p-1"
                                > {{phone.phone}}</span>  
                                <span v-for="email in option.item.emails" v-bind:key="email.email" 
                                  class="fa fa-envelope mg-1 border-1px border-grey p-1"
                                > {{email.email}}</span>    
                              </p>
                               <button class="btn btn-xs btn-outline-success mg-1 float-right" 
                                  @click="delinkProfile(itemCopy,option.item)">Un-Link</button> 
                        </b-media-body>  
                    </b-media>
                  </ul>
                </template>
            </my-source> 

            <my-source v-if="!itemCopy.profile" :options="`get:/api/cusomter/profile?contactId=${itemCopy.contactId}`">
                <template #data="{options}">
                  <ul class="list-unstyled">
                      <b-media tag="li" v-for="option in options" v-bind:key="option.id" class="border-greyed border-1px p-1">
                      <template #aside>
                        <img :src="`https://ui-avatars.com/api/?name=${option.item.name.formattedName}&background=F0F0F0&color=333f54`" blank blank-color="#abc" width="64" alt="placeholder" />
                      </template>
                        <b-media-body class="p-1">
                              <h5 class="mt-0 mb-1">{{option.item.name.formattedName}}</h5>
                              <p class="mb-1">
                                <span v-if="option.item.code" class="fa fa-hashtag mg-1 border-1px border-grey p-1"> {{option.item.code}}</span> 
                                <span v-for="phone in option.item.phones" v-bind:key="phone.phone" 
                                  class="fa fa-phone mg-1 border-1px border-grey p-1"
                                > {{phone.phone}}</span>  
                                <span v-for="email in option.item.emails" v-bind:key="email.email" 
                                  class="fa fa-envelope mg-1 border-1px border-grey p-1"
                                > {{email.email}}</span>    
                              </p>
                               <button class="btn btn-xs btn-outline-success mg-1 float-right" 
                                  @click="linkProfile(itemCopy,option.item)">Link</button> 
                        </b-media-body>  
                    </b-media>
                  </ul>
                </template>
            </my-source> 

   
      </template>

      </MasterView>
        
    </div>

</template>

<script>

    import { MyFlags,MyDict,MyConst } from '@/services/global';

    export default {
        components: {
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            header : {
                heading: 'Contacts', name : "Contact",
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
                    { key : 'actions', label : "Action" },
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
          itemIdGetter(selectedItem){
            return selectedItem?.itemCopy?.contactId
          },
          async linkProfile(item, profile){
            let {results } = await this.$service.submit( "/api/cusomter/profile/link",{
              profileId : profile.id, contactId : item.contactId
            });
            this.updateContact(item,results[0],"LINK");
          },
          async delinkProfile(item, profile){
            let {results } = await this.$service.delete( "/api/cusomter/profile/link",{
              profileId : profile.id, contactId : item.contactId
            });
            this.updateContact(item,results[0],"DLINK");
          }, 
          updateContact(item, newItem,link){
              for(var key in newItem){
                  item[key] = newItem[key];
              }
              item.profile = newItem.profile;
              this.table.items.some(function(_item){
                  if(_item.contactId == item.contactId){
                       for(var key in item){
                        _item[key] = item[key];
                      }
                      return true;
                  }
              });
             this.$refs.masterView.editItem({item});
             console.log(link,":item.profile",item?.profile?.id,item)
          }
        },

    }


</script>
<style lang="scss">

</style>
<style type="text/css" scoped >
 
</style>
