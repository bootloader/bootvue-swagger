<template>
  <span>
    <span v-if="editable" class="fa fa-edit" pointer @click="editItem"/>
    <span v-if="readable">
      <span v-for="(oneItem,index) in oneItems" v-bind:key="index" class="text-comma">
        <span v-if="oneItem.meta.inputType=='OPTIONS'">
              <span v-if="oneItem.meta.optionsSource">
                <MySource
                  :value="oneItem.config.value"
                  :options="oneItem.meta.optionsSource"
                  :optionKey="oneItem.meta.optionsKey">
                </MySource>  
              </span>
              <span v-else>
                  [ {{oneItem.config.value|display(oneItem.meta.options)}} ]
              </span>
          </span>
          <span v-else-if="oneItem.meta.inputType=='COLOR'">
                <v-swatches
                  :value="oneItem.config.value"
                  show-fallback
                  popover-x="left"
                  disabled
                  swatch-size="10"
                  :trigger-style="swatch.style"
                ></v-swatches>
          </span>
          <span v-else-if="oneItem.meta.inputType=='COLOR_PALLETE'">
                <v-swatches
                  :value="oneItem.config.value.primary"
                  show-fallback
                  popover-x="left"
                  disabled
                  swatch-size="10"
                  :trigger-style="swatch.style"
                ></v-swatches>
                <v-swatches
                  :value="oneItem.config.value.secondary"
                  show-fallback
                  popover-x="left"
                  disabled
                  swatch-size="10"
                  :trigger-style="swatch.style"
                ></v-swatches>
                <v-swatches
                  :value="oneItem.config.value.accent"
                  show-fallback
                  popover-x="left"
                  disabled
                  swatch-size="10"
                  :trigger-style="swatch.style"
                ></v-swatches>
          </span>
          <span v-else>{{oneItem.config.value}}</span>
      </span>
    </span>

    <ValidationObserver  ref="form" class="modal-form" v-slot="{ invalid }">
        <b-modal v-if="oneItems.length" :id="modelName" :title="'Update Property '" size="md"
          @hidden="cancelItem">
              <span v-for="(oneItem,index) in oneItems" v-bind:key="index">
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

                  <div  v-else class="">
                    <base-input
                        v-model="oneItem.config.value"
                        :help-message="oneItem.meta.desc">
                    </base-input>        
                  </div>
              </span>
 
                  <template #modal-footer>
                      <div class="position-relative form-group">
                        <button @click="saveItem"
                          name="password" id="examplePassword" :disabled="!(isChanged) || invalid"
                          class="form-control btn btn-primary">Save</button>
                        </div>
                  </template>

        </b-modal>
      </ValidationObserver>
  </span>
</template>

<script>

    import VSwatches from 'vue-swatches'

    // Import the styles too, typically in App.vue or main.js
    import 'vue-swatches/dist/vue-swatches.css'

    function newItem() {
      return {
              "config" : {},
              "meta": {}
            };
    }

    let modalCounter = 0;

    export default {
        components: {
          VSwatches
        },
        props :{
          configKey : {
            type : String
          },
          configuration : {
            type : Object
          },
          configurations : {
            type : Array
          },
          editable : {
            type : Boolean
          },
          readable : {
            type : Boolean
          }
        },
        data: () => ({
            modelName :  "MODAL_ADD_USERS" + (++modalCounter),
            // oneItem : newItem(),
            oneItems : [newItem()],
            oldHash : '',
            swatch : {
              style : { margin: '5px', width : '25px',height : '25px','border-radius' : '8px'},
              colors : [
                      '#1FBC9C','#1CA085','#2ECC70','#27AF60', '#3398DB', '#2980B9', '#A463BF', '#8E43AD',
                      '#3D556E','#222F3D','#F2C511','#F39C19', '#E84B3C', '#C0382B', '#DDE6E8', '#BDC3C8',
                      '#4b56c0','#ffc976', '#40a6db', '#f1a948' ,'#db3a70', '#25d366', '#00BFFF', '#4267b2',
                      "#0648AA", "#00bfb6","#22625F","#18547C", "#002856"
                ],
            },
        }),
        computed : {
          displayValue(){
            return (this.oneItems || []).map(function(oneItem){
              return oneItem?.config?.value;
            }).join(",");
          },
          isChanged :  function (argument) {
            return this.oldHash !== JSON.stringify(this.oneItems);
          }
        },
        created : function (argument) {
         // console.log("created",this.$refs.editor.clientHeight)
        },
        mounted : function (argument) {
          this.load();
        },
        methods : {
          async load (){
            this.oneItems = [];
            if(this.configKey){
              let resp = await this.$service.get("/api/config?key="+this.configKey);
              this.addConfig(resp.results[0]);
              this.$emit("load",this.oneItem);
            } else if(this.configuration){
              console.log("this.configuration",this.configuration);
              this.addConfig(this.configuration);
            } else if(this.configurations && this.configurations.length){
              for (let i in this.configurations) {
                this.addConfig(this.configurations[i]);
              }
            }
          },
          addConfig(configuration){
              let oneItem = newItem();
              for(var i in configuration){
                oneItem[i] = JSON.parse(JSON.stringify(configuration[i]));
              }
              this.oneItems.push(oneItem);
          },
          editItem : function(){
              console.log("editItem:",this.configurations)
              if(!this.editable) return;
              this.oldHash = JSON.stringify(this.oneItems);
              this.$bvModal.show(this.modelName)
          },
          async saveItem () {
              for(var i in this.oneItems){
                await this.$store.dispatch('SetConfigs', {
                  key : this.oneItems[i].meta.key,value : this.oneItems[i].config.value,
                });
              }
              this.cancelItem();
              this.load();
              this.$emit("saved",this.oneItems);
          },
          async cancelItem(item) {
             this.$bvModal.hide(this.modelName)
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
