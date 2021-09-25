<template>
  <div>
    <ProfileApp v-if="$global.MyConst.tenant == 'app'">
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
