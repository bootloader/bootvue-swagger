<template>
  <div>
    <navbar />
    <main>
      <section class="relative w-full h-full py-40 min-h-screen">
        <div
          class="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full bg-cover-lg hidden md:block"
        ></div>
        <div
          class="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full bg-cover-sm md:hidden"
        ></div>
        <router-view />
        <footer-small absolute v-if="!$global.isMobileApp" />
      </section>
    </main>
  </div>
</template>
<script>
import Navbar from "./AuthNavbar.vue";
//import Navbar from "../Index/IndexNavbar.vue";
import FooterSmall from "./FooterSmall.vue";

//import socialBgToCenter from "@/assets/vendor/notus/img/social-bg-to-center.png";

export default {
  data() {
    return {
    };
  },
  components: {
    Navbar,
    FooterSmall,
  },
};
</script>
