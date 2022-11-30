<template>
  <div>
    <div>
        <!-- Header container -->
        <b-container fluid class="d-flex align-items-center">
          <b-row>
            <b-col lg="7" md="10">
              <h1 class="display-2">Hello {{$global.MyConst.userName}}</h1>
              <p class="mt-0 mb-5">
                All your communication channels needs to be connected to one
                domain so that you can respond to all your customer queries.
              </p>
            </b-col>
          </b-row>

        </b-container>
        <b-container class="" fluid>
          <b-row>
            <b-col lg="12" cols="12" class=""> 
              Home Page
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
      addDomain : false
    }
  }
};
</script>
<style>
</style>
