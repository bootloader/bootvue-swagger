<template>
  <router-view></router-view>
</template>

<script>
console.log("This is Content")

export default {
  mounted() {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
      document.head.appendChild(recaptchaScript);
  }
}
</script>
