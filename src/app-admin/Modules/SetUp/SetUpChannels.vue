<template>
    <div>
        <master-view 
          :header="{
            heading : 'Channels',
            subheading : 'Plug-In Social Connectors',
            icon : 'icon-gradient bg-happy-itmeo fa fa-plug',
          }"
          :table=table
          :actions="[{ name :'add_channel',label : 'Add Channel'}]"
          @action="onAction"      
       >

          <template #action(add_channel)="{action}">
                <base-dropdown class="nav-item" menu-on-right title-tag="a">
                    <a slot="title-container" class="btn btn-primary" href="#" role="button"
                        aria-haspopup="true" aria-expanded="false">
                        {{action.label}}
                    </a>
                    <a class="dropdown-item" @click="addItem('wa360')">WhatsApp</a>
                    <a class="dropdown-item" @click="addItem('tg')">Telegram</a>
                    <a class="dropdown-item" @click="addItem('fb')">Facebook</a>
                    <a class="dropdown-item" @click="addItem('tw')">Twitter</a>
                    <a class="dropdown-item" @click="addItem('ig')">Instagram</a>
                    <a class="dropdown-item" @click="addItem('web')">WebChat</a>
                </base-dropdown>
          </template>

          <template #cell(details)="row">
            <i :class="[$global.MyDict.socialPrefix(row.item.contactType,'fa')]"></i>
            &nbsp;{{row.item.lane}}
          </template>
       
          <template #cell(status)="row">
            <my-status :value="!row.item.disabled" icon="fa fa-wave-square" 
            v-tooltip="!row.item.disabled ? 'Connected' : 'Disconnected'" />
            <my-status 
                  v-if="row.item.sandbox"
                  :value="row.item.sandbox" icon="fa fa-box-open" v-tooltip="'Sandbox'" 
                    class="ml-1"/>
          </template>

          <template #cell(actions)="row">
            <b-button size="sm" @click="editItem(row.item, row.index, $event.target)"  
                :disabled="row.item.readOnly"
                v-tooltip="row.item.message" variant="outline-primary">
                <i class="fas fa-edit"></i>
            </b-button>&nbsp;
            <b-button size="sm" @click="viewItem(row.item, row.index, $event.target)"  
                v-tooltip="row.item.message" variant="outline-primary">
                <i class="fas fa-eye"></i>
            </b-button>&nbsp;
            <b-button size="sm" @click="disableItem(row.item, row.index, $event.target)"  
                v-tooltip="row.item.disabled ? 'Connect' : 'Disconnect'"
                :disabled="row.item.readOnly"
                 variant="outline-primary">
                <i class="fas fa-plug" :class="{
                  'fa-x' : row.item.disabled
                  }"></i>
            </b-button>&nbsp;
            <b-button size="sm" @click="deleteItem(row.item, row.index, $event.target)"  
              :disabled="row.item.readOnly"
                v-tooltip="'Delete'" variant="outline-primary">
                <i class="fas fa-trash"/>
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

                <b-input-group v-if="oneItemView.webhookManual" class="mt-3">
                 <b-input-group-prepend>
                      <b-button variant="outline-dark" class="text-sm w-120px">
                         Webhook URL</b-button>
                  </b-input-group-prepend>
                  <b-form-input readonly
                    :value="oneItemView.webhookUrl + '/' + oneItemView.callbackPath"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button class="w-20"
                      v-clipboard:copy="oneItemView.webhookUrl + '/' + oneItemView.callbackPath" 
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
        <ValidationObserver ref="form" class="modal-form" v-slot="{ invalid }">
        <b-modal v-if="oneItem" :id="modelName" :title="'Add/Edit Details '" size="md"
          header-class="py-2"
            @hidden="cancelItem">
                <x-simple-form size="sm"
                :inputs="modalInputs" :isnew="!oneItem.id"
                @change="onConfigChange">
                </x-simple-form>
                <template #modal-footer>
                  <button @click="saveItem"
                    name="password" id="examplePassword" :disabled="!(isChanged) || invalid"
                    class="btn btn-primary btn-sm">Save</button>
                </template>
        </b-modal>
        </ValidationObserver>


    </div>
</template>

<script>

    import MasterView from "../../Layout/MasterView.vue";
    import XSimpleForm from "@/@common/custom/components/XSimpleForm.vue";
    import { MyFlags,MyDict,MyConst } from '../../../services/global';
    import JsonXPath from '@/@common/utils/JsonXPath'

    // Import the styles too, typically in App.vue or main.js
    import 'vue-swatches/dist/vue-swatches.css'
import MyStatus from '../../../@common/custom/components/MyStatus.vue';

    function newItem(channelType) {
      return {
          channelType,
          "config" : {},
          "meta": {}
        };
    }
    export default {
        components: {
            MasterView,XSimpleForm,
                MyStatus
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            actions : [],
            table : {
              fields: [ 
                { key : 'details', label : "Channel" },
                { key : 'name', label : "Desc" },
                { key : 'status', label : "Status" },
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
            this.oneItemView = resp.results[0] || { channelId : item.channelId };
            this.$bvModal.show(this.modelName + "_VIEW")
          },
          async disableItem(item) {
            await this.$service.get('api/config/channel/'+item.channelId + "/" + 
            (item.disabled ? "enable" : "disable") , {});
            this.loadItems();
          },
          async deleteItem(item) {
            await this.$service.get('api/config/channel/'+item.channelId + "/remove",{});
            this.loadItems();
          },
          async addItem(channelType) {
            this.oneItem = newItem(channelType);
            this.onAction({name : 'ADD_ITEM'});
          },
          async onAction (argument) {
            switch(argument.name){
              case "ADD_ITEM" :
                this.oldHash = JSON.stringify(this.oneItem);
                this.openForm(this.oneItem);
                break;
              case "EDIT_ITEM" :
                this.oldHash = JSON.stringify(this.oneItem);
                this.openForm(this.oneItem);
                break;
              case "VIEW_ITEM" :
                this.openForm(this.oneItem);
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
                console.log("meta.key",key,JsonXPath({ path : '$.'+key,json : item}))
                return {
                  meta : meta,
                  config : { 
                    key : meta.key,
                    path : meta.path,
                    value : JsonXPath({ path : '$.'+key,json : item})[0] || meta.defaultValue || ""
                  }
                }
              });
              this.$bvModal.show(this.modelName)
          },
          async onConfigChange({ meta,config }){
              var key = (meta.path || meta.key);
              const rs = JsonXPath({
                path : '$.' +key,
                json: this.oneItem,
                resultType: "all",
                value : config.value
              });
              this.oneItem.__ob__.dep.notify()
          }

        }


    }
</script>
<style type="text/css">

</style>
