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
                     :items="items"
                     :fields="fields">

                <template #cell(actions)="row">
                  <b-button size="sm" @click="enableItem(row.item, row.index, $event.target)" variant="outline-primary"
                    v-tooltip="row.item.isactive == 'Y' ? 'De-Activate' : 'Activate'">
                    <font-awesome-icon v-if="row.item.isactive == 'Y'" icon="user" />
                    <font-awesome-icon v-if="row.item.isactive != 'Y'" icon="user-slash"/>
                  </b-button>
                  &nbsp;
                  <b-button size="sm" @click="enableItemAdmin(row.item, row.index, $event.target)" 
                  v-bind:class=" { 'disabled' : !row.item.admin }"
                  variant="outline-primary"
                  v-tooltip="!row.item.admin ? 'Make Admin' : 'Remove Admin Access'" acitve=false>
                    <font-awesome-icon icon="user-cog"/>
                  </b-button>
                  &nbsp;
                 <button type="button" class="btn btn-outline-primary btn-sm" @click="setItemDefault(row.item, row.index, $event.target)"
                  v-tooltip="'Make Default Assignee'" >
                    <span v-if="!row.item.defaultValue" class="far fa-star" />
                    <span v-if="row.item.defaultValue" class="fas fa-star" />
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


        <b-modal v-if="newItem" :id="modelName" :title="(newItem.id ? 'Edit' : 'Add') + ' User '" size="lg"
        @hidden="cancelItem">

                  <ValidationObserver ref="form">
                          <div class="row">
                             <div class="position-relative form-group col-md-6">
                                <ValidationProvider v-slot="v" rules="required">
                                      <label for="examplePassword" class="">Name</label>
                                      <input name="agent_name" id="examplePassword"
                                       placeholder="John Doe" type="text"
                                        class="form-control" v-model="newItem.agent_name">
                                        <span class="v-input-error">{{ v.errors[0] }}</span>
                                </ValidationProvider>
                                </div>

                              <div class="position-relative form-group col-md-6">
                                <ValidationProvider v-slot="v" rules="required|email">
                                  <label for="exampleEmail" class="">Email</label>
                                  <input name="email"
                                          id="exampleEmail"
                                          placeholder="abc@xyz.com"
                                          type="email"
                                          class="form-control" v-model="newItem.agent_email">
                                   <span class="v-input-error" >{{ v.errors[0] }}</span>
                                </ValidationProvider>
                              </div>
                            </div>


                            <div class="row">
                              <div class="position-relative form-group col-md-6">
                                  <label for="exampleEmail" class="">Username</label>
                                  <div class="input-group">
                                      <div class="input-group-prepend"><span class="input-group-text">@</span></div>
                                      <input placeholder="john,sam2" type="text" class="form-control" v-model="newItem.agent_code">
                                  </div>
                              </div>

                              <div class="position-relative form-group col-md-6">
                                <label for="examplePassword" class="">Password</label><input
                                  name="password" id="examplePassword" placeholder="password" type="password"
                                  class="form-control" v-model="newItem.agent_password">
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="position-relative form-group"><label for="exampleSelect" class="">Team</label>
                                  <select name="select" id="exampleSelect" class="form-control"
                                    v-model="newItem.dept_id">
                                      <option v-for="team in teams"
                                      v-if="team.isactive=='Y'" :value=team.dept_id>
                                      {{team.dept_name}}</option>
                                    </select>
                                </div>

                                <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
                                  v-model="newItem.admin">
                                <label class="form-check-label" for="flexSwitchCheckDefault">Admin Access</label>
                              </div>

                              </div>
                               <div class="col-md-6">
                                  <div class="position-relative form-group">
                                    <label for="exampleCustomMutlipleSelect" class="">Channels</label>
                                    <select multiple="" type="select" id="exampleCustomMutlipleSelect"
                                             name="customSelect" class="custom-select"
                                             v-model="newItem.agent_channels_list">
                                            <option>WHATSAPP</option>
                                            <option>FACEBOOK</option>
                                            <option>TWITTER</option>
                                            <option>TELEGRAM</option>
                                            <option>WEBSITE</option>
                                    </select>
                                </div>
                               </div>


                              

                            </div>


         


 
                  </ValidationObserver>

                  <template #modal-footer>
                      <div class="position-relative form-group">
                        <button @click="createItem"
                          name="password" id="examplePassword" :disabled="!(isChanged && isValid)"
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
        faUserSlash,faUser,faUserSecret,faUserCog
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

    library.add(
        faUserSlash,faUser,faUserSecret,faUserCog
    );

    function newItem() {
      return {
              "agent_code": "",
              "agent_email": "",
              "agent_id" : null,
              "agent_channels_list": [],"agent_channels" : "", admin : false
            };
    }
    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,
        },
        data: () => ({
            heading: 'Users',
            subheading: 'List of all users',
            icon: 'pe-7s-users icon-gradient bg-happy-itmeo',
            actions : [{
              label : "Add User", icon : "plus", name : "ADD_ITEM"
            }],
          fields: [ { key : 'dept.dept_name', label : "Dept" },{ key : 'agent_name', label : "Name" },
           { key : 'agent_code', label : "Username" }, { key : 'agent_email', label : "Email" },
           { key : 'agent_channels', label : "Channels", class : "upper-case" },
           { key : 'actions', label : "Action" }],
            newItem : newItem(),
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
              return this.oldHash !== JSON.stringify(this.newItem);
            },
            isValid : function (argument) {
              return this.newItem.agent_name && this.newItem.agent_code && this.newItem.agent_email;
            }
        },
        created : function (argument) {
          this.loadAgents();
          this.loadAgentTeams()
        },
        methods : {
          async loadAgents (){
            await this.$store.dispatch('GetAgents');
          },
          async loadAgentTeams (){
            await this.$store.dispatch('GetTeams');
          },
          async createItem () {
            let success = await this.$refs.form.validate();
            if(success === true){
              await this.$store.dispatch('CreateAgent', this.newItem);
              this.newItem = newItem();
              this.$refs.form.reset();
              this.onAction({name : "CANCEL"});
            }
          },
          async enableItem(item) {
              await this.$store.dispatch('DeActivateAgent',item);
          },
          async enableItemAdmin(item) {
              await this.$store.dispatch('DeAdminAgent',item);
          },
          async setItemDefault(item) {
             await this.$store.dispatch('SetAgentDefault', item);
          },
          async cancelItem(item) {
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
