<template>
  <div class="sc-suggestions-row" :style="{background: colors.messageList.bg}">
      <span v-for="(suggestion, idx) in suggestions" :key="idx" >
        <slot name="suggestion-button" :suggestion="suggestion" 
            :colors="colors" :sendSuggestion="sendSuggestion"
            :button="{
              class : 'sc-suggestions-element',
              style : {
                borderColor : colors.sentMessage.bg,
                color: colors.sentMessage.bg
              }
            }">
          <button
              :class="button.class"
              :style="button.style"
              @click="sendSuggestion(suggestion)" >
              {{ suggestion }}
            </button>
          </slot>
      </span>  
  </div>
</template>

<script>
export default {
  props: {
    suggestions: {
      type: Array,
      default: () => []
    },
    colors: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods : {
    sendSuggestion(suggestion){
      this.$emit('sendSuggestion', suggestion)
    }
  }
}
</script>

<style>
.sc-suggestions-row {
  text-align: center;
  background: inherit;
}

.sc-suggestions-element {
  margin: 3px;
  padding: 5px 10px 5px 10px;
  border: 1px solid;
  border-radius: 15px;
  font-size: 14px;
  background: inherit;
  cursor: pointer;
  appearance: auto;
}
</style>
