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
        items :filtered
      }"
      :actions=actions
      :filters="[{ label : 'Show In-Active', name : 'showInActive'}]"
      :busy="table.busy"
      @action="onAction"
      >
        <template #filter(showInActive)="{filter}">
          <base-checkbox type="danger" v-model="includeInActive" class="m-2"> {{filter.label}}</base-checkbox>
        </template>

        <template #top-row="row">
              <b-th><input type="search" v-model="filters.deptname"  class="form-control form-control-sm" /></b-th>
              <b-th><input type="search" v-model="filters.name"  class="form-control form-control-sm" /></b-th>
              <b-th><input type="search" v-model="filters.code"  class="form-control form-control-sm" /></b-th>
              <b-th><input type="search" v-model="filters.agent_email"  class="form-control form-control-sm" /></b-th>
              <b-th>&nbsp;</b-th>
        </template>
        <template #cell(dept.name)="row">
            {{row.item.dept.name + "(" + row.item.dept.code + ")"}}
        </template>
        <template #cell(actions)="row">
          <b-button size="sm" @click="enableItem(row.item, row.index, $event.target)" variant="outline-primary"
            v-tooltip="row.item.isactive == 'Y' ? 'De-Activate' : 'Activate'" class="fa-stack fa-1x">
              <i class="fas fa-user fa-stack-1x"></i>
              <i v-if="row.item.isactive != 'Y'" class="fas fa-slash fa-stack-1x" style="color:Tomato"></i>
          </b-button>&nbsp;
          <b-button size="sm" @click="enableItemAdmin(row.item, row.index, $event.target)" 
          variant="outline-primary"
          v-tooltip="!row.item.admin ? 'Make Admin' : 'Remove Admin Access'" acitve=false class="fa-stack fa-1x"> 
              <i class="fas fa-user-cog fa-stack-1x"></i>
              <i v-if="!row.item.admin" class="fas fa-slash fa-stack-1x" style="color:Tomato"></i>
          </b-button>&nbsp;
          <button type="button" class="btn btn-outline-primary btn-sm" @click="setItemDefault(row.item, row.index, $event.target)"
          v-tooltip="'Make Default Assignee'" >
            <span v-if="!row.item.defaultValue" class="far fa-star" />
            <span v-if="row.item.defaultValue" class="fas fa-star" />
          </button>&nbsp;
          <b-button size="sm" @click="editItem(row.item, row.index, $event.target)"  
              v-tooltip="row.item.message" variant="outline-primary">
              <font-awesome-icon icon="eye" title="View"/>
          </b-button>&nbsp;
          <b-button size="sm" @click="sendReset(row.item, row.index, $event.target)"  
              v-tooltip="'Send Reset Password Email'" variant="outline-primary"  class="fa-stack fa-1x">
              <span style="font-size: .5rem;">
                <i class="fa fa-sync fa-stack-1x fa-2x"></i>
                <i class="fas fa-lock fa-stack-1x fa-sm fa-inverse text-secondary"></i>
              </span>
          </b-button>
        </template>

      </master-view>


        <b-modal v-if="newItem" :id="modelName" :title="(newItem.id ? 'Edit' : 'Add') + ' User '" size="lg"
        @hidden="cancelItem">

                  <ValidationObserver ref="form">
                          <div class="row">
                             <div class="position-relative form-group col-md-6">
                                <ValidationProvider v-slot="v" rules="required">
                                      <label for="examplePassword" class="">Name</label>
                                      <input name="agent_name" id="examplePassword"
                                       placeholder="John Doe" type="text" autocomplete="off"
                                        class="form-control" v-model="newItem.name">
                                        <span class="v-input-error">{{ v.errors[0] }}</span>
                                </ValidationProvider>
                                </div>

                              <div class="position-relative form-group col-md-6">
                                <ValidationProvider v-slot="v" rules="required|email">
                                  <label for="exampleEmail" class="">Email</label>
                                  <input name="email" autocomplete="off"
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
                                  <base-input prepend="@" 
                                    :format-value="newItem.id ? newItem.code : newItem.name" format-filter="item_code" format-live
                                    v-model="newItem.code" label="Username" :readonly="newItem.id"
                                    placeholder="john,sam2" autocomplete="off">
                                  </base-input>
                              </div>

                              <div class="position-relative form-group col-md-6">
                                <label for="examplePassword" class="">Password</label><input
                                  name="password" id="examplePassword" placeholder="password" :type="'password'"
                                  autocomplete="new-password"
                                  class="form-control" v-model="newItem.agent_password">
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="position-relative form-group"><label for="exampleSelect" class="">Team</label>
                                  <select name="select" id="exampleSelect" class="form-control" v-model="newItem.dept_id">
                                      <option v-for="team in teams" v-bind:key="team.id" :value=team.id>
                                        {{team.name}}</option>
                                  </select>
                                </div>

                                <div class="form-check form-switch">
                                  <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
                                    v-model="newItem.admin">
                                  <label class="form-check-label" for="flexSwitchCheckDefault">Admin Access</label>
                                </div>

                              </div>

                              <div class="col-md-6">
                                    <vue-tags-input
                                        v-model="labelInput"
                                        :tags="labels"
                                        :add-only-from-autocomplete="true"
                                        :autocomplete-items="quickLabels"
                                        :autocomplete-min-length="0"
                                        :placeholder="'Add Agent Skills'"
                                        @tags-changed="onLabelChange">

                                        <div slot="autocomplete-item"
                                            slot-scope="props"
                                            class="my-item"
                                            @click="props.performAdd(props.item)" >
                                        
                                            <i v-bind:style="{ 'background-color': '#' + props.item.color }">&nbsp;</i>&nbsp;

                                            <i class="material-icons" >
                                          {{ props.item.category }}
                                            </i> {{ props.item.title }}
                                        </div>


                                        <div slot="tag-left"
                                            slot-scope="props"
                                            class="my-tag-left"
                                            @click="props.performOpenEdit(props.index)">
                                            <i v-bind:style="{ 'background-color': '#' + props.tag.color }">&nbsp;</i>&nbsp;
                                        </div>

                                    </vue-tags-input>
                              </div>
                            </div>
 
                  </ValidationObserver>

                  <template #modal-footer>
                      <div class="position-relative form-group">
                        <button @click="createItem"
                          name="password" id="examplePassword" :disabled="!(isChanged && isValid)"
                          class="form-control btn btn-primary">{{ newItem.id ?`Save`:`Create`}}</button>
                        </div>

                    <div class="position-relative form-group" hidden>
                      {{newItem}}
                    </div>

                  </template>

        </b-modal>


    </div>
