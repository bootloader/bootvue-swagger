<template>
  <div>
    <div
      class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center profile-header"
      style="
        min-height: 600px;
        background-image: url(/argon/img//theme/profile-cover.jpg);
        background-size: cover;
        background-position: center top;
      "
    >
      <b-container fluid>
        <!-- Mask -->
        <span class="mask bg-default min-vh-100"></span>
        <!-- Header container -->
        <b-container fluid class="d-flex-x align-items-center">
          <b-row>
            <b-col lg="7" md="10"  >
              <h1 class="display-2 text-white">Hello {{$global.MyConst.userName}}</h1>
              <p class="text-white mt-0 mb-5">
                All your WhatsApp Business Accounts are here.
              </p>
            </b-col>
          </b-row>

        </b-container>
        <b-container class="" fluid>
          <b-row>
            <b-col lg="12" cols="12" class=""> 
              <AddWaba/>
            </b-col>
          </b-row>
        </b-container>
      
         <b-row class="mt-5">

         </b-row>
          <b-row class="mt-5" hidden>
            <b-col xl="6" class="mb-5"> 
            </b-col>
            <b-col xl="8" class="order-xl-1"> </b-col>
          </b-row>
      </b-container>
    </div>

    <b-container fluid class="mt--6">
      <b-row>
        <b-col xl="12" class="order-xl-0 mb-5"> 
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import AddWaba from "./AddWaba.vue";

export default {
  components: {
    AddWaba
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
