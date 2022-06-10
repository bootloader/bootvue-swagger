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
                <template #cell(title)="row">
                  <my-icon type="fileType" :value="row.item.type"/>
                  {{row.item.title}}
                </template>

                <template #cell(actions)="row">
                  <b-button size="sm" @click="deleteItem(row.item, row.index, $event.target)" variant="outline-primary">
                    <font-awesome-icon icon="trash" title="Delete"/>
                  </b-button>
                  &nbsp;
                  <b-button size="sm" @click="editItem(row.item, row.index, $event.target)"   v-tooltip="row.item.message" variant="outline-primary">
                     <font-awesome-icon icon="eye" title="View"/>
                  </b-button>                                
                </template>

            </b-table>
        </b-card>
          

        <b-modal v-if="newItem" :id="modelName" :title="(newItem.id ? 'Edit' : 'Add') + ' Quick Media '" size="lg"
        @hidden="cancelItem">
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

                            <base-input prepend="</>" format-filter="item_code" :format-value="newItem.title" format-live
                              v-model="newItem.code" label="Code" autocomplete="off"
                              placeholder="ONLINE,BILLING">
                            </base-input>

                            <div v-if="newItem.id" class="row">
                                <MyMedia
                                  :src="newItem.url" 
                                  width="100%"
                                  auto
                                  :type="newItem.type"
                                ></MyMedia>
                                <!-- <img :src="newItem.url"  class="position-relative form-group col-md-12"> -->
                            </div>

                            <div v-if="!newItem.id" class="row">
                              <div class="position-relative form-group col-md-12">
                                <vue-dropzone ref="myVueDropzone"
                                 id="dropzone" :options="dropzoneOptions"
                                 v-on:vdropzone-sending="sendingEvent"
                                 v-on:vdropzone-file-added="fileAdded" 
                                 v-on:vdropzone-queue-complete="fileUploaded"></vue-dropzone>
                            </div>
                        </div> 

                  </ValidationObserver>

                  <template #modal-footer>
                      <div class="text-center form-group">
                        <button @click="cancelItem"
                          class="btn btn-warning">Cancel</button>
&nbsp;
                        <button v-if="newItem.id"  @click="updateItem" :disabled="!isChanged"
                          class="btn btn-primary">Update</button>
&nbsp;
                        <button v-if="!newItem.id"  @click="createItem" :disabled="!isChangedAndAdded"
                          class="btn btn-primary">Upload</button>
                      </div>
                  </template>

        </b-modal>


    </div>
</template>

<script>

    import PageTitle from "./../../Components/PageTitle.vue";

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUsersSlash,faUsers,faTrash,faEye
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import mustache from 'mustache';
    import vue2Dropzone from 'vue2-dropzone'
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'
    import { MyFlags,MyConst } from '../../../services/global';

    library.add(
        faUsersSlash,faUsers,faTrash,faEye
    );

    function newItem() {
      return {
              id : null,
              "category": "",
              "title": "", code : "",
              "template" : "", url : "",         };
    }
    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,
              vueDropzone: vue2Dropzone
        },
        data: () => ({
            heading: 'Quick Media',
            subheading: 'are media files for agents to use',
            icon: 'pe-7s-browser icon-gradient bg-tempting-azure fa fa-photo-video',
            actions : [{
              label : "Add Quick Media", icon : "plus", name : "ADD_ITEM"
            }],
            fields: [ { key : 'category', label : "Category" }, 
              { key : 'title', label : "Title" }, 
              { key : 'code', label : "Code" }, 
              { key: 'actions', label: 'Actions' }],
            newItem : newItem(),
            sample : {
              contact : {
                name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
              }
            },
            modelName :  "MODAL_ADD_QUICK_MEDIA",
            dropzoneOptions: {
              url: MyConst.context + '/api/tmpl/quickmedia',
              thumbnailWidth: 150,
              maxFilesize: 5, maxFiles : 1,
              autoProcessQueue: false
            },
            addedFileCount : 0
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
            },
            isChangedAndAdded : function (argument) {
              return (this.newItem.title) 
              && (this.newItem.category) 
              && (this.addedFileCount>0)
              && (this.$refs.myVueDropzone.getQueuedFiles().length);
            } 
        },
        created : function (argument) {
          this.loadItems();
        },
        methods : {
          async loadItems (){
            await this.$store.dispatch('GetQuickMeds');
          },
          fileAdded : function (argument) {
            this.addedFileCount++;
          },
          sendingEvent : function (file, xhr, formData) {
            formData.append('category', this.newItem.category);
            formData.append('title', this.newItem.title);
            formData.append('content', this.newItem.title);
            formData.append('code', this.newItem.code);
          },
          async fileUploaded () {
            await this.loadItems();
            this.newItem = newItem();
            this.$refs.form.reset();
            this.onAction({name : "CANCEL"});
          },
          async updateItem () {
            let success = await this.$refs.form.validate();
            if(success === true){
              await this.$store.dispatch('CreatQuickMeds', this.newItem);
              this.newItem = newItem();
              this.$refs.form.reset();
              this.onAction({name : "CANCEL"});
            }
          },
          async createItem () {
            let success = await this.$refs.form.validate();
            if(success === true){
              //console.log(this.$refs.myVueDropzone.getQueuedFiles());
             await this.$refs.myVueDropzone.processQueue();
              //await this.$store.dispatch('CreatQuickReps', this.newItem);
              //this.newItem = newItem();
              //this.$refs.form.reset();
              //this.onAction({name : "CANCEL"});
            }
          },
          async deleteItem(item) {
             await this.$store.dispatch('DeleteQuickMeds', item);
          }, 
          async cancelItem(item) {
             this.newItem = newItem();
            this.onAction({name : "CANCEL"});
          }, 
          async editItem(item) {
              this.newItem = newItem();
              this.newItem.id = item.id;
              this.newItem.category = item.category;
              this.newItem.title = item.title;
              this.newItem.code = item.code;
              this.newItem.message = item.message;
              this.newItem.template = item.template;
              this.newItem.url = item.url;

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
