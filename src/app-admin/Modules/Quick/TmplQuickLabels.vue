<template>
    <div>
        <page-title :heading=heading :subheading=subheading :icon=icon :actions=actions
        @action="onAction"
        ></page-title>

          <b-card title="" class="main-card mb-4">
            <b-table :striped=true
                     :bordered=true
                     :outlined=false
                     :small=true
                     :hover=true
                     :dark=false
                     :fixed=false
                     :foot-clone=false
                     :items="teams"
                     :fields="fields"
                     :tbody-tr-class="rowClass">

                <template #cell(actions)="row">
                  <b-button size="sm" @click="deleteReps(row.item, row.index, $event.target)" variant="outline-primary">
                    <font-awesome-icon icon="trash" title="Delete"/>
                  </b-button>
                  &nbsp;
                  <b-button size="sm"@click="editReps(row.item, row.index, $event.target)"   v-tooltip="row.item.message" variant="outline-primary">
                     <font-awesome-icon icon="eye" title="View"/>
                  </b-button>                                
                </template>

            </b-table>
        </b-card>
        



        <b-modal v-if="newItem" :id="modelName" :title="(newItem.id ? 'Edit' : 'Add') + ' Customer Labels '"
        @hidden="cancelReps">
                  <ValidationObserver ref="form">
                            <div class="position-relative form-group">
                              <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Category</label>
                                    <input name="category" id="examplePassword" 
                                     placeholder="eg : country, customerType" type="text"
                                      class="form-control" v-model="newItem.category">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                            <div class="position-relative form-group">
                               <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Title</label>
                                    <input name="agent_name" id="examplePassword" autocomplete="off"
                                     placeholder="eg: Platiinum, Verified, India" type="text"
                                      class="form-control" v-model="newItem.title">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                            <base-input format-filter="item_code" :format-value="newItem.title" format-live
                                  v-model="newItem.code" label="Label Code" autocomplete="off" rules="required"
                                  placeholder="eg:- PLATINUM, VERFD, IND">
                            </base-input>

                  </ValidationObserver>

                  <template #modal-footer>

                        <button @click="cancelReps" class="btn btn-warning">Cancel</button>
            &nbsp;
                        <button v-if="newItem.id"  @click="creatQuickReps" :disabled="!isChanged"
                                            class="btn btn-primary">Update</button>
            &nbsp;
                        <button v-if="!newItem.id"  @click="creatQuickReps" :disabled="!isChanged"
                                            class="btn btn-primary">Create</button>


                  </template>

        </b-modal>


    </div>
</template>

<script>

    import PageTitle from "../../Components/PageTitle.vue";
    
    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUsersSlash,faUsers,faTrash,faEye
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import mustache from 'mustache';

    library.add(
        faUsersSlash,faUsers,faTrash,faEye
    );

    function newItem() {
      return {
              "category": "",
              "title": "",
              "code" : ""            };
    }
    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,
        },
        data: () => ({
            heading: 'Customer Labels',
            subheading: 'Assign Customer specific labels that your agent can use',
            icon: 'pe-7s-browser icon-gradient bg-tempting-azure fa fa-user-tag',
            actions : [{
              label : "Add Customer Labels", icon : "plus", name : "ADD_ITEM"
            }],
            fields: [ { key : 'category', label : "Category" }, { key : 'title', label : "Title" }, 
              { key : 'code', label : "Code" },
              { key: 'actions', label: 'Options' }],
            newItem : newItem(),
            sample : {
              contact : {
                name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
              }
            },
            modelName :  "MODAL_ADD_QUICK_LABEL",
        }),
        computed : {
            teams : function (argument) {
              return this.$store.getters.StateQLabels;
            },
            isChanged :  function (argument) {
              return this.oldHash !== JSON.stringify(this.newItem);
            } 
        },
        created : function (argument) {
          this.loadQReps();
        },
        methods : {
          async loadQReps (){
            await this.$store.dispatch('LoadQuickLabels');
          },
          async creatQuickReps () {
            let success = await this.$refs.form.validate();
            if(success === true){
              await this.$store.dispatch('CreatQuickLabels', this.newItem);
              this.newItem = newItem();
              this.$refs.form.reset();
              this.onAction({name : "CANCEL"});
            }
          },
          async deleteReps(item) {
             await this.$store.dispatch('DeleteQuickLabels', item);
          }, 
          async cancelReps(item) {
             this.newItem = newItem();
             this.onAction({name : "CANCEL"});
          }, 
          async editReps(item) {
              this.newItem = newItem();
              this.newItem.id = item.id;
              this.newItem.category = item.category;
              this.newItem.title = item.title;
              this.newItem.code = item.code;
              this.onAction({name : "EDIT_ITEM"});
             //await this.$store.dispatch('DeleteQuickReps', item);
          },
          rowClass(item, type) {
            if (!item || type !== 'row') return
            if (this.newItem.id == item.id) return 'table-success'
          },
          onAction : function (argument) {
            switch(argument.name){
              case "ADD_ITEM" :
                this.oldHash = JSON.stringify(this.newItem);
                this.$bvModal.show(this.modelName)
                console.log("ADD_ITEM",argument);
                break;
              case "EDIT_ITEM" :
              this.oldHash = JSON.stringify(this.newItem);
                this.$bvModal.show(this.modelName)
                console.log("ADD_ITEM",argument);
                break;
              case "CANCEL" :
                this.$bvModal.hide(this.modelName)
                break;
              default:
                console.log("NoMapping",argument) 
            }
          }
        }


    }
</script>
