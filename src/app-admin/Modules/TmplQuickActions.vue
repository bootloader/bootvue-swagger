<template>
    <div>
        <page-title :heading=heading :subheading=subheading :icon=icon :actions=actions></page-title>

        <div class="row">
            <div class="col-md-12">
                <div class="main-card mb-3 card">
                  <ValidationObserver ref="form">
                    <div class="card-body"><h5 class="card-title">{{newQReps.id ? 'Edit' : 'Add' }} Quick Actions </h5>                    
                            <div class="position-relative form-group">
                              <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Category</label>
                                    <input name="category" id="examplePassword"
                                     placeholder="transaction" type="text"
                                      class="form-control" v-model="newQReps.category">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                            <div class="position-relative form-group">
                               <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Title</label>
                                    <input name="agent_name" id="examplePassword"
                                     placeholder="Send Last Invoice" type="text"
                                      class="form-control" v-model="newQReps.title">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                            <div class="position-relative form-group">
                               <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Action Event</label>
                                    <input name="agent_name" id="examplePassword"
                                     placeholder="eg:- SEND_INVOICE" type="text"
                                      class="form-control" v-model="newQReps.action">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>


                            <div class="text-center form-group">
                              <button @click="cancelReps"
                                class="btn btn-warning">Cancel</button>
&nbsp;
                              <button v-if="newQReps.id"  @click="creatQuickReps"
                                class="btn btn-primary">Update</button>
&nbsp;
                              <button v-if="!newQReps.id"  @click="creatQuickReps"
                                class="btn btn-primary">Create</button>

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
              "action" : ""            };
    }
    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,
        },
        data: () => ({
            heading: 'Quick Actions',
            subheading: 'Once created, can be used by Agent',
            icon: 'pe-7s-browser icon-gradient bg-tempting-azure',
            actions : [],
            fields: [ { key : 'category', label : "Category" }, { key : 'title', label : "Title" }, 
              { key : 'action', label : "Action Event Name" },
              { key: 'actions', label: 'Options' }],
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
              return (this.$store.getters.StateQAxns || []).map(function (op) {
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
            await this.$store.dispatch('GetQuickAxns');
          },
          async creatQuickReps () {
            let success = await this.$refs.form.validate();
            if(success === true){
              await this.$store.dispatch('CreatQuickAxns', this.newQReps);
              this.newQReps = newQReps();
              this.$refs.form.reset();
            }
          },
          async deleteReps(item) {
             await this.$store.dispatch('DeleteQuickAxns', item);
          }, 
          async cancelReps(item) {
             this.newQReps = newQReps();
          }, 
          async editReps(item) {
              this.newQReps = newQReps();
              this.newQReps.id = item.id;
              this.newQReps.category = item.category;
              this.newQReps.title = item.title;
              this.newQReps.action = item.action;
              
             //await this.$store.dispatch('DeleteQuickReps', item);
          },
          rowClass(item, type) {
            if (!item || type !== 'row') return
            if (this.newQReps.id == item.id) return 'table-success'
          }
        }


    }
</script>
