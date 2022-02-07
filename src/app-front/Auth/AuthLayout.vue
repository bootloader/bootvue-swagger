<template>
  <div>
    <navbar />
    <main>
      <section class="relative w-full h-full py-40 min-h-screen">
        <div
          class="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full bg-cover-lg sm:hidden xs:hidden"
          :style="`background-image: url('${bgCoverDesktop}');`"
        ></div>
        <div
          class="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full bg-cover-sm md:hidden lg:hidden xl:hidden"
          :style="`background-image: url('${bgCoverMobile}');`"
        ></div>
        <router-view />
        <footer-small absolute />
      </section>
    </main>
  </div>
</template>
<script>
import Navbar from "./AuthNavbar.vue";
//import Navbar from "../Index/IndexNavbar.vue";
import FooterSmall from "./FooterSmall.vue";

import socialBgBottomRight from "@/assets/vendor/notus/img/social-bg-bottom-right.png";
import socialBgBottom from "@/assets/vendor/notus/img/social-bg-bottom.png";
//import socialBgToCenter from "@/assets/vendor/notus/img/social-bg-to-center.png";

export default {
  data() {
    return {
      bgCoverDesktop : socialBgBottomRight, //[socialBgToCenter,socialBgBottomRight][Math.round(Math.random()*1)],
      bgCoverMobile : socialBgBottom
    };
  },
  components: {
    Navbar,
    FooterSmall,
  },
};
</script>
<style scoped>
.bg-cover-lg {
    background-position: bottom right;
    height: calc( 100% - 75px);
    background-size: 50%;
}
.bg-cover-sm {
  background-position: bottom center;
  height: calc( 100% - 100px);
}
</style>