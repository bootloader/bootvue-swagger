<template>
  <footer class="relative bg-blueGray-200 pt-8 pb-6">
    <div
      class="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
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
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap text-center lg:text-left">
        <div class="w-full lg:w-6/12 px-4">
          <h4 class="text-3xl font-semibold">Let's keep in touch!</h4>
          <h5 class="text-lg mt-0 mb-2 text-blueGray-600">
            Find us on any of these platforms, we respond within 1-2 business days.
          </h5>
          <div class="mt-6 lg:mb-0 mb-6">
            <button v-if="$config.PROP_SOCIAL_TWITTER"
              class="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
              type="button"
            >
              <a target="_blank"  :href="`https://twitter.com/${$config.PROP_SOCIAL_TWITTER}`" class="fab fa-twitter"></a>
            </button>
            <button v-if="$config.PROP_SOCIAL_FACEBOOK"
              class="bg-white text-lightBlue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
              type="button"
            >
              <a target="_blank"  :href="`https://facebook.com/${$config.PROP_SOCIAL_FACEBOOK}`"  class="fab fa-facebook-square"></a>
            </button>
            <button v-if="$config.PROP_SOCIAL_INSTAGRAM"
              class="bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
              type="button"
            >
              <a target="_blank"  :href="`https://instagram.com/${$config.PROP_SOCIAL_INSTAGRAM}`"  class="fab fa-instagram"></a>
            </button>
            <button v-if="$config.PROP_SOCIAL_TELEGRAM"
              class="bg-white text-telegram shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
              type="button"
            >
              <a target="_blank"  :href="`https://t.me/${$config.PROP_SOCIAL_TELEGRAM}?start=/start`"  class="fab fa-telegram-plane "></a>
            </button>
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="flex flex-wrap items-top mb-6">
            <div class="w-full lg:w-4/12 px-4 ml-auto">
              <span
                class="block uppercase text-blueGray-500 text-sm font-semibold mb-2"
              >
                Useful Links
              </span>
              <ul class="list-unstyled">
                <li v-if="$config.PROP_SERVICE_ABOUTUS_LINK">
                  <a
                    class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                    :href="$config.PROP_SERVICE_ABOUTUS_LINK"
                  >
                    About Us
                  </a>
                </li>
                <li v-if="$config.PROP_SERVICE_BLOG_LINK">
                  <a
                    class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                    :href="$config.PROP_SERVICE_BLOG_LINK"
                  >
                    Blog
                  </a>
                </li>
                <li v-if="$config.PROP_SOCIAL_GIIHUB">
                  <a
                    class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                      :href="$config.PROP_SOCIAL_GIIHUB"
                  >
                    Github
                  </a>
                </li>
              </ul>
            </div>
            <div class="w-full lg:w-4/12 px-4">
              <span
                class="block uppercase text-blueGray-500 text-sm font-semibold mb-2"
              >
                Other Resources
              </span>
              <ul class="list-unstyled">
                <li hidden>
                  <a
                    class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                    href="https://github.com/creativetimofficial/vue-notus/blob/main/LICENSE.md?ref=vn-footer"
                  >
                    MIT License
                  </a>
                </li>
                <li>
                  <a
                    class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                    :href="$config.PROP_SERVICE_TOS_LINK"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                    :href="$config.PROP_SERVICE_PRIVACY_LINK"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li hidden>
                  <a
                    class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                      :href="$config.PROP_SERVICE_PRIVACY_LINK"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <hr class="my-6 border-blueGray-300" />
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
</template>
<script>
export default {
  data() {
    return {
      date: new Date().getFullYear(),
    };
  },
};
</script>
