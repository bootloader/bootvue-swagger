<template>
  <footer class="footer px-4">
    <b-row align-v="center" class="justify-content-lg-between">
      <b-col lg="6">
        <div class="copyright text-center text-lg-left text-white">
          © {{year}} <a :href="$config.PROP_SERVICE_WEBSITE_LINK" class="font-weight-bold ml-1" target="_blank">
          {{$config.PROP_SERVICE_NAME}}</a>
        </div>
      </b-col>
      <b-col lg="6">
        <b-nav align="center" class="nav-footer justify-content-lg-end text-white">
          <b-nav-item v-if="$config.PROP_SERVICE_ABOUTUS_LINK" :href="$config.PROP_SERVICE_ABOUTUS_LINK" 
            class="text-white"  target="_blank">
           About Us
          </b-nav-item>
          <b-nav-item v-if="$config.PROP_SERVICE_BLOG_LINK" :href="$config.PROP_SERVICE_BLOG_LINK" target="_blank">
            Blog
          </b-nav-item>
          <b-nav-item v-if="$config.PROP_SERVICE_PRIVACY_LINK"  :href="$config.PROP_SERVICE_PRIVACY_LINK" target="_blank">
            Privacy Policy
          </b-nav-item>
        </b-nav>
      </b-col>
    </b-row>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style lang="scss">
</style>
