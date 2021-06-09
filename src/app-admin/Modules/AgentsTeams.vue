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
                     :items="teams"
                     :fields="fields">

                <template #cell(actions)="row">
                  <b-button size="sm" @click="enableTeam(row.item, row.index, $event.target)" variant="outline-primary"
                    v-tooltip="row.item.isactive == 'Y' ? 'De-Activate' : 'Activate'" class="fa-stack fa-1x">
                      <i class="fas fa-users fa-stack-1x"></i>
                      <i v-if="row.item.isactive != 'Y'" class="fas fa-slash fa-stack-1x" style="color:Tomato"></i>
                  </b-button>&nbsp;
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="setItemDefault(row.item, row.index, $event.target)"
                    v-tooltip="'Make Default Assignee'">
                    <span v-if="!row.item.defaultValue" class="far fa-star"/>
                    <span v-if="row.item.defaultValue" class="fas fa-star"/>
                  </button>
                </template>

            </b-table>
        </b-card>
          

        <div class="row">
            <div class="col-md-12">
                <div class="main-card mb-3 card">

                </div>
            </div>

        </div>


        <b-modal v-if="newItem" :id="modelName" :title="(newItem.id ? 'Edit' : 'Add') + ' Team '"
        @hidden="cancelReps">
                  <ValidationObserver ref="form">
                            <div class="position-relative form-group">
                              <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Name</label>
                                    <input name="agent_name" id="examplePassword"
                                     placeholder="Online Team" type="text"
                                      class="form-control" v-model="newItem.name">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>

                            <div class="position-relative form-group">
                                <label for="exampleEmail" class="">Code</label>
                                <div class="input-group">
                                    <div class="input-group-prepend"><span class="input-group-text">@</span></div>
                                    <input placeholder="ONLINE,BILLING" type="text" class="form-control" v-model="newItem.code">
                                </div>
                            </div>
 


                  </ValidationObserver>

                  <template #modal-footer>
                      <div class="position-relative form-group">
                        <button @click="createTeam"
                          name="password" id="examplePassword" :disabled="!isChanged"
                          class="form-control btn btn-primary">Create</button>
                        </div>
                  </template>

        </b-modal>


    </div>
</template>

<script>

    import PageTitle from "../Layout/PageTitleAction.vue";

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUsersSlash,faUsers,faStar
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

    library.add(
        faUsersSlash,faUsers,faStar
    );

    function newItem() {
      return {
              "code": "",
              "dept_email": "",
              "id" : null,
              "name": ""
            };
    }
    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,
        },
        data: () => ({
            heading: 'Teams',
            subheading: 'Once created, can be used to assign to Agent',
            icon: 'pe-7s-network icon-gradient bg-tempting-azure fa fa-users',
            actions : [{
              label : "Add Team", icon : "plus", name : "ADD_ITEM"
            }],
            fields: [ { key : 'name', label : "Name" }, { key : 'code', label : "Code" }, 
              //{ key : 'dept_email', label : "Email" },
              { key: 'actions', label: 'Actions' }],
            newItem : newItem(),
            modelName :  "MODAL_ADD_TEAM",
        }),
        computed : {
            teams : function (argument) {
              return this.$store.getters.StateTeams
            },
            isChanged :  function (argument) {
              return this.oldHash !== JSON.stringify(this.newItem);
            } 
        },
        created : function (argument) {
          this.loadAgentTeams();
        },
        methods : {
          async loadAgentTeams (){
            await this.$store.dispatch('GetTeams');
          },
          async createTeam () {
            await this.$store.dispatch('CreatTeam', this.newItem);
            this.newItem = newItem();
            this.$refs.form.reset();
            this.onAction({name : "CANCEL"});
          },
          async enableTeam(item) {
             item.isactive = item.isactive == "Y" ? "N" : "Y";
             await this.$store.dispatch('CreatTeam', item);
          },
          async setItemDefault(item) {
             await this.$store.dispatch('SetTeamsDefault', item);
          },
          async cancelReps(item) {
             this.newItem = newItem();
             this.onAction({name : "CANCEL"});
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
