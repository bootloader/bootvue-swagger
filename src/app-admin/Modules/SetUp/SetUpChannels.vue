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
                  <my-source options="@data/contact_types">
                      <template #data="{options}">
                        <base-dropdown class="nav-item" menu-on-right title-tag="a">
                          <a slot="title-container" class="btn btn-primary" href="#" role="button"
                              aria-haspopup="true" aria-expanded="false">
                              {{action.label}}
                          </a>
                          <a v-for="option in options" 
                            v-bind:key="option.id" class="dropdown-item" :hidden="!option.item.enabled"
                            @click="addItem(option.item.channelType)">{{option.label}}</a>
                        </base-dropdown>
                      </template>  
                  </my-source>  
          </template>

          <template #cell(details)="row">
            <i :class="[$global.MyDict.socialPrefix(row.item.contactType,'fa')]"></i>
            &nbsp;{{row.item.lane}}
          </template>

          <template #cell(channelCode)="row">
              <span class="mr-2 btn btn-xs btn-outline-grey text-xs text-uppercase">
                {{row.item.channelCode || row.item.lane}}</span>
          </template>
                               
       
          <template #cell(status)="row">
            <my-status :value="!row.item.disabled" icon="fa fa-wave-square" 
            v-tooltip="!row.item.disabled ? 'Connected' : 'Disconnected'" />
            <my-status 
                  v-if="row.item.sandbox"
                  :value="row.item.sandbox" icon="fa fa-box-open" v-tooltip="'Sandbox'" 
                    class="ml-1"/>
           <my-status 
                  v-if="row.item.shared"
                  :value="row.item.shared" icon="far fa-address-card" v-tooltip="'Default Page'" 
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
           <template #cell(inboundQueue)="row">
                <MyText v-if="row.item.readOnly"
                    options="getx:/api/options/inbound_queue" optionKey="code" optionLabel="code"
                    :value="row.item.inboundQueue">
                </MyText>
                <BaseVSelect size="sm"
                    @change="inboundQueueUpdate(row.item)"
                    :disabled="row.item.readOnly" :readonly="row.item.readOnly" :clearable="!row.item.readOnly"
                    options="getx:/api/options/inbound_queue" optionKey="code" optionLabel="code"
                    v-model="row.item.inboundQueue"
                    :emptyDisplay="$global.MyConst.config.SETUP.POSTMAN_CHAT_INBOUND_QUEUE"
                    class="text-sm float-left mx-1 w-50"/>

           </template>

      </master-view >

        <b-modal v-if="oneItem" :id="modelName+'_VIEW'" :title="'View Details '" size="md"
            @hidden="cancelItem">
                <base-input size="sm" readonly prelabel copy
                  label="Channel Id" :value="oneItemView.channelId">
                </base-input>
               <base-input size="sm" readonly prelabel copy link
                  label="Click2Chat" :value="$global.MyDict.c2cUrl(oneItemView)">
                </base-input>
                <base-text-area
                    v-if="oneItemView.channelType == 'web' && oneItemView.callbackPath"
                    size="sm" :rows="12" layout="flushed" readonly copy
                    label="Script" 
                    :value="createWebScript(oneItemView.webhookUrl , oneItemView.callbackPath)">
                    <template #infoBlock>
                      To customize widget <a target="_blank"
                        :href="`${$global.MyConst.config.PROP_SERVICE_DOCS_LINK}/guide/channel-connect/webchat/`" >
                        read documentation</a>
                    </template>  
                </base-text-area>
                <base-input v-else-if="oneItemView.webhookManual && oneItemView.callbackPath" size="sm" readonly prelabel copy
                  label="Webhook URL" :value="oneItemView.webhookUrl + '/' + oneItemView.callbackPath">
                </base-input>
                <qr-code :value="$global.MyDict.c2cUrl(oneItemView)" :options="{
                  size : 300
                }">
                </qr-code>
                <template #modal-footer="{ok}">
                  <button @click="ok()"
                          class="btn btn-sm btn-primary">OK</button>
                </template>
        </b-modal>
        <ValidationObserver ref="form" class="modal-form" v-slot="{ invalid }">
        <b-modal v-if="oneItem" :id="modelName" :title="'Add/Edit Details '" size="md"
          header-class="py-2"
            @hidden="cancelItem">
                <x-simple-form size="sm"
                :inputs="modalInputs" :isnew="!oneItem.id" :settings="{
                  json_height : '200px'
                }"
                @change="onConfigChange">
                </x-simple-form>
                <template #modal-footer>
                  <button @click="saveItem()"
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
    import MyStatus from '@/@common/custom/components/MyStatus.vue';
    import QrCode from '@/@common/custom/components/QrCode.vue';

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
                MyStatus,
                QrCode
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            actions : [],
            table : {
              fields: [ 
                { key : 'details', label : "Channel" },
                { key : 'channelCode', label : "Code" },
                { key : 'name', label : "Desc" },
                { key : 'status', label : "Status" },
                { key : 'actions', label : "Action" },
                { key : 'inboundQueue', label : "Default Inbound App Queue" }
                ],
              items : [],
              perPage: 25, size : 'sm', sortBy: 'name',
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
          async saveItem (silent) {
              let resp = await this.$service.post('api/config/channel/'+this.oneItem.channelType, this.oneItem );
              await this.onAction({name : "CANCEL"});
              if(!silent)
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
            if(item){
              let resp = await this.$service.get('api/config/channel/'+item.channelId+"/");
              this.oneItemView = resp.results[0] || item || { 
                channelId : item.channelId,
                contactType : item.contactType
              };
              this.$bvModal.show(this.modelName + "_VIEW")
            }
          },
          async disableItem(item) {
            await this.$service.get('api/config/channel/'+item.channelId + "/" + 
            (item.disabled ? "enable" : "disable") , {});
            this.loadItems();
          },
          async inboundQueueUpdate(item){
              this.oneItem = newItem();
              for(var i in item){
                this.oneItem[i] = JSON.parse(JSON.stringify(item[i]));
              }
              this.saveItem(true);
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
                let path = (meta.pathRaw || meta.path )
                var key = (path|| meta.key)
                console.log("meta.key",key,JsonXPath({ path : '$.'+key,json : item}))
                return {
                  meta : meta,
                  config : { 
                    key : meta.key,
                    path : path,
                    value : JsonXPath({ path : '$.'+key,json : item})[0]
                  }
                }
              });
              this.$bvModal.show(this.modelName)
          },
          async onConfigChange({ meta,config }){
              var key = (meta.pathRaw || meta.path || meta.key);
              const rs = JsonXPath({
                path : '$.' +key,
                json: this.oneItem,
                resultType: "all",
                value : config.value
              });
              this.oneItem.__ob__.dep.notify()
          },
          createWebScript(callback,path){
            //https://demo.mehery.io/postman/ext/inbound/v2/fb/callback/PK79UY4KUP/fb:181412048587363/1g2kbqar1qmufVW0LJ2C7WS
            let paths = (path||"").split("/");
            let script =  (
`       <!-- Add this snippt as last tag in body -->
<script src='https://mehery.pages.dev/plugins/customer.js'>
{
  "domain" : "${this.$global.MyConst.tenant}.${this.$global.MyConst.config.PROP_SERVICE_SERVER}",
  "channelId" : "${paths[6]}",
  "channelKey" : "${paths[7]}",
  "config" : {}
}
</` +`script>`);
            return script;
          }
        }


    }
</script>
<style type="text/css">

</style>
