<template>
      <div>
    <!-- Page content -->
    <b-container class="x-position-absolute">
      <!-- Table -->
      <b-row class="justify-content-center">
        <b-col lg="6" md="8" >

        <div>
        <b-tabs content-class="mt-3">
            <b-tab title="Cherry Client Info">
                <b-card no-body class="bg-secondary border-0 " >
                    <b-card-header class="px-lg-5 bg-transparent pb-2">
                        <base-select   alternative feedback
                            class="mb-3"
                            name="Client" placeholder="Select Client"
                            :rules="{required: true}"  required
                            v-model="model.client" @change="clientOnChange"
                            :options="clientOptions">
                        </base-select>
                        <base-select hidden alternative feedback v-if="clientOption.env && clientOption.env.length"
                            class="mb-3"
                            name="Env" placeholder="Select Env"
                            :rules="{required: true}"  required
                            v-model="model.env"
                            :options="clientOption.env">
                        </base-select>
                    </b-card-header>
                    <b-card-body class="px-lg-5 py-lg-2">
                        <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">  
                            <BaseCopy label="Release Version" :value="model.releaseVersion" size="sm" />
                            <BaseCopy label="Release Url" :value="model.releaseVersion" size="sm"/>
                        </b-form>
                    </b-card-body>
                    <b-card-body class="px-lg-5 py-lg-2">
                        <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">  
                            <BaseCopy label="Beta Version" :value="model.betaVersion" size="sm" />
                            <BaseCopy label="Beta Url" :value="model.betaVersion" size="sm"/>
                        </b-form>
                        <div class="text-center mt-2" v-if="deployed.version && deployed.version!=model.betaVersion">
                            <button @click="updateAlpha(model.betaVersion)"
                            class="btn btn-sm btn-primary">Update Beta</button> 
                        </div>  
                    </b-card-body>
                    <b-card-body class="px-lg-5 py-lg-2">
                        <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">  
                            <BaseCopy label="Alpha Version" :value="model.alphaVersion" size="sm"/>
                            <BaseCopy label="Alpha Url" 
                                :value="`https://cdn.jsdelivr.net/gh/cherrybase/${model.client}@${model.alphaVersion}`" 
                                size="sm"/>
                        </b-form>
                        <div class="text-center mt-2" v-if="deployed.version && deployed.version!=model.alphaVersion">
                                <button @click="updateAlpha(model.alphaVersion)"
                                    class="btn btn-sm btn-primary">Update Alpha</button> 
                            </div>  
                    </b-card-body>
                </b-card>
            </b-tab>
            <b-tab title="Deployed Versions" active>

               <b-card no-body class="bg-secondary border-0 " >
                    <b-card-body class="px-lg-5 py-lg-2" >
                        <BaseCopy label="owa" :value="deployed.version" size="sm" />
                        <small class="float-right">  {{deployed.stamp}} <i class="fa fa-clock"/></small>
                    </b-card-body>
                    <b-card-body v-for="server  in deployed.servers" class="px-lg-5 py-lg-2" v-bind:key="server.title">
                        <BaseCopy :label="server.title" :value="server.version" size="sm" />
                        <small class="float-right">  {{server.stamp}} <i class="fa fa-clock"/></small>
                    </b-card-body>
                </b-card>
            </b-tab>
            <b-tab title="Controller">
               <b-card no-body class="bg-secondary border-0 " >
                    <b-card-body class="px-lg-5 py-lg-2" >
                        <base-input size="sm" label="Config" prelabel readonly
                            value=" Clear all config cache">
                            <template #actions>
                                <b-button class="w-20" @click="clearCache"
                                    variant="outline-success">
                                    Clear</b-button>
                            </template>    
                        </base-input>
                         <base-input size="sm" label="CDN" prelabel readonly
                            value=" Reset to master Config">
                            <template #actions>
                                <b-button class="w-20" @click="resetCDN"
                                    variant="outline-success">
                                    Reset</b-button>
                            </template>    
                        </base-input>
                    </b-card-body>
                </b-card>
            </b-tab>
        </b-tabs>
        </div>



        </b-col>
      </b-row>

    </b-container>
  </div>
</template>
<script>
    import BaseCopy from "@/@common/argon/components/BaseCopy.vue";
