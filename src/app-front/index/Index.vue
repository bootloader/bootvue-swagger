<template>
  <div>
    <ProfileApp v-if="isDefaultDomain">
    </ProfileApp>
    <ProfileDomain v-else>
    </ProfileDomain>

  </div>
</template>
<script>
import ProfileApp from "./ProfileApp.vue";
import ProfileDomain from "./ProfileDomain.vue";

export default {
  data() {
    return {
      navbarOpen: false,
    };
  },
  computed : {
    isDefaultDomain(){
      return this.$route.params.domain ? false : (this.$global.MyConst.tenant == 'app');
    }
  },
  methods: {
    setNavbarOpen: function () {
      this.navbarOpen = !this.navbarOpen;
    },
  },
  components: {
    ProfileApp,
    ProfileDomain,
  },
};
</script>
