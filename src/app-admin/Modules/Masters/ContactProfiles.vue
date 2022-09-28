<template>
    <div>
      <MasterView ref="masterView"
        :header=header
        :table=table
        :newItem="newItem"
        :actions="[{name :'add'}]"
        sidebar
      >

      <template #action(add)="{createItem}">
            <b-button variant="success" @click="createItem">Add {{header.name}}</b-button>
      </template>

      <template #cell(name)="row">
            {{row.item.name.formattedName}}
      </template>

      <template #cell(phones)="row">
        <span v-if="row.item.phones && row.item.phones[0]">
          +{{row.item.phones[0].countryCallingCode}} {{row.item.phones[0].nationalNumber}}
        </span>
      </template>

      <template #cell(emails)="row">
        <span v-if="row.item.emails && row.item.emails[0]">
          {{row.item.emails[0].email}}
        </span>
      </template>

      <template #cell(actions)="row">
           <b-button size="xs" @click="row.editItem"  v-tooltip="row.item.message" variant="outline-primary" class="mg-1">
                <i class="fa fa-eye" title="View"/>
            </b-button>   
            <b-button size="xs" @click="row.removeItem"  v-tooltip="row.item.message" variant="outline-danger" class="mg-1">
                <i class="fa fa-trash" title="Delete"/>
            </b-button> 
      </template>
      
      <template #sidebar(edit)="{itemCopy}">
        <ValidationObserver ref="form" v-if="itemCopy">
              <div hidden class="text-xs">id:{{itemCopy.id}}</div>
              <base-quick-edit class="mx-0 px-0 styler-20-80" size="sm" label="Name" prelabel
                    v-model="itemCopy.name.formattedName" autocomplete="off" rules="required"
                    placeholder="Enter name" @commit="onChange('SET','name',itemCopy,itemCopy.name)">
              </base-quick-edit>
              <span v-if="itemCopy.id" class="sections">
                <base-quick-edit class="mx-0 px-0 styler-20-80" size="sm" name="Code" prelabel
                      v-model="itemCopy.code"  autocomplete="off" rules="required|alphanum"
                      placeholder="Enter Code" @commit="onChange('SET','code',itemCopy,itemCopy.code)">
                </base-quick-edit>
                <base-v-select class="mx-0 px-0 styler-20-80" size="sm" name="RM" prelabel
                      v-model="itemCopy.rmCode"  options="getx:/api/admins/agent" clearable optionKey="code"
                      placeholder="Enter Code" @change="onChange('SET','rmCode',itemCopy,itemCopy.rmCode)">
                </base-v-select>
                <div class="section-divider">
                    <span class="section-divider-title">Phones</span>
                </div>
                <span  v-for="(phone,index) in itemCopy.phones" v-bind:key="`phone-`+index">
                  <base-quick-edit v-if="phone" clearable
                        class="mx-0 px-0" size="sm" name="Phone" prependIcon="fa fa-phone"
                        v-model="phone.phone"  autocomplete="off" rules="required|phone" 
                        placeholder="Enter Phone" @commit="onChange('ADD','phone',itemCopy,phone,!!phone.phone)"
                        @remove="onChange('REMOVE','phone',itemCopy,phone,!!phone.phone)">
                  </base-quick-edit>
                </span>
                <base-quick-edit v-if="newPhone"
                      class="mx-0 px-0" size="sm" name="Phone" prependIcon="fa fa-phone"
                      v-model="newPhone.phone"  autocomplete="off" rules="required|phone"
                      placeholder="Enter Phone" @commit="onChange('ADD','phone',itemCopy,newPhone,!!newPhone.phone)"
                      @remove="onChange('REMOVE','phone',itemCopy,newPhone,!!newPhone.phone)">
                </base-quick-edit>
                <div class="text-center" v-if="!newPhone">
                    <span class="fa fa-plus-circle text-sm btn btn-link" @click="newPhone={}">Add Phone</span>
                </div>
                <div class="section-divider">
                    <span class="section-divider-title">Emails</span>
                </div>
                <span  v-for="(email,index) in itemCopy.emails" v-bind:key="`email-`+index">
                    <base-quick-edit v-if="email" clearable
                            class="mx-0 px-0" size="sm" name="Email" prependIcon="fas fa-envelope"
                            v-model="email.email"  autocomplete="off" rules="required|email"
                            placeholder="Enter Email" @commit="onChange('ADD','email',itemCopy,email,!!email.email)"
                            @remove="onChange('REMOVE','email',itemCopy,email,!!email.email)">
                    </base-quick-edit>
                </span>
                <base-quick-edit v-if="newEmail"
                      class="mx-0 px-0" size="sm" name="Email" prependIcon="fas fa-envelope"
                      v-model="newEmail.email"  autocomplete="off" rules="required|email"
                      placeholder="Enter Email" @commit="onChange('ADD','email',itemCopy,newEmail,!!newEmail.email)"
                      @remove="onChange('REMOVE','email',itemCopy,newEmail,!!newEmail.email)" >
                </base-quick-edit>
                <div class="text-center" v-if="!newEmail">
                    <span class="fa fa-plus-circle text-sm btn btn-link" @click="newEmail={}">Add Email</span>
                </div>
              </span>
        </ValidationObserver>
      </template>  

      </MasterView>

        
    </div>

