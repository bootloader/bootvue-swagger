<template>
    <div>

      <master-view 
          :header="{
            heading : 'Client Apps',
            subheading : 'Client Apps are used to interact with messaging apis',
            icon : 'pe-7s-key icon-gradient bg-happy-itmeo fa fa-th-large',
          }"
          :table=table
          :actions=actions
          @action="onAction"      
       >
          <template #cell(appType)="row">
              <my-icon type="chatmode" :value="row.item.appType">&nbsp;<small>{{row.item.appType}}</small></my-icon>
          </template>
          <template #cell(changelog)="row">
              <small>Modified on {{row.item.updatedStamp | formatStamp}} by {{row.item.updatedBy}}</small>
          </template>
          <template #cell(code)="row">
              {{row.item.code}} <span 
              v-if="$global.MyConst.config.SETUP.POSTMAN_CHAT_INBOUND_QUEUE == row.item.code"
              v-tooltip="'This is set as default inbound queue'"
              class="btn mg-1 fa fa-star text-primary">
            </span>  <span  v-if="row.item.readOnly && row.item.shared"
              v-tooltip="'This App is part of default setup'"
              class="btn mg-1 fa fa-info-circle text-primary">
            </span> 
          </template>
          <template #cell(actions)="row">
            <b-button :disabled="row.item.readOnly" 
                size="sm" @click="showItem(row.item, row.index, $event.target)"   class="mg-1"
                v-tooltip="row.item.message" variant="outline-primary">
                <i class="fas fa-eye"></i>
            </b-button>
            <b-button :disabled="row.item.readOnly"
                size="sm" @click="editItem(row.item, row.index, $event.target)"  class="mg-1"
                v-tooltip="row.item.message" variant="outline-primary">
                <i class="fas fa-edit"></i>
            </b-button>
            <b-button :disabled="row.item.readOnly"
                size="sm" class="mg-1" variant="outline-primary"
                @click="deleteItem(row.item, row.index, $event.target)"
                v-tooltip="row.item.message" >
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


        <ValidationObserver ref="form" class="template-form">
        <b-modal v-if="oneItem" :id="modelName" :title="'Client App Details'" size="md"
        @hidden="cancelItem">
                <base-input class="mb-0" size="sm" autocomplete="off"
                    label="App Name" placeholder="My API Key 1 or Slack Connector"
                    v-model="oneItem.name" :textLimit="60" required
                    rules="required|min:4|max:512" >
                </base-input>
                <base-input class="mb-0" size="sm" autocomplete="off" :readonly="oneItem.id && oneItem.code"
                    label="Queue Code" placeholder="my_api_connector"
                    v-model="oneItem.code" :textLimit="60" required
                    rules="required|min:4|max:512" >
                </base-input>
                <BaseVSelect class="mb-0" size="sm"
                  name="App Type" :clearable="false"
                  options="getx:/api/meta/app_types"
                  v-model="oneItem.appType"
                  placeholder="Select App Type">
                </BaseVSelect>
                <my-model-form size="sm"
                  :configs="`getx://api/meta/app_types/${oneItem.appType}/config`"
                  :model="oneItem">
                </my-model-form> 
                <template #modal-footer>
                    <div class="position-relative">
                        <button @click="deleteItem(oneItem)" v-if="oneItem.id"
                          name="generate" id="resetKeys"
                          class="btn btn-outline-danger btn-sm mg-1">Delete</button>
                        <button @click="saveItem(false)"
                          name="save" id="saveitem" :disabled="!(isChanged)"
                          class="btn btn-primary btn-sm mg-1">Save</button>
                      </div>
                </template>
        </b-modal>
        </ValidationObserver>
        <b-modal v-if="lastItem" :id="modelName+'_VIEW'" :title="`Details : ${lastItem.name}`" size="md">
            <b-input-group class="mt-3" size="sm">
              <b-input-group-prepend>
                  <b-button variant="outline-dark"  class="text-sm w-120px">
                    App Name</b-button>
              </b-input-group-prepend>
              <b-form-input readonly
                :value="lastItem.name"
              ></b-form-input>
            </b-input-group>
            <b-input-group class="mt-3" size="sm">
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
            <b-input-group class="mt-3" size="sm">
              <b-input-group-prepend>
                  <b-button variant="outline-dark"  class="text-sm w-120px">
                    API Key</b-button>
              </b-input-group-prepend>
              <b-form-input readonly
                :value="lastItem.key || '***********'"
              ></b-form-input>
              <b-input-group-append>
                <b-button v-if="lastItem.key"
                  v-clipboard:copy="lastItem.key" 
                  variant="outline-success">Copy</b-button>
                <b-button v-else
                  @click="resetItem(lastItem)" 
                  variant="outline-success">Reset Key</b-button>
              </b-input-group-append>
            </b-input-group>
            <b-input-group class="mt-3" size="sm">
              <b-input-group-prepend>
                  <b-button variant="outline-dark"  class="text-sm w-120px">
                    API Endpoint</b-button>
              </b-input-group-prepend>
              <b-form-input readonly
                :value="`https://${$global.MyConst.tenant}.${$global.MyConst.config.PROP_SERVICE_DOMAIN}/xms`"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  v-clipboard:copy="`https://${$global.MyConst.tenant}.${$global.MyConst.config.PROP_SERVICE_DOMAIN}/xms`" 
                  variant="outline-success">Copy</b-button>
              </b-input-group-append>
            </b-input-group>
            <b-input-group class="mt-3" size="sm"  v-if="lastItem.webhook">
              <b-input-group-prepend>
                  <b-button variant="outline-dark"  class="text-sm w-120px">
                    Webhook URL</b-button>
              </b-input-group-prepend>
              <b-form-input readonly
                :value="lastItem.webhook"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  v-clipboard:copy="lastItem.webhook" 
                  variant="outline-success">Copy</b-button>
              </b-input-group-append>
            </b-input-group>
            <template #modal-footer="{cancel}">
                <a id="resetKeys" :href="$global.MyConst.config.PROP_SERVICE_DOCS_API_LINK" 
                  target="_blank"
                  class="btn btn-outline-greyer btn-sm mg-1 float-start ml-0 mr-auto"
                  name="generate" 
                  >View Docs</a>
                <button @click="cancel()"
                  name="save" id="saveitem"
                  class="btn btn-primary btn-sm mg-1">OK</button>
            </template>
        </b-modal>

    </div>
