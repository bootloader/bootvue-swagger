<template>
<div>
  <b-row>
    <b-col>
      <input type="url" id="url-input" v-model="urlInput" placeholder="Type a URL" value="https://www.pwabuilder.com" />
      <button @click="loadPwa">Go</button>
      <p id="error-dump" style="color: darkred;">{{errorDump}}</p>
      <textarea id="manifestCodeEditor" @input="codeEditorChanged" v-model="manifestJson"
        style="overflow: scroll; width: 500px; height: 500px;"></textarea>
    </b-col>
    <b-col>
        <manifest-previewer class="manifest-previewer" ref="manifest_previewer">
        </manifest-previewer>
    </b-col>    
  </b-row>  

</div>
</template>
<script>
//import "@/assets/vendor/notus/styles/tailwind.css";
  import Vue from 'vue';
  import manifest from "@pwabuilder/manifest-previewer"

  const loginImage = __webpack_public_path__ + '/_common/static/xms-logo.png';
  
export default {
  data() {
    return {
      STATIC : 'https://notiphyapp.github.io/twtb-app-landing-page/',
      loginImage,
      css : [
        //"https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700",
        //'https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css'
      ],
      manifestPreviewer : null,
      urlInput : document.location.origin,
      errorDump : "",
      manifestJson : "{}"
    };
  },
  watch : {
    // 'modelData' : function(){
    //   //this.validateModelData();
    // }
  },
  computed : {
  },
  mounted(){
      for(var i in this.css){
        let recaptchaScript = document.createElement('link')
        recaptchaScript.setAttribute('rel', 'stylesheet')
        recaptchaScript.setAttribute('href', this.css[i])
        document.head.appendChild(recaptchaScript);
      }
       this.load();
      // let recaptchaScript = document.createElement('script')
      // recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
      // document.head.appendChild(recaptchaScript);
  },
  methods: {
    async load(){
      console.log("manifest:load")
      this.manifestPreviewer = this.$refs.manifest_previewer;
      await this.loadPwa();
    },
    async loadPwa() {
      console.log("manifest:loadPwa")
      // Clear any error text
      this.errorDump = "";

      // Fetch the manifest for the URL
      const fetchResult = await fetch(`https://pwabuilder-manifest-finder.azurewebsites.net/api/findmanifest?url=${encodeURIComponent(this.urlInput)}`);
      if (!fetchResult.ok) {
        this.errorDump = `Error fetching manifest: ${fetchResult.status} - ${fetchResult.statusText}`;
        return;
      }

      const manifestDetection = await fetchResult.json();
      if (!manifestDetection.manifestContents) {
        this.errorDump = `Error fetching manifest: ${manifestDetection.error}`;
        return;
      }
      console.log("this.manifestPreviewer ",this.manifestPreviewer )
      // Update the manifest previewer.
      this.manifestPreviewer.siteUrl = this.urlInput;
      this.manifestPreviewer.manifestUrl = manifestDetection.manifestUrl;
      this.manifestPreviewer.manifest = manifestDetection.manifestContents;
      this.manifestJson = JSON.stringify(manifestDetection.manifestContents, undefined, 2);
    },
    codeEditorChanged() {
      // Is the JSON valid?
      let isJsonValid = false;
      let newManifest = null;
      try {
        newManifest = JSON.parse(this.manifestJson);
        isJsonValid = true;
        this.errorDump = "";
      } catch (error) {
        this.errorDump = `Invalid JSON: ${error}`;
        return;
      }
      this.manifestPreviewer.manifest = newManifest;
    }
  },
  components: {
  },
};
</script>
<style lang="scss">
    @import "@/assets/app-linq.scss";
    .vgrid-wrapper {
      height: 50px;
      min-height: 50px;
    }


    @font-face {
      font-family: 'Hind';
      src: url('/assets/fonts/Hind-Regular.ttf');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Hind';
      src: url('/assets/fonts/Hind-Bold.ttf');
      font-weight: 700;
      font-style: bold;
      font-display: swap;
    }

    @font-face {
      font-family: 'Segoe';
      src: url('/assets/fonts/SegoeUI.ttf');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'SF-Pro';
      src: url('/assets/fonts/SFProDisplay-Light.ttf');
      font-weight: 400;
      font-style: normal;
    }

    @font-face {
      font-family: 'Roboto';
      src: url('/assets/fonts/Roboto-Regular.ttf');
      font-weight: 400;
      font-style: normal;
    }

    .manifest-previewer {
      --font-family: Hind;
      --windows-font-family: Segoe;
      --ios-font-family: SF-Pro;
      --android-font-family: Roboto;
    }

    .manifest-previewer::part(card) {
      margin: 70px auto 0;
    }


</style>