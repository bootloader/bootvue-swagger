<template>
    <div>
      <master-view id="quick-actions-list"  ref="masterView"
        :header="header"
        :table="table"
        :filters="[
            { label : 'Add '+header.name, icon : 'plus', name : 'ADD_ITEM'}
        ]"
        :newItem="newItem"
        :busy="table.busy" >

        <template #filter(ADD_ITEM)="{filter,createItem}">
            <b-button size="sm" @click="createItem" variant="primary">
             <i class="fa fa-plus" title="Add"/>  {{filter.label}} 
            </b-button>
        </template>

        <template #cell(actions)="row">
            <b-button size="sm" @click="row.removeItem" variant="outline-primary">
              <i class="fa fa-trash" title="Delete"/>
            </b-button>
            &nbsp;
            <b-button size="sm" @click="row.editItem"   v-tooltip="row.item.message" variant="outline-primary">
                <i class="fa fa-eye" title="View"/>
            </b-button>                                
        </template>


        <template #modal(edit)="{itemCopy}">
            <ValidationObserver ref="form" v-if="itemCopy">
                <base-input class="mx-0 px-0"
                      v-model="itemCopy.category" label="Category" autocomplete="off" rules="required"
                      placeholder="eg : country, customerType">
                </base-input>

                <base-input class="mx-0 px-0"
                      v-model="itemCopy.title" label="Title" autocomplete="off" rules="required"
                      placeholder="eg: Platiinum, Verified, India">
                </base-input>

                <base-input class="mx-0 px-0" format-filter="item_code" :format-value="itemCopy.title" format-live
                      v-model="itemCopy.code" label="Code" autocomplete="off" rules="required"
                      placeholder="eg:- PLATINUM, VERFD, IND">
                </base-input>
            </ValidationObserver>
        </template>  

    </master-view>

    </div>
</template>

<script>

    export default {
        components: {
        },
        data: () => ({
            header : {
              name : "Quick Action",
              heading: 'Quick Actions',
              subheading: 'are used by agents to trigger functionalty in core business app ',
              icon: 'pe-7s-browser icon-gradient bg-tempting-azure fa fa-location-arrow',
            },
            table :{
              fields: [ 
                { key : 'category', label : "Category" , sortable: true}, { key : 'title', label : "Title" , sortable: true}, 
                { key : 'code', label : "Action Code" , sortable: true},
                { key: 'actions', label: 'Options' }
              ],
              busy : false,
              sortBy: 'name',
              api : "api/tmpl/quickaxn"
            },
            newItem : {
                  "category":"",
                  "title": "",
                  "code" : ""            
            },
        }),
        computed : {
        },
        created : function (argument) {
          //this.loadItems();
        },
        methods : {
          async loadItems (){
              await this.$refs.masterView.apply();
          }
        }

    }
</script>