<template>
  <div>
    <!-- Page content -->
    <b-container class="x-position-absolute">
      <!-- Table -->
      <b-row class="justify-content-center">
        <b-col lg="6" md="8" >
          <b-card no-body class="bg-secondary border-0" >
            <b-card-header class="px-lg-5 bg-transparent pb-2 text-center ">
               <h2> Almost there … </h2>
                <small> Please check your email to confirm your account.</small>
            </b-card-header>
            <b-card-body class="px-lg-5 py-lg-4">
              
              <div class="text-center text-muted mb-4">
                <small>If lalit.tanwar.amx@gmail.com is not your email address, please go back and enter the correct one.</small>
              </div>
              
              <div class="text-center text-muted mb-4">
                <small>If you haven't received our email in 15 minutes, please check your spam folder.</small>
              </div>


            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>

  import "@fortawesome/fontawesome-free/css/all.css";

  export default {
    name: 'register',
    data() {
      return {
        model: {
          name: '',
          email: '',
          password: '',
          agree: false
        }
      }
    },
    methods: {
      onSubmit() {
        // this will be called only after form is valid. You can do an api call here to register users
      }
    }

  };
</script>
<style  lang="scss">





@-webkit-keyframes appear {
  100% {
    opacity: 1;
  }
}

@keyframes appear {
  100% {
    opacity: 1;
  }
}

</style>