</template>

<script>

    import MasterView from "@/app-admin/Layout/MasterView.vue";
    import { MyFlags,MyDict,MyConst } from '@/services/global';


    export default {
        components: {
            MasterView
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            header : {
                name : "Contact Profile",
                heading: 'Contact Profiles',
                subheading: 'Use filters to search',
                icon: 'pe-7s-chat icon-gradient bg-tempting-azure fas fa-address-card',
            },
            actions : [],
            input : {
                daterange : {
                    hidden : true,
                    startDate : null,
                    endDate : null,
                }
            },
            table : {
                fields: [ 
                    { key : 'name', label : "Name", sortable: true, 
                        filterOptions:{
                            enabled:true,
                        }
                    },
                    { key : 'code', label : "Code" , filterOptions:{enabled:true}},
                    { key : 'phones', label : "Phone" , filterOptions:{enabled:true}},
                    { key : 'emails', label : "Email" , filterOptions:{enabled:true}},
                    { key : 'actions', label : "Action" }
                ],
                items : [],
                perPage: 10,
                currentPage: 1,
                rows : 0,
                api :  "/api/cusomter/profile",
                size : "xs",
                paging : "lazy"
            },
            session : null,
            newItem : {
                  "name": {},
                  "code" : null,
                  "rmCode" : null,            
                  "phones": [],
                  "emails" : [],
            },
            newPhone : null,
            newEmail : null
        }),
        mounted : function (argument) {
          //this.dateRangeOnUpdate();
         // this.getItems();
        },
        filters : {
          formattedName(name){
            return name.formattedName || (`${name.firstName || ''} ${name.lastName || ''}` )
          }
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
          async onChange(command,field,item,newValue,valid){
              this.newPhone = null;
              this.newEmail = null;
              if(valid === false) return;
              console.log("onChange",command,field,item,newValue)
              if(item.id){
                 let {results } = await this.$service.patch( "/api/cusomter/profile",{
                  id : item.id,
                  patches : [{
                    command : command,
                    field : field,
                    value : newValue
                  }]
                });
                for(var key in results[0]){
                  item[key] = results[0][key];
                }
                this.table.items.some(function(_item){
                  if(_item.id == item.id){
                       for(var key in item){
                        _item[key] = item[key];
                      }
                      return true;
                  }
                });
              } else if(item.name.formattedName) {
                let {results } = await this.$service.post( "/api/cusomter/profile",item);
                for(var key in results[0]){
                  item[key] = results[0][key];
                }
                this.table.items.push(item);
              }
              this.$refs.masterView.editItem({item});
          }
        },

    }


</script>
<style lang="scss">

</style>
<style type="text/css" scoped >
 
</style>
