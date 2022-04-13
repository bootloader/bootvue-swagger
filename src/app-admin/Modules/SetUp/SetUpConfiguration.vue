<template>
    <div class="">
        <master-view 
          :header="{
            heading : heading,
            subheading : subheading,
            icon : icon,
          }"
          goodTable
          :table=table
          :actions=actions
          :filters="[{ label : 'Refresh', name : 'sync'}]"
          :busy="table.busy"
          @action="onAction">

          <template #filter(sync)>
              <span class="btn btn-success" @click="loadItems">
                <i class="fa fa-sync"/>
              </span>
          </template>

           <template #groupBy="group">
              <span class="text-successs badge btn btn-xs btn-dark">
                {{ group.item.label }}
              </span>
          </template>

          <template #cell(value)="row">
            <span v-if="row.item.meta.inputType=='OPTIONS'">

              <span v-if="row.item.meta.optionsSource">
                <MySource
                  :value="row.item.config.value"
                  :options="row.item.meta.optionsSource"
                  :optionKey="row.item.meta.optionsKey">
                </MySource>  
              </span>
              <span v-else>
                  [ {{row.item.config.value|display(row.item.meta.options)}} ]
              </span>
            
            </span>
            <span v-else-if="row.item.meta.inputType=='COLOR'">
                <v-swatches
                  :value="row.item.config.value"
                  show-fallback
                  popover-x="left"
                  disabled
                  swatch-size="10"
                  :trigger-style="swatch.style"
                ></v-swatches>
            </span>
            <span v-else-if="row.item.meta.inputType=='COLOR_PALLETE'">
                <v-swatches
                  :value="row.item.config.value.primary"
                  show-fallback
                  popover-x="left"
                  disabled
                  swatch-size="10"
                  :trigger-style="swatch.style"
                ></v-swatches>
                <v-swatches
                  :value="row.item.config.value.secondary"
                  show-fallback
                  popover-x="left"
                  disabled
                  swatch-size="10"
                  :trigger-style="swatch.style"
                ></v-swatches>
                <v-swatches
                  :value="row.item.config.value.accent"
                  show-fallback
                  popover-x="left"
                  disabled
                  swatch-size="10"
                  :trigger-style="swatch.style"
                ></v-swatches>
            </span>
            <span v-else>{{row.item.config.value}}</span>
          </template>
          <template #cell(actions)="row">
            <b-button size="xs" @click="editItem(row.item, row.index, $event.target)"  
                v-tooltip="row.item.message" variant="outline-primary" class="fas fa-edit text-sm">
            </b-button>
          </template>

      </master-view>

      <ValidationObserver ref="form" class="modal-form" v-slot="{ invalid }">
        <b-modal v-if="oneItem" :id="modelName" :title="'Update Property '" size="md"
          @hidden="cancelItem">
                <div class="form-row">
                      <input name="agent_name" id="examplePassword"
                       placeholder="John Doe" type="text"
                        class="form-control" v-model="oneItem.meta.title" readonly>
                </div>
                <br/>
               <div  v-if="oneItem.meta.inputType=='OPTIONS'" class="form-row">   
                    <span v-if="oneItem.meta.optionsSource" class="w-100">
                      <BaseVSelect class="w-100"
                        :optionKey="oneItem.meta.optionsKey" 
                        :optionLabel="oneItem.meta.optionsLabel"
                        :options="oneItem.meta.optionsSource" 
                        v-model="oneItem.config.value"
                        clearable searchable filterable
                        >
                      </BaseVSelect>
                    </span>
                    <span v-else>
                        <ButtonRadioGroup v-if="oneItem.meta.options.length < 5"
                          v-model="oneItem.config.value" size="sm"
                          :options="oneItem.meta.options"
                        />
                          <BaseVSelect v-else class="w-100"
                            v-model="oneItem.config.value" size="sm"
                            :options="oneItem.meta.options"
                            placeholder="Select Language"
                        />
                    </span>

                </div>
                <div  v-else-if="oneItem.meta.inputType=='COLOR'" class="form-row"> 
                      <v-swatches class="d-flex justify-content-center"
                        v-model="oneItem.config.value"
                        show-fallback
                          fallback-input-type="color"
                        fallback-input-class="swatches-fallback-input-class"
                        inline
                        :swatches="swatch.colors"
                        :swatch-style="swatch.style"
                        :wrapper-style="{
                              margin: 'auto',
                              width: '90%'
                        }"
                      ></v-swatches>
                </div>
                <div  v-else-if="oneItem.meta.inputType=='COLOR_PALLETE'" class="form-row"> 
                      <v-swatches class="d-flex justify-content-center"
                        v-model="oneItem.config.value.primary"
                        show-fallback
                        fallback-input-type="color"
                        fallback-input-class="swatches-fallback-input-class"
                        inline
                        :swatches="swatch.colors"
                        :swatch-style="swatch.style"
                        :wrapper-style="{
                              margin: 'auto',
                              width: '90%'
                        }"
                      ></v-swatches>
                      <v-swatches class="d-flex justify-content-center"
                        v-model="oneItem.config.value.secondary"
                        show-fallback
                          fallback-input-type="color"
                        fallback-input-class="swatches-fallback-input-class"
                        inline
                        :swatches="swatch.colors"
                        :swatch-style="swatch.style"
                        :wrapper-style="{
                              margin: 'auto',
                              width: '90%'
                        }"
                      ></v-swatches>
                      <v-swatches class="d-flex justify-content-center"
                        v-model="oneItem.config.value.accent"
                        show-fallback
                          fallback-input-type="color"
                        fallback-input-class="swatches-fallback-input-class"
                        inline
                        :swatches="swatch.colors"
                        :swatch-style="swatch.style"
                        :wrapper-style="{
                              margin: 'auto',
                              width: '90%'
                        }"
                      ></v-swatches>
                </div>

                <div  v-else class="form-row">
                  <input name="email"
                          placeholder="A,1232, https://soem.url etc"
                          type="text"
                          class="form-control" v-model="oneItem.config.value">
                </div>
 
                  <template #modal-footer>
                      <div class="position-relative form-group">
                        <button @click="saveItem"
                          name="password" id="examplePassword" :disabled="!(isChanged) || invalid"
                          class="form-control btn btn-primary">Save</button>
                        </div>
                  </template>

        </b-modal>
      </ValidationObserver>

    </div>
