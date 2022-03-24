<template>
    <div class="">
        <master-view  ref="variablesList"
          :header="{
            heading : 'Variable Setup',
            subheading : 'Variables to be used in templates',
            icon : 'bg-happy-itmeo icon-gradient fa fa-code'
          }"
          :actions="[{ name :'ADD_ITEM',label : 'Add Variable'}]"
          :table="table"
          @action="onAction">

            <template #cell(actions)="row">
              <i class="fas fa-edit text-primary pointer mx-2" 
                @click="editItem(row.item, row.index, $event.target)"></i>
              <i class="fas fa-trash text-danger pointer mx-2" 
                @click="removeItem(row.item, row.index, $event.target)"></i>
            </template>
            <template #cell(value)="row">
                <span v-if="row.item.type=='SWITCH'">
                      [{{row.item.value|display(onOffOptions)}}]
                </span>
                <span v-else>
                  {{row.item.value}}
                </span>  
            </template>
                                            

        </master-view >
          
        <b-modal v-if="oneItem" :id="modelName" :title="'Variable Details'" size="md"
        @hidden="cancelItem">

                <base-input class="" size="sm"
                      name="Variable Description" placeholder="Company Name"
                      rules="required" required
                      v-model="oneItem.description">
                </base-input>

                <base-input class="" size="sm"
                      name="Variable Key" placeholder="company_name"
                      rules="required" required
                      v-model="oneItem.key">
                </base-input>

                <base-v-select class="" size="sm" :disabled="!!oneItem.id && !!oneItem.type"
                      :clearable="false"
                      name="Variable Type" placeholder="TEXT"
                      :options="['TEXT','NUMBER','SWITCH']"
                      v-model="oneItem.type">
                </base-v-select>

                <ButtonRadioGroup class="" size="sm" v-if="oneItem.type == 'SWITCH'"
                      name="Variable Value" placeholder="ABC Pvt Ltd"
                      rules="required" required  :options="onOffOptions"
                      v-model="oneItem.value">
                </ButtonRadioGroup>
                <base-input class="" size="sm" v-else-if="oneItem.type == 'NUMBER'"
                      name="Variable Value" placeholder="786"
                      rules="required|numeric" required
                      v-model="oneItem.value">
                </base-input>
                 <base-input class="" size="sm" v-else
                      name="Variable Value" placeholder="ABC Pvt Ltd"
                      rules="required" required
                      v-model="oneItem.value">
                </base-input>
 
                  <template #modal-footer>
                      <div class="position-relative form-group">
                        <button @click="saveItem"
                          name="password" id="examplePassword" :disabled="!(isChanged)"
                          class="form-control btn btn-primary">Save</button>
                        </div>
                  </template>

        </b-modal>


    </div>
</template>

<script>

    function newItem() {
      return  {
          key : null,
          value : null,
          id : null,
          description : null,
          type : null,
          grouping : null
      };
    }
    export default {
        components: {
        },
        data: () => ({
            actions : [],
            table : {
              fields: [ 
                { key : 'group', label : "Group" },
                { key : 'key', label : "Key" },
                { key : 'description', label : "Desc" },
                //{ key : 'config.value', label : "Value" },
                { key : 'value', label : "Value" },
                { key : 'actions', label : "Action" }],
              items : [],
              perPage: 25, small :  true,
              currentPage: 1,
              rows : 0, 
              api : "api/config/companyvar"
            },
            oneItem : newItem(),
            modelName :  "MODAL_ADD_ITEM",
            onOffOptions : [
                {value : true, label : 'ON' },
                {value : false, label : 'OFF'}
            ]
        }),
        computed : {
            isChanged :  function (argument) {
              return this.oldHash !== JSON.stringify(this.oneItem);
            }
        },
        created : function (argument) {
          //this.loadItems();
        },
        methods : {
          async loadItems (){
            await this.$refs.variablesList.apply();
          },
          async removeItem(item) {
             await this.$service.delete(this.table.api, item);
             this.loadItems();
          },
          async editItem(item) {
              this.oneItem = newItem();
              for(var i in item){
                this.oneItem[i] = JSON.parse(JSON.stringify(item[i]));
              }
              this.onAction({name : "EDIT_ITEM"});
          },
          async saveItem () {
              await this.$service.post(this.table.api, this.oneItem);
              this.oneItem = newItem();
              this.onAction({name : "CANCEL"});
              this.loadItems();
          },
          async cancelItem(item) {
             this.oneItem = newItem();
             this.onAction({name : "CANCEL"});
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