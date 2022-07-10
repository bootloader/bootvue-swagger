<template>
  <div class="readpage">
    <navbar />
    <main>
      <div
        class="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75"
      >
        <div
          class="absolute top-0 w-full h-full bg-center bg-cover bg-blueGray-800"
        >
          <span
            id="blackOverlay"
            class="w-full h-full absolute opacity-100 bg-default"
          ></span>
        </div>
        <div class="container relative mx-auto">
          <div class="items-center flex flex-wrap">
            <div class="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div class="pr-12">
                <h1 class="text-white font-semibold text-5xl">
                  {{content.title}}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="pb-20 bg-blueGray-200 -mt-48">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap">

            <div class="w-full md:w-12/12 px-4">
              <div
                class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg"
              >
                <div class="px-4 py-5 flex-auto">
                  <span class="mt-2 mb-4 text-blueGray-500" v-html="text.markdownToHtml">
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </main>
    <footer-component />
  </div>
</template>
<script>
import Navbar from "./ProfileNavbar.vue";
import FooterComponent from "./Footer.vue";
import  { marked } from 'marked';

export default {
  data() {
    return {
      text : {
        markdownToHtml : "..."
      },
      urls : {
        privacy : { md : this.$config.PROP_SERVICE_PRIVACY_MD, title : "Privicy Policy" },
        aboutus : { md : this.$config.PROP_SERVICE_ABOUTUS_MD ,  title : "About Us"} ,
        tos : { md : this.$config.PROP_SERVICE_TOS_MD , title : "Terms of Service"},
      }
    };
  },
  computed : {
    content(){
      return this.urls[this.$route.params.content];
    }
  },
  mounted(){
    this.loadContent();
  },
  methods : {
    async loadContent(){
      try {
        const fetchResponse = await fetch(this.content.md);
        let rawText = await fetchResponse.text();
        this.text.markdownToHtml = marked.parse(rawText);
      } catch (ex) {
        console.log("Error in fetch",ex);
      }
    }
  },
  components: {
    Navbar,
    FooterComponent,
  },
};
</script>
<style lang="scss">
  .readpage {
    h1, h2, h3, h4, h5, h6 {
        font-size: revert;
        font-weight: revert;
    }
    blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {
        margin: revert;
    }
  }
</style>
