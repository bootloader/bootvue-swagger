<template>
  <span>
    <span class="fa fa-edit" pointer @click="editItem"/> &nbsp;{{displayValue}}
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
  </span>
</template>

<script>

    function newItem() {
      return {
              "config" : {},
              "meta": {}
            };
    }

    export default {
        components: {
        },
        props :{
          configKey : {}
        },
        data: () => ({
            modelName :  "MODAL_ADD_USERS",
            oneItem : newItem(),
            oldHash : '',
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
            let resp = await this.$service.get("/api/config?key="+this.configKey);
            let item = resp.results[0];
            for(var i in item){
              this.oneItem[i] = JSON.parse(JSON.stringify(item[i]));
            }
          },
          editItem : function(){
              this.oldHash = JSON.stringify(this.oneItem);
              this.$bvModal.show(this.modelName)
          },
          async saveItem () {
              await this.$store.dispatch('SetConfigs', {
                key : this.oneItem.meta.key,value : this.oneItem.config.value,
              });
              this.cancelItem();
              this.load();
          },
          async cancelItem(item) {
             this.$bvModal.hide(this.modelName)
          }, 
        }
    }
</script>
<style lang="scss">
</style>
