<template>
  <div>
    <div>
        <!-- Header container -->
        <b-container fluid class="d-flex align-items-center">
          <b-row>
            <b-col lg="7" md="10">
              <h1 class="display-2">Hello {{$global.MyConst.userName}}</h1>
              <p class="mt-0 mb-4">
                Welcome to {{$config.PROP_SERVICE_NAME}}. OTPs and alerts can be sent from
                registred organizations. After orginazation is created, it is subjected 
                to verification and needs approval.
              </p>
            </b-col>
          </b-row>
        </b-container>
        <b-container class="" fluid>
          <b-row>
            <b-col lg="12" cols="12" class=""> 
              <span v-if="orgAdded">
                <b-button  variant="outline-oa-blue" :to="{
                    name : 'Edit Organization', params : {
                      orgId : companies[0].company.companyId
                    }
                  }">
                  Edit Organization
                </b-button>
                <b-button  variant="outline-oa-blue" :to="{
                    name : 'APIKey', params : {
                      orgId : companies[0].company.companyId
                    }
                  }">
                  Generate API Key
                </b-button>
              </span> 
              <b-button v-else-if="orgReady" variant="outline-oa-blue" to="/app/org/add">
                Add Organization
              </b-button>
            </b-col>
          </b-row>
        </b-container>
    </div>

  </div>
</template>
<script>
//import UserCard from "../../app-account/views/Pages/UserProfile/UserCard.vue";

export default {
  components: {
    //UserCard,
  },
  data (){
    return {
      companies : null,
    }
  },
  computed : {
    orgReady(){
      return !!this.companies
    },
    orgAdded(){
      return (this.companies?.length > 0) && this.companies[0].company
    }
  },
  created() {
    this.loadDetails();
  },
  methods : {
    async loadDetails(){
      let resp = await this.$service.get("/panel/api/v1/companys");
      this.companies = [];
      if(resp.results && resp.results.length){
        this.companies = [...resp.results]
      }
    },
  }  
};
</script>
<style>
</style>
