<template>
  <main class="profile-page">
      <section class="relative block h-300-px">
        <div
          class="absolute top-0 w-full h-full bg-center bg-cover bg-blueGray-200"
        >
          <span
            id="blackOverlay"
            class="w-full h-full absolute opacity-50 bg-black"
          ></span>
        </div>
        <div
          class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
          style="transform: translateZ(0);"
        >
          
          <svg
            class="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              class="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>
      <section class="relative pt-16 pb-2 bg-blueGray-200">
        <div class="container mx-auto px-4">
          <div
            class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div class="px-2">
              <slot></slot>
            </div>
          </div>
        </div>

      </section>

      <footer class="relative bg-blueGray-200 pt-1 pb-6">
          <div class="container mx-auto px-4">
            <hr class="my-1 border-blueGray-300" />
            <div
              class="flex flex-wrap items-center md:justify-between justify-center"
            >
              <div class="w-full md:w-4/12 px-4 mx-auto text-center">
                <div class="text-sm text-blueGray-500 font-semibold py-1">
                  Copyright © {{ date }}
                  <a
                    :href="$config.PROP_SERVICE_WEBSITE_LINK"
                    class="text-blueGray-500 hover:text-blueGray-800"
                  >
                    {{$config.PROP_SERVICE_NAME}}
                  </a>
                  .
                </div>
              </div>
            </div>

          </div>
      </footer>

    </main>
</template>
<script>

export default {
  data() {
    return {
      navbarOpen: false,
           date: new Date().getFullYear(),
    };
  },
  computed : {
    isDefaultDomain(){
      console.log("isDefaultDomain",this.$route.params.domain, this.$global.MyConst.tenant)
      return this.$route.params.domain ? false : (this.$global.MyConst.appDomain == 'app');
    }
  },
  methods: {
    setNavbarOpen: function () {
      this.navbarOpen = !this.navbarOpen;
    },
  },
  components: {
  },
};
</script>

