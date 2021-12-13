<template>
    <div>

      <master-view 
          :header="{
            heading : heading,
            subheading : subheading,
            icon : icon,
          }"
          :table=table
          :actions=actions
          @action="onAction"      
       >
          <template #cell(actions)="row">
            <b-button size="sm" @click="deleteItem(row.item, row.index, $event.target)"   
                v-tooltip="row.item.message" variant="outline-primary">
                <i class="fas fa-trash"></i>
            </b-button>
          </template>
      </master-view>
          
        <div class="row">
            <div class="col-md-12">
                <div class="main-card mb-3 card">

                </div>
            </div>

        </div>


        <b-modal v-if="oneItem" :id="modelName" :title="'Add Key '" size="md"
        @hidden="cancelItem">
                <div class="form-row">
                      <input name="agent_name" id="examplePassword"
                       placeholder="My API Key 1" type="text"
                        class="form-control" v-model="oneItem.keyName">
                </div>
                <br/>
                  <template #modal-footer>
                      <div class="position-relative form-group">
                        <button @click="saveItem"
                          name="save" id="examplePassword" :disabled="!(isChanged)"
                          class="form-control btn btn-primary">Save</button>
                        </div>
                  </template>
        </b-modal>
        <b-modal v-if="lastItem" :id="modelName+'_VIEW'" :title="`Key : ${lastItem.keyName}`" size="md">

            <b-input-group class="mt-3">
              <b-input-group-prepend>
                  <b-button variant="outline-dark"  class="text-sm w-120px">
                    Key Name</b-button>
              </b-input-group-prepend>
              <b-form-input readonly
                :value="lastItem.keyName"
              ></b-form-input>
            </b-input-group>

            <b-input-group class="mt-3">
              <b-input-group-prepend>
                  <b-button variant="outline-dark"  class="text-sm w-120px">
                    API Id</b-button>
              </b-input-group-prepend>
              <b-form-input readonly
                :value="lastItem.id"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  v-clipboard:copy="lastItem.id" 
                  variant="outline-success">Copy</b-button>
              </b-input-group-append>
            </b-input-group>

            <b-input-group class="mt-3">
              <b-input-group-prepend>
                  <b-button variant="outline-dark"  class="text-sm w-120px">
                    API Key</b-button>
              </b-input-group-prepend>
              <b-form-input readonly
                :value="lastItem.key"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  v-clipboard:copy="lastItem.key" 
                  variant="outline-success">Copy</b-button>
              </b-input-group-append>
            </b-input-group>

        </b-modal>

    </div>
</template>

<script>

    import MasterView from "../../Layout/MasterView.vue";
    import { MyFlags,MyDict,MyConst } from '../../../services/global';

    import VSwatches from 'vue-swatches'

    // Import the styles too, typically in App.vue or main.js
    import 'vue-swatches/dist/vue-swatches.css'

    function newItem() {
      return {
              "keyName" : null
      };
    }
    export default {
        components: {
            MasterView,VSwatches
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'API Keys',
            subheading: 'Create Keys to use APIs',
            icon: 'pe-7s-key icon-gradient bg-happy-itmeo fa fa-key',
            actions : [{
              label : "Add Keys", icon : "fa fa-plus", name : "ADD_ITEM", action : "ADD_ITEM"
            }],
            table : {
              fields: [ 
                { key : 'keyName', label : "Name" },
                { key : 'id', label : "Id" },
                { key : 'actions', label : "Actions" },
              ],
              items : [],
              perPage: 25,
              currentPage: 1,
              rows : 0
            },
            oneItem : newItem(),
            lastItem : {},
            modelName :  "MODAL_ADD_ITEM",
        }),
        computed : {
            items : function (argument) {
              return this.$store.getters.StateAgents
            },
            teams : function (argument) {
              return this.$store.getters.StateTeams;
            },
            isChanged :  function (argument) {
              return this.oldHash !== JSON.stringify(this.oneItem);
            }
        },
        created : function (argument) {
          this.loadItems();
        },
        methods : {
          async loadItems (){
            let resp = await this.$service.get('api/config/clientapikey');
            this.table.items = resp.results;
          },
          async saveItem () {
              var resp = await this.$service.post('api/config/clientapikey', {
                keyName : this.oneItem.keyName
              });
              this.lastItem = resp.data;
              this.oneItem = newItem();
              this.onAction({name : "CANCEL"});
              this.loadItems();
               this.$bvModal.show(this.modelName + "_VIEW");
          },
          async cancelItem(item) {
             this.oneItem = newItem();
             this.onAction({name : "CANCEL"});
          }, 
          async deleteItem(item) {
            await this.$service.delete('api/config/clientapikey/',item);
            this.loadItems();
          },
          async editItem(item) {
              this.oneItem = newItem();
              for(var i in item){
                this.oneItem[i] = JSON.parse(JSON.stringify(item[i]));
              }
              this.onAction({name : "EDIT_ITEM"});
             //await this.$store.dispatch('DeleteQuickReps', item);
          },
          onAction : function (argument) {
            switch(argument.name){
              case "ADD_ITEM" :
                this.oldHash = JSON.stringify(this.oneItem);
                this.$bvModal.show(this.modelName);
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
<style type="text/css">
  .swatches-fallback-input-class {
    text-align: center;
    width: 450px;
  }
</style>
