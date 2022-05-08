<template>
      <div>
    <!-- Page content -->
    <b-container class="x-position-absolute">
      <!-- Table -->
      <b-row class="justify-content-center">
        <b-col lg="6" md="8" >
          <b-card no-body class="bg-secondary border-0 " >
            <b-card-header class="px-lg-5 bg-transparent pb-2">
               <h2> Cherry Client Info </h2>
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
        </b-col>
      </b-row>

    </b-container>
  </div>
</template>
<script>
    import BaseCopy from "@/@common/argon/components/BaseCopy.vue";

    //let baseUrl = "https://pure-citadel-90943.herokuapp.com/https://api.github.com/";
  let baseUrl = "https://api.github.com/";
  export default {
      components : {
          BaseCopy
      },
      data : () => ({
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
          }
      }),
      computed : {
          clientOption(){
              let client = this.model.client;
              return (this.clientOptions.filter(function(option){
                  return option.value == client
              })[0] || {});
          }
      }, 
      mounted(){
          this.clientOnChange();
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
        }
      }
  }
</script>
