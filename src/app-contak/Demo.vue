<template>
  <div>
    <b-row>
      <b-col>
        <demo-sender/>
      </b-col>
      <b-col>
        <demo-reciever/>
      </b-col>  
    </b-row>  
  </div>
</template>
<script>
import DemoReciever from './DemoReciever.vue';
import DemoSender from './DemoSender.vue';
export default {
  data() {
    return {
      navbarOpen: false,
    };
  },
  computed : {
  },
  methods: {
  },
  components: {
    DemoSender,
    DemoReciever
  },
};
</script>
