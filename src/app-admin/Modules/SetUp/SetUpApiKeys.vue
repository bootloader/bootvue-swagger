<template>
    <div>

      <master-view  ref="masterView"
          :header=header
          :table=table
          :actions="[{name :'add'}]"
          sidebar-footer-right
          sidebarWidth="50%" size="sm"
           :newItem="newItem" :fixItem="newItem" 
           @save-item="onSaveItem"
       >
          <template #action(add)="{createItem}">
            <b-button variant="success" @click="createItem"><i class="fa fa-plus"/> Create App</b-button>
          </template>
          <template #cell(appType)="row">
              <my-icon type="chatmode" :value="row.item.appType">&nbsp;<small>{{row.item.appType}}</small></my-icon>
          </template>
          <template #cell(changelog)="row">
              <small v-if="row.item.updatedStamp">Modified on {{row.item.updatedStamp | formatStamp}} by {{row.item.updatedBy}}</small>
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
            <b-button  href="#" :disabled="row.item.readOnly"
                size="sm" @click="row.openView" class="mg-1"
                v-tooltip="row.item.message" variant="outline-primary">
                <i class="fas fa-eye"></i>
            </b-button>
            <b-button  href="#" :disabled="row.item.readOnly" 
                size="sm" @click="row.editItem" class="mg-1"
                v-tooltip="row.item.message" variant="outline-primary">
                <i class="fas fa-cog"></i>
            </b-button>
            <b-button :href="`/admin/app/setup/appscript/${row.item.id}`" target="_blank"
                :disabled="row.item.readOnly || !(row.item.appType=='APP_SCRIPT' || row.item.appType=='WEBHOOK')"
                size="sm" class="mg-1"
                v-tooltip="row.item.message" variant="outline-primary">
                <i class="fab fa-codepen"></i>
            </b-button>
            <b-button  href="#" :disabled="row.item.readOnly"
                size="sm" class="mg-1" variant="outline-primary"
                @click="row.removeItem"
                v-tooltip="row.item.message" >
                <i class="fas fa-trash"></i>
            </b-button>
          </template>

          <template #sidebar(edit)="{itemCopy}">
              <ValidationObserver v-if="itemCopy" ref="form" class="template-form" :id="modelName">
                        <base-input class="mb-0" size="sm" autocomplete="off"
                            label="App Name" placeholder="My API Key 1 or Slack Connector"
                            v-model="itemCopy.name" :textLimit="60" required
                            rules="required|min:4|max:512" >
                        </base-input>
                        <base-input class="mb-0" size="sm" autocomplete="off" :readonly="itemCopy.id && itemCopy.code"
                            label="Queue Code" placeholder="my_api_connector"
                            v-model="itemCopy.code" :textLimit="60" required
                            format-filter="item_code" :format-value="itemCopy.name" :format-live="!itemCopy.id"
                            rules="required|min:4|max:512" >
                        </base-input>
                        <BaseVSelect class="mb-0" size="sm" :disabled="!!itemCopy.id && !!itemCopy.code"
                          name="App Type" :clearable="false"
                          options="getx:/api/meta/app_types"
                          v-model="itemCopy.appType"
                          placeholder="Select App Type">
                        </BaseVSelect>
                        <b-tabs content-class="mt-3" align="left" small
                          active-nav-item-class="text-primary"
                          nav-class="font-weight-bold">
                          <b-tab title="Standard Options" active>
                             <my-model-form size="sm" 
                              :configs="`getx://api/meta/app_types/${itemCopy.appType}/config`"
                              :model="itemCopy">
                            </my-model-form> 
                          </b-tab>
                          <b-tab title="Advanced Options" :disabled="!itemCopy.id || !itemCopy.code">
                            <my-model-form size="sm"
                              :configs="`getx://api/meta/app_types/common/config`"
                              :model="itemCopy.config">
                            </my-model-form> 
                          </b-tab>
                        </b-tabs>
              </ValidationObserver>
          </template>

          <template #sidebar(view)="{item}">
              <base-copy class="mt-3" size="sm"
                  label="App Queue Code"
                  :value="item.code">
              </base-copy>
              <base-copy class="mt-3" size="sm"
                  label="API Id"
                  :value="item.id">
              </base-copy>
              <base-copy class="mt-3" size="sm"
                  label="API Key" reset
                  :value="item.key"
                  @reset="resetItem(item)" >
              </base-copy>
              <base-copy class="mt-3" size="sm"
                  label="API Endpoint"
                  :value="`https://${$global.MyConst.tenant}.${$global.MyConst.config.PROP_SERVICE_SERVER}/xms`">
              </base-copy>
              <base-copy class="mt-3" size="sm" v-if="item.appHook"
                  label="APP Hook"
                  :value="lastItemAppHook">
              </base-copy>
              <base-copy class="mt-3 mb-0" size="sm" v-if="item.webhook"
                  label="Webhook URL"
                  :value="item.webhook">
              </base-copy>
              <b-tabs class="mt-3" align="left"  small
                  active-nav-item-class="text-primary"
                          nav-class="font-weight-bold">
                <b-tab title="Standard Options" active>
                  <my-model-form size="sm" class="mt-3 d-block" readonly disabled
                    :configs="`getx://api/meta/app_types/${item.appType}/config`"
                    :model="item">
                  </my-model-form> 
                </b-tab>
                <b-tab title="Advanced Options" >
                  <my-model-form size="sm" class="mt-3 d-block" readonly disabled
                    :configs="`getx://api/meta/app_types/common/config`"
                    :model="item.config">
                  </my-model-form> 
                </b-tab>
              </b-tabs>
          </template>
          <template #sidebar-footer(view)="{editItem,cancelItem}">
              <b-button variant="outline-grey"
                  class="mg-1 float-start mr-auto mx-1" size="sm"
                  name="generate" @click="cancelItem"
                  >Close</b-button>
              <b-button variant="outline-primary"
                  class="mg-1 float-start mr-auto mx-1" size="sm"
                  name="generate" @click="editItem"
                  >Edit</b-button> 
              <a id="resetKeys" :href="$global.MyConst.config.PROP_SERVICE_DOCS_API_LINK" 
                  target="_blank"
                  class="btn btn-outline-greyer btn-sm mg-1 float-start ml-auto mr-2 float-right"
                  name="generate" 
                  >View Docs</a>
  
          </template>

      </master-view>
          
    </div>
