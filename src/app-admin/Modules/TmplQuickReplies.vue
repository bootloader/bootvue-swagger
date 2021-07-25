<template>
    <div>
        <page-title :heading=heading :subheading=subheading :icon=icon :actions=actions
        @action="onAction" ></page-title>

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
          

        <b-modal v-if="newItem" :id="modelName" :title="(newItem.id ? 'Edit' : 'Add') + ' Quick Reply '" size="xl"
        @hidden="cancelReps">


                  


                  <ValidationObserver ref="form">
                            <div class="position-relative form-group">
                              <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Category</label>
                                    <input name="category" id="examplePassword"
                                     placeholder="greeting" type="text"
                                      class="form-control" v-model="newItem.category">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                            <div class="position-relative form-group">
                               <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Title</label>
                                    <input name="agent_name" id="examplePassword"
                                     placeholder="Hello User" type="text"
                                      class="form-control" v-model="newItem.title">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                            <div class="row">
                           <div class="position-relative form-group col-md-6">
                               <ValidationProvider v-slot="v" >
                                    <label for="examplePassword" class="">Template</label>
                                    <text-complete v-model="newItem.template" 
                                      :placeholder="'eg: Hello {{contact.name}}'"
                                      :rows="12"
                                      areaClass="form-control" :strategies="strategies"></text-complete>
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>
                            <div class="position-relative form-group col-md-6">
                                <label for="examplePassword" class="">Template Preview</label>
                                <textarea name="template" id="examplePassword" rows=10 readonly="readonly" 
                                  type="text"
                                  class="form-control" v-model="templatePreview">
                                </textarea>
                            </div>
                        </div> 

                  </ValidationObserver>

                  <template #modal-footer>
                      <div class="text-center form-group">
                        <button @click="cancelReps"
                          class="btn btn-warning">Cancel</button>
&nbsp;
                        <button v-if="newItem.id"  @click="creatQuickReps" :disabled="!isChanged"
                          class="btn btn-primary">Update</button>
&nbsp;
                        <button v-if="!newItem.id"  @click="creatQuickReps" :disabled="!isChanged"
                          class="btn btn-primary">Create</button>
                      </div>
                  </template>

        </b-modal>


    </div>
</template>

<script>

    import PageTitle from "../Components/PageTitle.vue";

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUsersSlash,faUsers,faTrash,faEye
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import mustache from 'mustache';
    import formatters from './../../services/formatters';

    import TextComplete from 'v-textcomplete'

    library.add(
        faUsersSlash,faUsers,faTrash,faEye
    );

    function newItem() {
      return {
              "category": "",
              "title": "",
              "template" : ""            };
    }

    var sampleJson = {
        contact : {
          name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
        }
    };

    var sampleJsonKeys = formatters.keys(sampleJson);

    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,TextComplete
        },
        data: () => ({
            heading: 'Quick Replies',
            subheading: 'are prompt suggestion shown to Agent for Quick response.',
            icon: 'pe-7s-browser icon-gradient bg-tempting-azure fa fa-reply-all',
            actions : [{
              label : "Add Quick Reply", icon : "plus", name : "ADD_ITEM"
            }],
            fields: [ { key : 'category', label : "Category" }, { key : 'title', label : "Title" }, 
              { key: 'actions', label: 'Actions' }],
            newItem : newItem(),
            sample : sampleJson,
            modelName :  "MODAL_ADD_QUICK_REPLIES",
            strategies: [{
              match: /(^|\s)\{\{([a-z0-9+\-\_\.]*)$/,
              search(term, callback) {
                callback(sampleJsonKeys.filter(function (name) {
                  return name.startsWith(term);
                }).slice(0, 10))
              },
              template(name) {
                return name;
              },
              replace(value) {
                return '$1{{' + value + '}} '
              },
            }]
        }),
        computed : {
            teams : function (argument) {
              var THAT = this;
              return (this.$store.getters.StateQReps || []).map(function (op) {
                  op.message = mustache.render(op.template || op.message || op.title || '', THAT.sample) || op.title;
                  return op;
              });
            },
            templatePreview : function (argument) {
              if(!this.newItem.template)
                  return this.newItem.template;
              try {
                  return mustache.render(this.newItem.template, this.sample);
              } catch (e){
                  return this.newItem.template
              }
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
            await this.$store.dispatch('GetQuickReps');
          },
          async creatQuickReps () {
            let success = await this.$refs.form.validate();
            if(success === true){
              await this.$store.dispatch('CreatQuickReps', this.newItem);
              this.newItem = newItem();
              this.$refs.form.reset();
              this.onAction({name : "CANCEL"});
            }
          },
          async deleteReps(item) {
             await this.$store.dispatch('DeleteQuickReps', item);
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
              this.newItem.message = item.message;
              this.newItem.template = item.template;

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