import BaseInput from '../@common/argon/components/Inputs/BaseInput.vue';

    //let baseUrl = "https://pure-citadel-90943.herokuapp.com/https://api.github.com/";
  let baseUrl = "https://api.github.com/";
  export default {
      components : {
          BaseCopy,
            BaseInput
      },
      data : () => ({
          tab : null,
          model : {
              client : "cherrybase.github.io", env : "",
              releaseVersion : "",
              betaVersion : "",
              alphaVersion : ""
          },
          clientOptions : [{
                  name : "UI-CDN",
                  value : "cherrybase.github.io",
                  env : [
                      "sandbox","app","release"
                  ],
                  alpha : 'app', beta : 'sandbox', release : 'gh-pages'
              },
              {
                  name : "Cherry Webpick",
                  value : "cherry-webpick",
                  env : [
                      
                  ],
                   alpha : 'publish', beta : 'publish', release : 'publish'
              },
          ],
          deployed : {
              version : null,
              stamp : null,
              servers : [{
                      context : '',
                      version : '', stamp : '',
                      title : "Account"
                },{
                      context : '/admin',
                      version : '', stamp : '',
                      title : "AdminPanel"
                },{
                      context : '/agent',
                      version : '', stamp : '',
                      title : "AgentDesk"
                },{
                      context : '/bot',
                      version : '', stamp : '',
                      title : "BotMan"
                },{
                      context : '/postman',
                      version : '', stamp : '',
                      title : "PostMan"
                },{
                      context : '/xms',
                      version : '', stamp : '',
                      title : "XMS"
                },
                {
                      context : '/contak',
                      version : '', stamp : '',
                      title : "CONTAK"
                },
              ]
          },
      }),
      computed : {
          clientOption(){
              let client = this.model.client;
              return (this.clientOptions.filter(function(option){
                  return option.value == client
              })[0] || {});
          },
          currentTab(){
              return this.tab || 'client';
          }
      }, 
      mounted(){
          this.clientOnChange();
          let THAT =  this;
          async function  update(){
            for(var i in THAT.deployed.servers){
                THAT.clientInf(THAT.deployed.servers[i]);
            }
          }  
        update();
        //setInterval(()=> update(),3000);
      },
      methods : {
        async clientOnChange(){
            let THAT = this;
            fetch(new Request(
                baseUrl + `repos/cherrybase/${this.model.client}/commits/${this.clientOption.alpha}?page=0&per_page=1`, {
                method: 'GET',
            })).then(function(response) {
                return response.text();
            }).then(function(response) {
                return JSON.parse(response);
            }).then(function(response) {
                THAT.model.alphaVersion = response.sha;
            }).catch(function(e){
                console.log(e);
            });

            fetch(new Request(
                baseUrl + `repos/cherrybase/${this.model.client}/commits/${this.clientOption.beta}?page=0&per_page=1`, {
                method: 'GET',
            })).then(function(response) {
                return response.text();
            }).then(function(response) {
                return JSON.parse(response);
            }).then(function(response) {
                THAT.model.betaVersion = response.sha;
            }).catch(function(e){
                console.log(e);
            });

            fetch(new Request(
                baseUrl + `repos/cherrybase/${this.model.client}/tags?page=0&per_page=1`, {
                method: 'GET',
            })).then(function(response) {
                return response.text();
            }).then(function(response) {
                return JSON.parse(response);
            }).then(function(response) {
                THAT.model.releaseVersion = (response[0] || {}).name;
            }).catch(function(e){
                console.log(e);
            });

            if(this.model.client == 'cherrybase.github.io'){
                fetch(new Request(
                    `/api/config/cdn?beta=false`, {
                    method: 'POST',
                })).then(function(response) {
                    return response.text();
                }).then(function(response) {
                    return JSON.parse(response);
                }).then(function(response) {
                    THAT.deployed.version = (response.results[0].value || "").split("@")[1] || "NULL";
                }).catch(function(e){
                    console.error(e);
                });
            }
        },
        async updateAlpha(version){
            let THAT = this;
            if(this.model.client == 'cherrybase.github.io'){
                const data = new URLSearchParams();
                data.append('version', version);
                data.append('url', `https://cdn.jsdelivr.net/gh/cherrybase/${this.model.client}@${version}`);
                fetch(new Request(
                        `/api/config/cdn?beta=false`, {
                        method: 'POST',
                        body : data
                    })).then(function(response) {
                        return response.text();
                    }).then(function(response) {
                        return JSON.parse(response);
                    }).then(function(response) {
                        THAT.deployed.version = (response.results[0].value || "").split("@")[1] || "NULL";
                    }).catch(function(e){
                        console.error(e);
                    });
            }
        },
        async clientInf(server){
            let THAT = this;
            fetch(new Request(
                    server.context + `/v2/api-docs?group=latest`, {
                    method: 'GET'
                })).then(function(response) {
                    return response.text();
                }).then(function(response) {
                    return JSON.parse(response);
                }).then(function(response) {
                    //1.0 - 2022-05-19 08:58 am UTC
                    server.version = response.info.version;
                    server.stamp = new Date(server.version.replace('1.0 - ','')).toString();
                }).catch(function(e){
                    console.error(e);
                });
        },
        async clearCache(){
            fetch(new Request(`/pub/amx/config/shared/clear/all`, {
                method: 'GET'
            }))
        },
        async resetCDN(){
            fetch(new Request(`/api/config?key=mry.cdn.url`, {
                method: 'DELETE'
            }))
        }
      }
  }
</script>
