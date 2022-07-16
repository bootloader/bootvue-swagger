<template>
    <div class="">
        <master-view  ref="variablesList"
          :header="{
            heading : 'Token & Keys Setup',
            subheading : 'Token and Keys to be used for external integrations',
            icon : 'bg-happy-itmeo icon-gradient fa fa-code'
          }"
          :actions="[{ name :'ADD_ITEM',label : 'Add Variable'}]"
          :table="table"
          @action="onAction">

            <template #cell(actions)="row">
                <b-button-group size="sm">
                  <b-button size="sm" variant="outline-primary" 
                      @click="editItem(row.item, row.index, $event.target)" >
                      <i class="fas fa-edit pointer"></i>
                  </b-button> 
                  <b-button size="sm" variant="outline-primary" 
                    @click="removeItem(row.item, row.index, $event.target)" >
                    <i class="fas fa-trash text-danger pointer"></i>
                  </b-button>
                  <b-button size="sm" variant="outline-primary"
                      @click="disableItem(row.item, row.index, $event.target)"  
                      v-tooltip="row.item.disabled ? 'Connect' : 'Disconnect'"
                      :disabled="row.item.readOnly">
                      <i class="fas fa-plug" :class="{
                          'fa-x' : !row.item.disabled
                        }"></i>
                  </b-button>
                </b-button-group>  

            </template>
            <template #cell(value)="row">
                <span v-if="row.item.type=='SWITCH'">
                      [{{row.item.value|display(onOffOptions)}}]
                </span>
                <span v-if="row.item.type=='JSON'">
                      &lt;Object&gt;
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
                      :clearable="false" ref="integration_type"
                      name="Variable Type" placeholder="text"
                      options="@data/config/integration/types"
                      v-model="oneItem.type">
                </base-v-select>

                <my-model-form v-if="oneItem.type" size="sm" class="mt-3 d-block" disabled
                  :configs="`@data/config/integration/type_${oneItem.type.toLowerCase()}`"
                  :model="oneItem">
                </my-model-form>
 
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
    import MyModelForm from '../../../@common/custom/components/MyModelForm.vue';

  import VJsoneditor from 'v-jsoneditor'
    function newItem() {
      return  {
          key : null,
          value : {}, secret : {},
          id : null,
          description : null,
          type : 'text',
          grouping : null
      };
    }
    export default {
        components: {
          VJsoneditor,MyModelForm
        },
        data: () => ({
            actions : [],
            table : {
              fields: [ 
                { key : 'group', label : "Group" },
                { key : 'key', label : "Key" },
                { key : 'description', label : "Desc" },
                //{ key : 'config.value', label : "Value" },
                { key : 'actions', label : "Action" }],
              items : [],
              perPage: 25, small :  true,
              currentPage: 1,
              rows : 0, 
              api : "api/config/tokenkey"
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
              this.oneItem.secret = this.oneItem.secret || {};
              this.onAction({name : "EDIT_ITEM"});
          },
          async saveItem () {
              await this.$service.post(this.table.api, this.oneItem);
              this.oneItem = newItem();
              this.onAction({name : "CANCEL"});
              this.loadItems();
          },
          async disableItem(item) {
            item.disabled = !item.disabled;
            await this.$service.post(this.table.api, item);
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
          onJsonError(e){
            console.log("onJsonError",e)
          }

        }


    }
</script>