</template>

<script>

    import MasterView from "../../Layout/MasterView.vue";
    import { MyFlags,MyDict,MyConst } from '../../../services/global';

    import VSwatches from 'vue-swatches'

    // Import the styles too, typically in App.vue or main.js
    import 'vue-swatches/dist/vue-swatches.css'
    import MySource from '../../../@common/custom/components/MySource.vue';
    import MyModelForm from '../../../@common/custom/components/MyModelForm.vue';

    function newItem(_item) {
      let item = _item || {};
      return {
          id : item?.id || null,
          name : item?.name || "",
          code : item?.code ||  "", 
          appType : item?.appType ||  "WEBHOOK", 
          webhook : item?.webhook || null, key : item?.key || null,
          props : item?.props || {}, secret : item?.secret || {}
      };
    }
    export default {
        components: {
            MasterView,VSwatches,
                MySource,MyModelForm
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            actions : [{
              label : "Create App", icon : "fa fa-plus", name : "ADD_ITEM", action : "ADD_ITEM"
            }],
            table : {
              fields: [ 
                { key : 'name', label : "Name" },
                { key : 'id', label : "Id" },
                { key : 'code', label : "Queue" },
                { key : 'appType', label : "Type" },
                { key : 'actions', label : "Actions" },
                { key : 'changelog', label : "Changelog" },
              ],
              sortBy: 'name',
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
        watch : {
            "oneItem.name" : function(newVal,oldVal){
              if(this.oneItem.id) return;
              let oldCode = (oldVal || "").toLowerCase().replace(/[^A-Za-z0-9_]+/g,'_');
              if(!this.oneItem.code || this.oneItem.code == oldCode){
                  this.oneItem.code = newVal.toLowerCase().replace(/[^A-Za-z0-9_]+/g,'_');
              }
            },
            "oneItem.code" : function(newVal,oldVal){
              this.oneItem.code = this.oneItem?.code.toLowerCase().replace(/[^A-Za-z0-9_]+/g,'_');
            },
        },
        created : function (argument) {
          this.loadItems();
        },
        methods : {
          async loadItems (){
            let resp = await this.$service.get('api/config/clientapikey');
            this.table.items = resp.results;
          },
          async saveItem (reset) {
              console.log("saveItem",reset)
              var resp = await this.$service.post('api/config/clientapikey', {
                id : this.oneItem.id,
                name : this.oneItem.name,
                code : this.oneItem.code,
                key : (reset==true) ? '' : "**********",
                appType : this.oneItem.appType,
                webhook : this.oneItem.webhook,
                props : this.oneItem.props,
                secret : this.oneItem.secret,
              });
              this.lastItem = resp.data;
              this.oneItem = newItem();
              this.onAction({name : "CANCEL"});
              this.loadItems();
              this.$bvModal.show(this.modelName + "_VIEW");
          },
          async showItem(item) {
            this.lastItem = item;
            this.$bvModal.show(this.modelName + "_VIEW");
          }, 
          async resetItem(item) {
            this.oneItem = item;
            this.saveItem(true);
          }, 
          async cancelItem(item) {
             this.oneItem = newItem();
             this.onAction({name : "CANCEL"});
          }, 
          async deleteItem(item) {
            await this.$service.delete('api/config/clientapikey/'+item.id,{id : item.id});
            this.loadItems();
            this.cancelItem();
          },
          async editItem(item) {
              this.oneItem = newItem(item);
              console.log("this.oneItem",this.oneItem);
              for(var i in item){
                this.oneItem[i] = JSON.parse(JSON.stringify(item[i])) || this.oneItem[i];
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
