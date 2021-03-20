<template>
    <div>
        <page-title :heading=heading :subheading=subheading :icon=icon :actions=actions></page-title>

        <div class="row">
            <div class="col-md-12">
                <div class="main-card mb-3 card">
                  <ValidationObserver ref="form">
                    <div class="card-body"><h5 class="card-title">Add Quick Reply </h5>                    
                            <div class="position-relative form-group">
                              <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Category</label>
                                    <input name="category" id="examplePassword"
                                     placeholder="greeting" type="text"
                                      class="form-control" v-model="newQReps.category">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                            <div class="position-relative form-group">
                               <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Title</label>
                                    <input name="agent_name" id="examplePassword"
                                     placeholder="Hello User" type="text"
                                      class="form-control" v-model="newQReps.title">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                            <div class="row">
                           <div class="position-relative form-group col-md-6">
                               <ValidationProvider v-slot="v" >
                                    <label for="examplePassword" class="">Template</label>
                                    <textarea name="template" id="examplePassword" rows="10"
                                     :placeholder="'Hello {{contact.name}}'" type="text"
                                      class="form-control" v-model="newQReps.template">
                                    </textarea>
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>
                            <div class="position-relative form-group col-md-6">
                                <label for="examplePassword" class="">Template Preview</label>
                                <textarea name="template" id="examplePassword" rows="10" readonly="readonly" 
                                  type="text"
                                  class="form-control" v-model="templatePreview">
                                </textarea>
                            </div>
                             </div> 
 


                            <div class="position-relative form-group">
                              <button @click="creatQuickReps"
                                name="password" id="examplePassword"
                                class="form-control btn btn-primary">Create</button>
                            </div>
                           
                    </div>
                  </ValidationObserver>
                </div>
            </div>
        </div>


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
                     :fields="fields">

                <template #cell(actions)="row">
                  <b-button size="sm" @click="deleteReps(row.item, row.index, $event.target)" variant="outline-primary">
                    <font-awesome-icon icon="trash" title="Delete"/>
                  </b-button>
                  &nbsp;
                  <b-button size="sm" v-tooltip="row.item.message" variant="outline-primary">
                     <font-awesome-icon icon="eye" title="View"/>
                  </b-button>                                
                </template>

            </b-table>
        </b-card>
          

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

    library.add(
        faUsersSlash,faUsers,faTrash,faEye
    );

    function newQReps() {
      return {
              "category": "",
              "title": "",
              "template" : ""            };
    }
    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,
        },
        data: () => ({
            heading: 'Quick Replies',
            subheading: 'Once created, can be used by Agent',
            icon: 'pe-7s-browser icon-gradient bg-tempting-azure',
            actions : [],
            fields: [ { key : 'category', label : "Category" }, { key : 'title', label : "Title" }, 
              { key: 'actions', label: 'Actions' }],
            newQReps : newQReps(),
            sample : {
              contact : {
                name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
              }
            }
        }),
        computed : {
            teams : function (argument) {
              var THAT = this;
              return (this.$store.getters.StateQReps || []).map(function (op) {
                  console.log("=====",op)
                  op.message = mustache.render(op.template || op.message || op.title || '', THAT.sample) || op.title;
                  return op;
              });
            },
            templatePreview : function (argument) {
              if(!this.newQReps.template)
                  return this.newQReps.template;
              try {
                  return mustache.render(this.newQReps.template, this.sample);
              } catch (e){
                  return this.newQReps.template
              }
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
              await this.$store.dispatch('CreatQuickReps', this.newQReps);
              this.newQReps = newQReps();
              this.$refs.form.reset();
            }
          },
          async deleteReps(item) {
             await this.$store.dispatch('DeleteQuickReps', item);
          }
        }


    }
</script>