</template>

<script>

    import PageTitle from "../Components/PageTitle.vue";
    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import VueTagsInput from '@johmun/vue-tags-input';
    import formatters from '../../services/formatters';

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUserSlash,faUser,faUserSecret,faUserCog,faEye,faSlash
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

    library.add(
        faUserSlash,faUser,faUserSecret,faUserCog,faEye, faSlash
    );
    function newItem(item) {
      return {
          "name" : null,
          "agent_email": "", code : item?.code || "",
          "dept_id" : null, agent_password : "",
          admin : false,
          ...item,
          quicktags : (item?.quicktags) || [],
          quicklabels : (item?.quicklabels) || [],
          quickskills : (item?.quickskills) || []
      };
    }
    var tagFormat = function (argument) {
        return {
            id : argument.id,
            code : argument.code,
            category : argument.category,
            title : argument.title,
            text : argument.title,
            color : formatters.hexacode(argument.category)
        };
    }
    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,MyDict,VueTagsInput
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'Users',
            subheading: 'Add edit users',
            icon: 'pe-7s-users icon-gradient bg-happy-itmeo fa fa-user-friends',
            actions : [{
              label : "Add User", name : "ADD_ITEM"
            }],
            table : {
              fields: [ 
                { key : 'dept.name', label : "Team", sortable: true },
                { key : 'name', label : "Name" , sortable: true},
                { key : 'code', label : "Username", sortable: true }, 
                { key : 'agent_email', label : "Email" , sortable: true},
                { key : 'actions', label : "Action" }],
              busy : false,
              sortBy: 'name',
            },
           filters:{
               deptname:"",
               name:"",
               code:"",
               agent_email:""
           },
          newItem : newItem(),
          modelName :  "MODAL_ADD_USERS",
          includeInActive : false,
          labelInput : "", newLabels : null
        }),
        computed : {
            filtered() {
                let includeInActive = this.includeInActive;
                let items = this.$store.getters.StateAgents;
                if(!items?.length) return [];
                const filtered = items.filter(item=>{
                  return includeInActive || (item.isactive =="Y")
                }).filter(item => {
                  return Object.keys(this.filters).every(key =>{
                        if(key === 'deptname'){
                            return String(item["dept"].name).toLowerCase().includes(this.filters[key].toLowerCase())
                        } else return String(item[key]).toLowerCase().includes(this.filters[key].toLowerCase())
                    }
                  );
                });
                return filtered.length > 0
                  ? filtered
                  : [
                      Object.keys(items[0]).reduce(function(obj, value) {
                        obj[value] = '';
                        return obj;
                      }, {})
                    ];
            },
            teams : function (argument) {
              return (this.$store.getters.StateApi.AdminsDept || []).filter(function(team){
                return team.isactive=='Y';
              });
            },
            isChanged :  function (argument) {
              return this.oldHash !== JSON.stringify(this.newItem);
            },
            isValid : function (argument) {
              return this.newItem.name && this.newItem.code && this.newItem.agent_email;
            },
            labels  : function (argument) {
                var THAT = this;
                let TmplQuickskills = this.$store.getters.StateApi.TmplQuickskills;
                if(this.newItem.code)
                    return (THAT.newItem.quickskills || []).map(function (quickskill) {
                        let label = TmplQuickskills.filter(t => {
                            return t.id == quickskill.id;
                        })[0];
                        return label ? tagFormat(label) : null;
                    }).filter(v=>v);
                return [];
            },
            quickLabels : function(){ 
              let TmplQuickskills = this.$store.getters.StateApi.TmplQuickskills;
                return (TmplQuickskills|| []).filter(i => {
                  return i.title.toLowerCase().indexOf(this.labelInput.toLowerCase()) !== -1;
                }).map(function (argument) {
                    return tagFormat(argument);
                });
            },
        },
        created : function (argument) {
          this.loadAgents(true);
          this.loadAgentTeams();
          this.$service.getX("/api/tmpl/quickskills");
        },
        methods : {
          async loadAgents (loader){
            try {
              this.table.busy = true && loader;
              await this.$store.dispatch('GetAgents');
            } finally {
              this.table.busy = false && loader;
            }
          },
          async loadAgentTeams (){
              return await this.$service.getX('/api/admins/dept',{
                includeInActive : true
              });
          },
          onLabelChange : function (newLabels) {
            this.newItem.quickskills = newLabels; 
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
          async sendReset(item) {
             await this.$service.submit('/api/admins/agent/reset',{ agent_id : item.id });
          },
          async cancelItem(item) {
             this.newItem = newItem();
             this.onAction({name : "CANCEL"});
          }, 
          async editItem(item) {
              this.newItem = newItem(item);
              this.onAction({name : "EDIT_ITEM"});
             //await this.$store.dispatch('DeleteQuickReps', item);
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
          },


        }


    }
</script>
