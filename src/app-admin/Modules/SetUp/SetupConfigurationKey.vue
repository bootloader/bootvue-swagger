<template>
  <span>
    <span v-if="editable" class="fa fa-edit" pointer @click="editItem"/>
    <span v-if="readable">
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

    <ValidationObserver  ref="form" class="modal-form" v-slot="{ invalid }">
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

                <div  v-else class="">
                  <base-input
                      v-model="oneItem.config.value"
                      :help-message="oneItem.meta.desc">
                  </base-input>        

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
          editable : {
            type : Boolean
          },
          readable : {
            type : Boolean
          }
        },
        data: () => ({
            modelName :  "MODAL_ADD_USERS" + (++modalCounter),
            oneItem : newItem(),
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
            return this.oneItem?.config?.value;
          },
          isChanged :  function (argument) {
            return this.oldHash !== JSON.stringify(this.oneItem);
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
            if(this.configKey){
              let resp = await this.$service.get("/api/config?key="+this.configKey);
              let item = resp.results[0];
              for(var i in item){
                this.oneItem[i] = JSON.parse(JSON.stringify(item[i]));
              }
              this.$emit("load",this.oneItem);
            } else {
              console.log("this.configuration",this.configuration)
              for(var i in this.configuration){
                this.oneItem[i] = JSON.parse(JSON.stringify(this.configuration[i]));
              }
            }
          },
          editItem : function(){
              console.log("editItem:",this.configuration)
              if(!this.editable) return;
              this.oldHash = JSON.stringify(this.oneItem);
              this.$bvModal.show(this.modelName)
          },
          async saveItem () {
              await this.$store.dispatch('SetConfigs', {
                key : this.oneItem.meta.key,value : this.oneItem.config.value,
              });
              this.cancelItem();
              this.load();
              this.$emit("saved",this.oneItem);
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