</template>

<script>

    import PageTitle from "../../Components/PageTitle.vue";
    import { MyFlags,MyDict,MyConst } from '../../../services/global';

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
            PageTitle,VSwatches
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'Configuration Setup',
            subheading: 'Control Agent Panel setting',
            icon: 'pe-7s-users icon-gradient bg-happy-itmeo fa fa-tools',
            actions : [],
            table : {
              fields: [ 
                { key : 'meta.title', label : "Property" },
                { key : 'value', label : "Value" },
               // { key : 'meta.group', label : "Group" },
                //{ key : 'config.value', label : "Value" },
                { key : 'config.description', label : "Desc" },
                { key : 'actions', label : "Action" }],
              items : [],
              perPage: 25,
              currentPage: 1,
              rows : 0,
              groupBy : 'meta.group',
              busy : false
            },
            swatch : {
              style : { margin: '5px', width : '25px',height : '25px','border-radius' : '8px'},
              colors : [
                              '#1FBC9C','#1CA085','#2ECC70','#27AF60', '#3398DB', '#2980B9', '#A463BF', '#8E43AD',
                              '#3D556E','#222F3D','#F2C511','#F39C19', '#E84B3C', '#C0382B', '#DDE6E8', '#BDC3C8',
                              '#4b56c0','#ffc976', '#40a6db', '#f1a948' ,'#db3a70', '#25d366', '#00BFFF', '#4267b2',
                              "#0648AA", "#00bfb6","#22625F","#18547C", "#002856"
                ],
            },
            oneItem : newItem(),
            modelName :  "MODAL_ADD_USERS",
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
            try {
              this.table.busy = true;
              this.table.items = [];
              let resp = await this.$store.dispatch('GetConfigs');
              this.table.items = resp.results.map(function(item){
                if(item.config.value  === null || item.config.value  === undefined){
                    item.config.value  = item.meta.defaultValue;
                }
                return item;
              });
            } finally {
              this.table.busy=false
            }
          },
          async saveItem () {
              await this.$store.dispatch('SetConfigs', {
                key : this.oneItem.meta.key,value : this.oneItem.config.value,
              });
              this.oneItem = newItem();
              this.onAction({name : "CANCEL"});
              this.loadItems();
          },
          async cancelItem(item) {
             this.oneItem = newItem();
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
<style type="text/css">
  .swatches-fallback-input-class {
    text-align: center;
    width: 450px;
    font-size: 20px;
    line-height: 30px;
    padding: 1px !important;
    background: rgba(255, 255, 255, 0);
    border: none;
  }
</style>
