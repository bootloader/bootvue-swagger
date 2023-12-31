<template>
  <div
    ref="scrollList"
    class="sc-message-list"
    :style="{backgroundColor: colors.messageList.bg}"
    @scroll="handleScroll"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Message
      v-for="(message, idx) in messagesList"
      :key="idx"
      :message="message"
      :user="profile(message.author)"
      :colors="colors"
      :message-styling="messageStyling"
      @remove="$emit('remove', message)"
    >
      <template v-slot:user-avatar="scopedProps">
        <slot name="user-avatar" :user="scopedProps.user" :message="scopedProps.message"> </slot>
      </template>
      <template v-slot:text-message-body="scopedProps">
        <slot
          name="text-message-body"
          :message="scopedProps.message"
          :messageText="scopedProps.messageText"
          :messageColors="scopedProps.messageColors"
          :me="scopedProps.me"
        >
        </slot>
      </template>
      <template v-slot:system-message-body="scopedProps">
        <slot name="system-message-body" :message="scopedProps.message"> </slot>
      </template>
      <template v-slot:text-message-toolbox="scopedProps">
        <slot name="text-message-toolbox" :message="scopedProps.message" :me="scopedProps.me">
        </slot>
      </template>
    </Message>
    <Message
      v-show="showTypingIndicator !== ''"
      :message="{author: showTypingIndicator, type: 'typing'}"
      :user="profile(showTypingIndicator)"
      :colors="colors"
      :message-styling="messageStyling"
    />
  </div>
</template>

<script>
import Message from './Message.vue'
import chatIcon from '@/assets/vendor/webchat/chat-icon.svg'

export default {
  components: {
    Message
  },
  props: {
    participants: {
      type: Array,
      required: true
    },
    messages: {
      type: Array,
      required: true
    },
    showTypingIndicator: {
      type: String,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    alwaysScrollToBottom: {
      type: Boolean,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    defaultChatIcon() {
      return chatIcon
    },
    messagesList(){
        let msgList = this.messages.slice().reverse();
        return msgList;
    }
  },
  data(){
      return {
      currentSize : this.messages.length,
      touchstart:false,
      touchend:true
    }
  },
  mounted() {
    this.$nextTick(this._scrollDown())
  },
  updated() {
    if (this.shouldScrollToBottom() && this.messages.length > this.currentSize) this.$nextTick(this._scrollDown())
    this.currentSize = this.messages.length;
  },
  methods: {
    onTouchStart(){
      this.touchstart=true;
      this.touchend=false;
    },
    onTouchEnd(){
      this.touchstart=false;
      this.touchend=true;
    },
    _scrollDown() {
      if(this.touchend){
        this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight
      }
    },
    handleScroll(e) {
      if (e.target.scrollTop === 0) {
        this.$emit('scrollToTop')
      }
    },
    shouldScrollToBottom() {
      const scrollTop = this.$refs.scrollList.scrollTop
      const scrollable = scrollTop > this.$refs.scrollList.scrollHeight - 600
      return this.alwaysScrollToBottom || scrollable
    },
    profile(author) {
      const profile = this.participants.find((profile) => profile.id === author)

      // A profile may not be found for system messages or messages by 'me'
      return profile || {imageUrl: '', name: ''}
    }
  }
}
</script>

<style scoped>
.sc-message-list {
  height: 80%;
  overflow: auto;
  -webkit-overflow-scrolling:touch;
  overflow-x: hidden;
  overflow-y: auto;
  background-size: 100%;
  padding: 40px 20px;
  display: flex;
  flex-direction: column-reverse;
}
</style>
