<template>
    <div>
        <master-view 
          :header="{
            heading : 'Channels',
            subheading : 'Plug-In Social Connectors',
            icon : 'icon-gradient bg-happy-itmeo fa fa-plug',
          }"
          :table=table
          :actions=actions
          @action="onAction"      
       >
          <template #cell(details)="row">
            <i :class="[$global.MyDict.socialPrefix(row.item.contactType,'fa')]"></i>
            &nbsp;{{row.item.lane}}
          </template>
       >
          <template #cell(disabled)="row">
            {{row.item.disabled|display('true:Yes;false:No')}}
          </template>

          <template #cell(actions)="row">
            <b-button size="sm" @click="editItem(row.item, row.index, $event.target)"  
                v-tooltip="row.item.message" variant="outline-primary">
                <i class="fas fa-edit"></i>
            </b-button>&nbsp;
            <b-button size="sm" @click="viewItem(row.item, row.index, $event.target)"  
                v-tooltip="row.item.message" variant="outline-primary">
                <i class="fas fa-eye"></i>
            </b-button>&nbsp;
            <b-button size="sm" @click="deleteItem(row.item, row.index, $event.target)"  
                v-tooltip="row.item.disabled ? 'Connect' : 'Disconnect'"
                 variant="outline-primary" class="fa-stack fa-1x">
                <i class="fas fa-plug fa-stack-1x"></i>
                <i v-if="row.item.disabled" class="fas fa-slash fa-stack-1x" style="color:Tomato"></i>
            </b-button>
          </template>

      </master-view >


        <b-modal v-if="oneItem" :id="modelName+'_VIEW'" :title="'View Details '" size="md"
            @hidden="cancelItem">

                <b-input-group class="mt-3">
                  <b-input-group-prepend>
                      <b-button variant="outline-dark"  class="text-sm w-120px">
                        Channel Id</b-button>
                  </b-input-group-prepend>
                  <b-form-input readonly
                    :value="oneItemView.channelId"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      v-clipboard:copy="oneItemView.channelId" 
                      variant="outline-success">Copy</b-button>
                  </b-input-group-append>
                </b-input-group>

                <b-input-group class="mt-3">
                 <b-input-group-prepend>
                      <b-button variant="outline-dark" class="text-sm w-120px">
                         Webhook URL</b-button>
                  </b-input-group-prepend>
                  <b-form-input readonly
                    :value="oneItemView.webhookUrl + oneItemView.callbackPath"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button class="w-20"
                      v-clipboard:copy="oneItemView.webhookUrl + oneItemView.callbackPath" 
                      variant="outline-success">Copy</b-button>
                  </b-input-group-append>
                </b-input-group>
                <template #modal-footer="{ok}">
                      <div class="position-relative form-group">
                        <button @click="ok()"
                          class="form-control btn btn-primary">OK</button>
                        </div>
                </template>
        </b-modal>

        <b-modal v-if="oneItem" :id="modelName" :title="'Add/Edit Details '" size="md"
            @hidden="cancelItem">
                <x-simple-form
                :inputs="modalInputs"
                @change="onConfigChange">
                </x-simple-form>
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

    import MasterView from "../Layout/MasterView.vue";
    import XSimpleForm from "@/@common/custom/components/XSimpleForm.vue";
    import { MyFlags,MyDict,MyConst } from '../../services/global';
    import {JSONPath} from 'jsonpath-plus'

    import VSwatches from 'vue-swatches'

    // Import the styles too, typically in App.vue or main.js
    import 'vue-swatches/dist/vue-swatches.css'

    function newItem() {
      return {
          "config" : {},
          "meta": {}
        };
    }
    export default {
        components: {
            MasterView,VSwatches,XSimpleForm
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            actions : [],
            table : {
              fields: [ 
                { key : 'details', label : "Channel" },
                { key : 'name', label : "Desc" },
                { key : 'disabled', label : "Disabled" },
                { key : 'actions', label : "Action" }],
              items : [],
              perPage: 25,
              currentPage: 1,
              rows : 0,
              api : "api/options/channels"
            },
            oneItem : newItem(),
            oneItemView : newItem(),
            modelName :  "MODAL_CHANNELS",
            modalInputs : [],
            oldHash : null
        }),
        computed : {
            items : function () {
              return this.$store.getters.StateAgents
            },
            teams : function () {
              return this.$store.getters.StateTeams;
            },
            isChanged :  function () {
              return true; //this.oldHash !== JSON.stringify(this.oneItem);
            }
        },
        created : function (argument) {
          //this.loadItems();
        },
        methods : {
          async loadItems (){
            let resp = await this.$service.get('api/options/channels');
            this.table.items = resp.results;
          },
          async saveItem () {
              let resp = await this.$service.post('api/config/channel/'+this.oneItem.channelType, this.oneItem );
              await this.onAction({name : "CANCEL"});
              this.viewItem(resp.results[0]);
              this.loadItems();
          },
          async cancelItem(item) {
             this.oneItem = newItem();
             console.log("Cannnnnn")
             this.onAction({name : "CANCEL"});
          }, 
          async editItem(item) {
              this.oneItem = newItem();
              for(var i in item){
                this.oneItem[i] = JSON.parse(JSON.stringify(item[i]));
              }
              this.onAction({name : "EDIT_ITEM"});
             //await this.$store.dispatch('DeleteQuickReps', item);
          },
          async viewItem(item) {
            let resp = await this.$service.get('api/config/channel/'+item.channelId);
            this.oneItemView = resp.results[0];
            this.$bvModal.show(this.modelName + "_VIEW")
          },
          async deleteItem(item) {
            await this.$service.post('api/config/channel/'+item.channelType + "?disabled="+ !item.disabled, item );
            this.loadItems();
          },
          async onAction (argument) {
            switch(argument.name){
              case "ADD_ITEM" :
                this.oldHash = JSON.stringify(this.oneItem);
                this.openForm(this.oneItem);
                console.log("ADD_ITEM",argument);
                break;
              case "EDIT_ITEM" :
                this.oldHash = JSON.stringify(this.oneItem);
                this.openForm(this.oneItem);
                console.log("ADD_ITEM",argument);
                break;
              case "VIEW_ITEM" :
                this.openForm(this.oneItem);
                console.log("ADD_ITEM",argument);
                break;
              case "CANCEL" :
                this.$bvModal.hide(this.modelName)
                break;
              default:
                console.log("NoMapping",argument) 
            }
          },
          async openForm(item){
              let resp = await this.$service.get('api/meta/channel_configs/'+item.channelType);
              console.log("oldHash",this.oldHash)
              this.modalInputs = resp.results.map(function (meta) {
                var key = (meta.path || meta.key)
                console.log("meta.key",key,JSONPath({ path : '$.'+key,json : item}))
                return {
                  meta : meta,
                  config : { 
                    key : meta.key,
                    path : meta.path,
                    value : JSONPath({ path : '$.'+key,json : item})[0] || meta.defaultValue
                  }
                }
              });
              this.$bvModal.show(this.modelName)
          },
          async onConfigChange({ meta,config }){
              let callback = (payload, type, obj) => {
                obj.parent[obj.parentProperty] = config.value;
                return payload;
              };
              const rs = JSONPath({
                path : '$.' + config.key,
                json: this.oneItem,
                resultType: "all",
                callback :callback
              });
              this.oneItem.__ob__.dep.notify()
          }

        }


    }
</script>
<style type="text/css">
  .swatches-fallback-input-class {
    text-align: center;
    width: 450px;
  }
</style>
