<template>
  <div>
    <page-title :heading=heading :subheading=subheading :icon=icon :actions=actions ></page-title>
    <b-card title="" class="main-card mb-4">
        <b-table :striped=true
                     :bordered=true
                     :outlined=false
                     :small=true
                     :hover=true
                     :dark=false
                     :fixed=false
                     :foot-clone=false
                     :items="agents"
                     :fields="fields">

                <template #cell(actions)="row">
                  
                  <b-button size="sm" @click="activateAgent(row.item, row.index, $event.target)" variant="outline-primary">
                    <font-awesome-icon v-if="row.item.isactive == 'Y'" icon="user-check" title="De-Activate"/>
                    <font-awesome-icon v-if="row.item.isactive != 'Y'" icon="user-slash" title="Activate"/>
                  </b-button>
                </template>

        </b-table>
    </b-card>
  </div>
</template>

<script>

    import PageTitle from "../Components/PageTitle.vue";

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUserSlash,faUserCheck
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

    library.add(
        faUserSlash,faUserCheck
    );
  export default {
    components: {
      PageTitle,'font-awesome-icon': FontAwesomeIcon,
    },
    data: () => ({
      heading: 'Agents',
      subheading: 'View all Agents.',
      icon: 'pe-7s-users icon-gradient bg-happy-itmeo',
      actions : [{
        label : "Add Agent", icon : "plus",
        link : "/app/admins/agents/add"
      }],
      fields: [ { key : 'dept.dept_name', label : "Dept" },{ key : 'agent_name', label : "Name" },
       { key : 'agent_code', label : "Username" }, { key : 'agent_email', label : "Email" },
       { key : 'agent_channels', label : "Channels", class : "upper-case" },
       { key : 'actions', label : "Action" }]
    }),
    computed : {
        agents : function (argument) {
          return this.$store.getters.StateAgents
        } 
    },
    created : function (argument) {
      this.loadAgents();
    },
    methods: {
        async loadAgents (){
          await this.$store.dispatch('GetAgents');
        },
        async activateAgent (agent){
          await this.$store.dispatch('DeActivateAgent',agent);
        }
    }
  }
</script>
<style type="text/css">
    .upper-case {
    text-transform: uppercase;
  }

</style>
