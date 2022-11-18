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
import DemoReciever from '../../App/Demo/DemoReciever.vue';
import DemoSender from '../../App/Demo/DemoSender.vue';
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
