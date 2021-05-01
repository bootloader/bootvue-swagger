<template>
    <div>
        <page-title :heading=heading :subheading=subheading :icon=icon :actions=actions></page-title>
        <div class="row">
            <div class="col-md-6">
                <div class="main-card mb-3 card">
                   <ValidationObserver ref="form">
                    <div class="card-body"><h5 class="card-title">Agent Details</h5>
                        <form class="">
                    
                            <div class="position-relative form-group">
                              <ValidationProvider v-slot="v" rules="required">
                                    <label for="examplePassword" class="">Name</label>
                                    <input name="agent_name" id="examplePassword"
                                     placeholder="John Doe" type="text"
                                      class="form-control" v-model="newAgent.agent_name">
                                      <span class="v-input-error">{{ v.errors[0] }}</span>
                              </ValidationProvider>
                              </div>

                            <div class="position-relative form-group">
                              <ValidationProvider v-slot="v" rules="required|email">
                                <label for="exampleEmail" class="">Email</label>
                                <input name="email"
                                        id="exampleEmail"
                                        placeholder="abc@xyz.com"
                                        type="email"
                                        class="form-control" v-model="newAgent.agent_email">
                                 <span class="v-input-error" >{{ v.errors[0] }}</span>
                              </ValidationProvider>
                            </div>
                            <div class="position-relative form-group">
                                <label for="exampleEmail" class="">Agent Code</label>
                                <div class="input-group">
                                    <div class="input-group-prepend"><span class="input-group-text">@</span></div>
                                    <input placeholder="john,sam2" type="text" class="form-control" v-model="newAgent.agent_code">
                                </div>
                            </div>
 

                            <div class="position-relative form-group"><label for="examplePassword"
                                                                             class="">Password</label><input
                                name="password" id="examplePassword" placeholder="password" type="password"
                                class="form-control" v-model="newAgent.agent_password"></div>
                           
                        </form>
                    </div>
                  </ValidationObserver>
                </div>
            </div>


            <div class="col-md-6">
                  <div class="main-card mb-3 card">
                        <div class="card-body"><h5 class="card-title">Dashboard options</h5>
                            <div class="row">
                                <div class="col-md-6">
                                      
                                    <div class="position-relative form-group"><label for="exampleSelect" class="">Team</label>
                                      <select name="select" id="exampleSelect" class="form-control"
                                        v-model="newAgent.dept_id">
                                          <option v-for="team in teams"
                                          v-if="team.isactive=='Y'" :value=team.dept_id>
                                          {{team.dept_name}}</option>
                                        </select>
                                    </div>

                                    <div class="position-relative form-group">
                                        <label for="exampleCustomMutlipleSelect" class="">Channels</label>
                                        <select multiple="" type="select" id="exampleCustomMutlipleSelect"
                                                 name="customSelect" class="custom-select"
                                                 v-model="newAgent.agent_channels_list">
                                                <option>WHATSAPP</option>
                                                <option>FACEBOOK</option>
                                                <option>TWITTER</option>
                                                <option>TELEGRAM</option>
                                                <option>WEBSITE</option>
                                          </select>
                                    </div>

                                 </div>


                                <div class="col-md-6" hidden>
                                    <div class="position-relative form-group"><label for="exampleCustomSelectDisabled"
                                                                                     class="">Custom Select
                                        Disabled</label><select type="select" id="exampleCustomSelectDisabled"
                                                                name="customSelect" disabled
                                                                class="custom-select">
                                        <option value="">Select</option>
                                        <option>Value 1</option>
                                        <option>Value 2</option>
                                        <option>Value 3</option>
                                        <option>Value 4</option>
                                        <option>Value 5</option>
                                    </select></div>
                                    <div class="position-relative form-group"><label
                                        for="exampleCustomMutlipleSelectDisabled" class="">Custom Multiple Select
                                        Disabled</label><select multiple="" type="select"
                                                                id="exampleCustomMutlipleSelectDisabled"
                                                                name="customSelect" disabled class="custom-select">
                                        <option value="">Select</option>
                                        <option>Value 1</option>
                                        <option>Value 2</option>
                                        <option>Value 3</option>
                                        <option>Value 4</option>
                                        <option>Value 5</option>
                                    </select></div>
                                </div>


                            </div>
                        </div>
                    </div>

                      <div class="main-card mb-3 card" hidden>
                          <div class="card-body row">
                            <h5 class="card-title"></h5>
                              <div class="position-relative form-group col-md-6" >
                                  <div>
                                      <div class="custom-checkbox custom-control"><input type="checkbox"
                                                                                         id="exampleCustomCheckbox"
                                                                                         class="custom-control-input"><label
                                          class="custom-control-label" for="exampleCustomCheckbox">Active</label>
                                      </div>
                                      <div class="custom-checkbox custom-control"><input type="checkbox"
                                                                                         id="exampleCustomCheckbox2"
                                                                                         class="custom-control-input"><label
                                          class="custom-control-label" for="exampleCustomCheckbox2">Send Email</label>
                                      </div>
                                         
                                  </div>
                              </div>
                  
                          </div>
  
                      </div>

            </div>

        </div>

        <div class="main-card mb-4">
            <div class="row">
                  <div class="col-md-6">
                          <button class="mt-1 btn btn-primary float-right"
                          @click="createAgent" >Submit</button>
                  </div>
            </div>          
        </div>
    </div>
</template>

<script>

    import PageTitle from "../Layout/PageTitleAction.vue";

    function newAgent() {
      return {
              "agent_code": "",
              "agent_email": "",
              "agent_id" : null,
              "agent_channels_list": [],"agent_channels" : ""
            };
    }

    export default {
        components: {
            PageTitle,
        },
        data: () => ({
            heading: 'Add Agent',
            subheading: 'Enter Details for new Agent, once created agent will recieve email to reset password',
            icon: 'pe-7s-add-user icon-gradient bg-tempting-azure',
            actions : [],
            newAgent : newAgent()
        }),
        computed : {
            teams : function (argument) {
              return this.$store.getters.StateTeams
            } 
        },
        created : function (argument) {
          this.loadAgentTeams();
        },
        methods : {
          async loadAgentTeams (){
            await this.$store.dispatch('GetTeams');
          },
          async createAgent () {
            await this.$store.dispatch('CreateAgent', this.newAgent);
            this.newAgent = newAgent();
            this.$refs.form.reset();
          },
        }
    }
</script>
