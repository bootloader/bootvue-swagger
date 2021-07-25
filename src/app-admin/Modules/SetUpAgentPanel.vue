<template>
    <div>
        <page-title :heading=heading :subheading=subheading :icon=icon :actions=actions
        @action="onAction"></page-title>

          <b-card title="" class="main-card mb-4">
            <b-table :striped=true
                     :bordered=true
                     :outlined=false
                     :small=true
                     :hover=true
                     :dark=false
                     :fixed=false
                     :foot-clone=false
                     :items="table.items"
                     :fields="table.fields">

                <template #cell(value)="row">
                  <span v-if="row.item.meta.inputType=='OPTIONS'">
                    {{row.item.config.value|display(row.item.meta.options)}}
                  </span>
                  <span v-else-if="row.item.meta.inputType=='COLOR'">
                     <v-swatches
                        :value="row.item.config.value"
                        show-fallback
                        popover-x="left"
                        disabled
                        swatch-size="10"

                        :trigger-style="{ width: '25px', height: '25px', 'border-radius' : '8px' }"
                      ></v-swatches>
                  </span>
                  <span v-else>{{row.item.config.value}}</span>
                </template>
                <template #cell(actions)="row">
                  <b-button size="sm"@click="editItem(row.item, row.index, $event.target)"  
                     v-tooltip="row.item.message" variant="outline-primary">
                     <i class="fas fa-edit"></i>
                  </b-button>
                </template>


            </b-table>
        </b-card>
          

        <div class="row">
            <div class="col-md-12">
                <div class="main-card mb-3 card">

                </div>
            </div>

        </div>


        <b-modal v-if="oneItem" :id="modelName" :title="'Update Property '" size="md"
        @hidden="cancelItem">

                <div class="form-row">
                      <input name="agent_name" id="examplePassword"
                       placeholder="John Doe" type="text"
                        class="form-control" v-model="oneItem.meta.title" readonly>
                </div>
                <br/>

               <div  v-if="oneItem.meta.inputType=='OPTIONS'" class="form-row">                    
                  <b-form-group
                    :label="oneItem.meta.description"
                    v-slot="{ ariaDescribedby }"
                  >
                    <b-form-radio-group
                      id="btn-radios-2"
                      v-model="oneItem.config.value"
                      :options="oneItem.meta.options"
                      html-field="label"
                      text-field="value"

                      :aria-describedby="ariaDescribedby"
                      button-variant="outline-primary"
                      size="sm"
                      name="radio-btn-outline"
                      buttons
                    ></b-form-radio-group>
                  </b-form-group>


                </div>
                <div  v-else-if="oneItem.meta.inputType=='COLOR'" class="form-row"> 
                      <v-swatches class="d-flex justify-content-center"
                        v-model="oneItem.config.value"
                        show-fallback
                        fallback-input-class="swatches-fallback-input-class"
                        inline
                        :swatches="[
                          '#1FBC9C','#1CA085','#2ECC70','#27AF60', '#3398DB', '#2980B9', '#A463BF', '#8E43AD',
                          '#3D556E','#222F3D','#F2C511','#F39C19', '#E84B3C', '#C0382B', '#DDE6E8', '#BDC3C8',
                          '#4b56c0','#ffc976', '#40a6db', '#f1a948' ,'#db3a70', '#25d366', '#00BFFF', '#4267b2',
                        ]"
                        :swatch-style="{ margin: '5px'}"
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
                          name="password" id="examplePassword" :disabled="!(isChanged)"
                          class="form-control btn btn-primary">Save</button>
                        </div>
                  </template>

        </b-modal>


    </div>
</template>

<script>

    import PageTitle from "../Components/PageTitle.vue";
    import { MyFlags,MyDict,MyConst } from './../../services/global';

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
            heading: 'Agent Panel Setup',
            subheading: 'Control Agent Panel setting',
            icon: 'pe-7s-users icon-gradient bg-happy-itmeo fa fa-tools',
            actions : [],
            table : {
              fields: [ 
                { key : 'meta.title', label : "Property" },
                { key : 'value', label : "Value" },
                //{ key : 'config.value', label : "Value" },
                { key : 'config.description', label : "Desc" },
                { key : 'actions', label : "Action" }],
              items : [],
              perPage: 25,
              currentPage: 1,
              rows : 0
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
            let resp = await this.$store.dispatch('GetConfigs');
            this.table.items = resp.results;
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
  }
</style>