</template>

<script>

    import MasterView from "../../Layout/MasterView.vue";
    import { MyFlags,MyDict,MyConst } from '../../../services/global';
        import mustache from 'mustache';

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
          webhook : item?.webhook || null, outboundhook : item?.outboundhook || null, 
          key : item?.key || null, appHook : item?.appHook || null,
          props : item?.props || {}, secret : item?.secret || {}, config : item?.config || {}
      };
    }
    export default {
        components: {
            MasterView,VSwatches,
                MySource,MyModelForm
        },
        data: () => ({
            header : {
              name : 'Client App',
              heading : 'Client Apps',
              subheading : 'Client Apps are containers that bundle messaging functionality for your specific use cases and messaging campaigns.',
              icon : 'pe-7s-key icon-gradient bg-happy-itmeo fa fa-th-large',
            },
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            table : {
              fields: [ 
                { key : 'name', label : "Name" },
                //{ key : 'id', label : "Id" },
                { key : 'code', label : "Queue" },
                { key : 'appType', label : "Type" },
                { key : 'actions', label : "Actions" },
                { key : 'changelog', label : "Changelog" },
              ],
              api : 'api/config/clientapikey',
              sortBy: 'name',
              items : [],
              perPage: 25,
              currentPage: 1,
              rows : 0
            },
            oneItem : newItem(),
            newItem : newItem,
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
            },
            lastItemAppHook(){
              return mustache.render(this.lastItem.appHook, {
                ...this.lastItem,
                domain : MyConst.tenant,
                server : MyConst.config.PROP_SERVICE_SERVER
              });
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
          //this.loadItems();
        },
        methods : {
          async onSaveItem(row,reset,b){
            console.log("onSaveItem",row,reset,b)
            var resp = await this.$refs.masterView.editItemSave({
              itemCopy : {
                ...row.itemCopy,
                key : (reset==true) ? '' : "**********",
              }
            });
            this.lastItem = resp.data;
            this.$refs.masterView.openView({ item :this.lastItem })
          },
          async resetItem(item) {
            this.onSaveItem({itemCopy:item},true);
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
