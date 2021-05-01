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
          

        <b-modal v-if="newItem" :id="modelName" :title="(newItem.id ? 'Edit' : 'Add') + ' Quick Media '" size="lg"
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

                            <div class="position-relative form-group">
                               <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">URL</label>
                                    <input name="url" id="examplePassword"
                                     placeholder="https://url.com/image.png" type="text"
                                      class="form-control" v-model="newItem.url">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                            <div class="row">
                           <div class="position-relative form-group col-md-12">
                            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
                          
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

    import PageTitle from "../Layout/PageTitleAction.vue";

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUsersSlash,faUsers,faTrash,faEye
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import mustache from 'mustache';
    import vue2Dropzone from 'vue2-dropzone'
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'

    library.add(
        faUsersSlash,faUsers,faTrash,faEye
    );

    function newItem() {
      return {
              "category": "",
              "title": "",
              "template" : "", url : "",         };
    }
    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,
              vueDropzone: vue2Dropzone
        },
        data: () => ({
            heading: 'Quick Media',
            subheading: 'Once created, can be used by Agent',
            icon: 'pe-7s-browser icon-gradient bg-tempting-azure',
            actions : [{
              label : "Add Quick Media", icon : "plus", name : "ADD_ITEM"
            }],
            fields: [ { key : 'category', label : "Category" }, { key : 'title', label : "Title" }, 
              { key: 'actions', label: 'Actions' }],
            newItem : newItem(),
            sample : {
              contact : {
                name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
              }
            },
            modelName :  "MODAL_ADD_QUICK_MEDIA",
            dropzoneOptions: {
              url: 'https://httpbin.org/post',
              thumbnailWidth: 150,
              maxFilesize: 0.5, maxFiles : 1,
              headers: { "My-Awesome-Header": "header value" }
            }
        }),
        computed : {
            teams : function (argument) {
              var THAT = this;
              return (this.$store.getters.StateQMeds || []).map(function (op) {
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
            await this.$store.dispatch('GetQuickMeds');
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
              this.newItem.url = item.url;

              this.onAction({name : "EDIT_ITEM"});
             //await this.$store.dispatch('DeleteQuickReps', item);
          },
          rowClass(item, type) {
            if (!item || type !== 'row') return
            if (this.newItem.name == item.name) return 'table-success'
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
