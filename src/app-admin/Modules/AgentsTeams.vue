<template>
    <div>
      <master-view id="agent-session-list" 
      :header="{
          heading: heading,
          subheading: subheading,
          icon: icon,
      }"
      :table="{
        ...table,
        items :teams
      }"
      :actions=actions
      :filters="[{ label : 'Show In-Active', name : 'showInActive'}]"
      :busy="table.busy"
      @action="onAction">

      <template #filter(showInActive)="{filter}">
        <base-checkbox type="danger" v-model="includeInActive" class="m-2"> {{filter.label}}</base-checkbox>
      </template>

        <template #cell(actions)="row">
            <b-button size="sm" @click="enableTeam(row.item, row.index, $event.target)" variant="outline-primary"
              v-tooltip="row.item.isactive == 'Y' ? 'De-Activate' : 'Activate'">
                  <i class="fas fa-users" :class="{
                    'fa-x' : (row.item.isactive != 'Y')
                  }"></i>
            </b-button>&nbsp;
            <button type="button" class="btn btn-outline-primary btn-sm" @click="setItemDefault(row.item, row.index, $event.target)"
              v-tooltip="'Make Default Assignee'">
              <span v-if="!row.item.defaultValue" class="far fa-star"/>
              <span v-if="row.item.defaultValue" class="fas fa-star"/>
            </button>
          </template>

      </master-view>

        <b-modal v-if="newItem" :id="modelName" :title="(newItem.id ? 'Edit' : 'Add') + ' Team '"
        @hidden="cancelReps">
            <ValidationObserver ref="form">
                <div class="position-relative form-group">
                  <ValidationProvider v-slot="v" rules="required">
                        <label for="examplePassword" class="">Name</label>
                        <input name="agent_name" id="examplePassword"
                          placeholder="Online Team" type="text" autocomplete="off"
                          class="form-control" v-model="newItem.name">
                          <span class="v-input-error">{{ v.errors[0] }}</span>
                  </ValidationProvider>
                </div>

                <base-input prepend="@" format-filter="item_code" :format-value="newItem.name" format-live
                      v-model="newItem.code" label="Code" autocomplete="off"
                      placeholder="ONLINE,BILLING">
                </base-input>

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

    import PageTitle from "../Components/PageTitle.vue";

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
            subheading: 'can be used to handle chats in organized way',
            icon: 'pe-7s-network icon-gradient bg-tempting-azure fa fa-users',
            actions : [{
              label : "Add Team", icon : "plus", name : "ADD_ITEM"
            }],
            table : {
              fields: [ { key : 'name', label : "Name" }, { key : 'code', label : "Code" }, 
                //{ key : 'dept_email', label : "Email" },
                { key: 'actions', label: 'Actions' }],
              busy : false,
              sortBy: 'name',
            },
            newItem : newItem(),
            modelName :  "MODAL_ADD_TEAM",
            includeInActive : false,
        }),
        computed : {
            teams (){
              let includeInActive = this.includeInActive;
              return (this.$store.getters.StateApi.AdminsDept || []).filter(function(dept){
                  return includeInActive || (dept.isactive =="Y")
              });
            },
            isChanged :  function (argument) {
              return this.oldHash !== JSON.stringify(this.newItem);
            } 
        },
        created : function (argument) {
          this.loadAgentTeams(true);
        },
        methods : {
          async loadAgentTeams (loader){
            try {
              this.table.busy = true && loader;
              return await this.$service.getX('/api/admins/dept',{
                includeInActive : true
              },{refresh :  true});
            } finally {
              this.table.busy = false && loader;
            }
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
              await this.loadAgentTeams();
          },
          async setItemDefault(item) {
             await this.$store.dispatch('SetTeamsDefault', item);
             await this.loadAgentTeams();
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
