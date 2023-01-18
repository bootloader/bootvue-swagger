<template>
  <div>
    <div
      v-if="showLauncher"
      class="sc-launcher"
      :class="[{opened: isOpen}, launcherPosition]"
      :style="{backgroundColor: colors.launcher.bg}"
      @click.prevent="isOpen ? close() : openAndFocus()"
    >
      <div v-if="newMessagesCount > 0 && !isOpen" class="sc-new-messsages-count">
        {{ newMessagesCount }}
        </div>
        <img v-if="isOpen" class="sc-closed-icon" :src="icons.close.img" :alt="icons.close.name" />
        <img v-else class="sc-open-icon" :src="icons.open.img" :alt="icons.open.name" />
      </div>

    <el-card class="box-card chat-landing" :body-style="{padding:0, height:'100%'}" :class="isOpen ? 'open' : 'close'">
      <div class="icebreaker" v-if="showIcebreaker">
        <div class="chat-landing-header" :style="'background-color:'+colors.header.bg">
          <div slot="header" class="clearfix">
            <el-row :gutter="10">
              <el-col :sm="1" :xs="1">
                <span style="padding: 5px;">      
                  <el-avatar :src="headerLogo"></el-avatar>
                </span>
              </el-col>
              <el-col :sm="20" :xs="21"><span> &nbsp;</span></el-col>
              <el-col :sm="1" :xs="1" v-if="isOpen">
                <i @click.prevent="close()" class="el-icon-close" style="color:#fff; font-size: 26px; cursor: pointer;"></i>
              </el-col>
            </el-row>
            
            
          </div>
          <h1>{{this.messageList[0].data.text}}</h1>
          <!-- <p>Some introduction text for customer to explain the motive of this window</p> -->
          <!-- <el-row :gutter="10" class="agent-available">
            <el-col :xs="2" :sm="2" class="el-icon-time"></el-col>
            <el-col :xs="12" :sm="12" ><div class="grid-content bg-purple-light">BRB in 2 hour</div></el-col>
          </el-row> -->
        </div>
        <el-card class="box-card" style="border:0;" shadow="never" >
          <!-- <el-card class="box-card" :body-style="{padding:'10px 10px 4px'}">
            <div slot="header" class="clearfix">
              <span>You have 1 open conversations</span>
            </div>
            <div>
              <el-row :gutter="10" class="agent-available">
                <el-col :xs="4" :sm="4"><el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar></el-col>
                <el-col :xs="20" :sm="20" >
                  <div class="title">Aget Name</div>
                  <div class="content">Some conversation text here Some conversation text here...</div>
                </el-col>
              </el-row>
            </div>
            <div class="divider"></div>
            <el-row justify="center" type="flex">
              <el-button type="text" >View all conversations</el-button>
            </el-row>
          </el-card> -->

          <el-card class="box-card" :body-style="{padding:'0 '}" style="margin-top: 20px;">
            <div slot="header" class="clearfix">
              <span>Quick Links</span>
            </div>
            <div>
              <div v-for="suggestion in this.messageList[0].suggestions" :key="suggestion.code" @click="sendSuggestion(suggestion.code)">
                <el-row :gutter="10" class="agent-available" type="flex" align="middle" >
                  <el-col :xs="3" :sm="3" class="icon"><i class="el-icon-chat-line-square"></i></el-col>
                  <el-col :xs="18" :sm="18" >
                    <div class="title">{{ suggestion.label }}</div>
                  </el-col>
                  <el-col :xs="2" :sm="2" ><i class="el-icon-arrow-right"></i></el-col>
                </el-row>
              </div>
              <div class="divider"></div>
            </div>
            <div>
              <div @click="sendSuggestion('#')">
                <el-row :gutter="10" class="agent-available" type="flex" align="middle" >
                  <el-col :xs="3" :sm="3" class="icon"><i class="el-icon-chat-line-square"></i></el-col>
                  <el-col :xs="18" :sm="18" >
                    <div class="title">Chat with human</div>
                  </el-col>
                  <el-col :xs="2" :sm="2" ><i class="el-icon-arrow-right"></i></el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-card>
      </div>
      <div class="chat-box" v-if="!showIcebreaker">
        <ChatWindow
          hidden
          :message-list="messageList"
          :on-user-input-submit="onMessageWasSent"
          :participants="participants"
          :title="chatWindowTitle"
          :is-open="isOpen"
          :show-emoji="showEmoji"
          :show-file="showFile"
          :show-mic="showMic"
          :show-header="showHeader"
          :placeholder="placeholder"
          :show-typing-indicator="showTypingIndicator"
          :colors="colors"
          :always-scroll-to-bottom="alwaysScrollToBottom"
          :message-styling="messageStyling"
          @close="close"
          @scrollToTop="$emit('scrollToTop')"
          @onType="$emit('onType')"
          @edit="$emit('edit', $event)"
          @remove="$emit('remove', $event)"
        >
          <template v-slot:header>
            <slot name="header"> </slot>
          </template>
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
          <template v-slot:suggestion-button="scopedProps">
            <slot name="suggestion-button" 
              :suggestion="scopedProps.suggestion" 
              :colors="scopedProps.colors"
              :button="scopedProps.button"
              :sendSuggestion="scopedProps.sendSuggestion">
            </slot>
          </template>
        </ChatWindow>
      </div>
    </el-card>
    
      
  </div>
</template>

<script>
import {Row,Col,Card, Avatar} from 'element-ui';
import store from './store'
import ChatWindow from './ChatWindow.vue'

import CloseIcon from '@/assets/vendor/webchat/close-icon.png'
import OpenIcon from '@/assets/vendor/webchat/logo-no-bg.svg'

export default {
  components: {
    ChatWindow,
    Row,
    Col,
    Card,
    Avatar
  },
  props: {
    headerLogo:String,
    icons: {
      type: Object,
      default: function () {
        return {
          open: {
            img: OpenIcon,
            name: 'default'
          },
          close: {
            img: CloseIcon,
            name: 'default'
          }
        }
      }
    },
    showEmoji: {
      type: Boolean,
      default: false
    },
    showEdition: {
      type: Boolean,
      default: false
    },
    showDeletion: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    open: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    },
    showFile: {
      type: Boolean,
      default: false
    },
    showMic:{
      type: Boolean,
      default: false
    },
    showLauncher: {
      type: Boolean,
      default: true
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    participants: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: () => ''
    },
    titleImageUrl: {
      type: String,
      default: () => ''
    },
    onMessageWasSent: {
      type: Function,
      required: true
    },
    messageList: {
      type: Array,
      default: () => []
    },
    newMessagesCount: {
      type: Number,
      default: () => 0
    },
    placeholder: {
      type: String,
      default: 'Write a message...'
    },
    showTypingIndicator: {
      type: String,
      default: () => ''
    },
    launcherPosition:{
      type: String,
      default: 'right-bottom'
    },
    colors: {
      type: Object,
      validator: (c) =>
        'header' in c &&
        'bg' in c.header &&
        'text' in c.header &&
        'close' in c.header &&
        'launcher' in c &&
        'bg' in c.launcher &&
        'messageList' in c &&
        'bg' in c.messageList &&
        'sentMessage' in c &&
        'bg' in c.sentMessage &&
        'text' in c.sentMessage &&
        'receivedMessage' in c &&
        'bg' in c.receivedMessage &&
        'text' in c.receivedMessage &&
        'userInput' in c &&
        'bg' in c.userInput &&
        'text' in c.userInput &&
        'button' in c.userInput,
      default: function () {
        return {
          header: {
            bg: '#4e8cff',
            text: '#ffffff',
            close:"#ffffff"
          },
          launcher: {
            bg: '#4e8cff'
          },
          messageList: {
            bg: '#ffffff'
          },
          sentMessage: {
            bg: '#4e8cff',
            text: '#ffffff'
          },
          receivedMessage: {
            bg: '#f4f7f9',
            text: '#ffffff'
          },
          userInput: {
            bg: '#f4f7f9',
            text: '#565867',
            button:'#565867'
          }
        }
      }
    },
    alwaysScrollToBottom: {
      type: Boolean,
      default: () => false
    },
    messageStyling: {
      type: Boolean,
      default: () => false
    },
    disableUserListToggle: {
      type: Boolean,
      default: false
    }
  },
  data() {
        return {
          showIcebreaker:false
        }
  },
  created(){
    
  },
  computed: {
    chatWindowTitle() {
      if (this.title !== '') return this.title

      if (this.participants.length === 0) return 'You'
      if (this.participants.length > 1) return 'You, ' + this.participants[0].name + ' & others'

      return 'You & ' + this.participants[0].name
    }
  },
  watch: {
    $props: {
      deep: true,
      immediate: true,
      handler(props) {
        for (const prop in props) {
          store.setState(prop, props[prop])
        }
      }
    },
    messageList : function() {
      console.log('this.messageList',this.messageList);
      if(this.messageList?.length && this.messageList?.length == 1){
        this.showIcebreaker = this.messageList[0].id == 'icebrakerMsg'
      }
    }
  },
  methods: {
    openAndFocus() {
      this.open()
      this.$root.$emit('focusUserInput')
    },
    sendSuggestion(suggestion){
      this.onMessageWasSent({author: 'me', type: 'text', data: {text: suggestion}})
      this.showIcebreaker = false;
    },
    chatWithSupport(){
      this.showIcebreaker = false;
    }
  }
}
</script>

<style scoped>
.sc-launcher {
  width: 60px;
  height: 60px;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  right: 25px;
  bottom: 25px;
  border-radius: 50%;
  box-shadow: none;
  transition: box-shadow 0.2s ease-in-out;
  cursor: pointer;
}
.sc-launcher.right-sticky{
    right: 0 !important;
    border-radius: 50% 0 0 50%;
}
.sc-launcher.right-sticky .sc-open-icon{
    padding: 20px 10px 20px 30px;
}

.sc-launcher.left-sticky{
    left: 0 !important;
    border-radius: 0 50% 50% 0 ;
}
.sc-launcher.left-sticky .sc-open-icon{
    padding: 20px 30px 20px 10px;
}

.sc-launcher:before {
  content: '';
  position: relative;
  display: block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transition: box-shadow 0.2s ease-in-out;
}

.sc-launcher .sc-open-icon,
.sc-launcher .sc-closed-icon {
  width: 60px;
  height: 60px;
  position: fixed;
  right: 25px;
  bottom: 25px;
  transition: opacity 100ms ease-in-out, transform 100ms ease-in-out;
}

.sc-launcher .sc-closed-icon {
  transition: opacity 100ms ease-in-out, transform 100ms ease-in-out;
  width: 60px;
  height: 60px;
}

.sc-launcher .sc-open-icon {
  padding: 20px;
  box-sizing: border-box;
  opacity: 1;
}

.sc-launcher.opened .sc-open-icon {
  transform: rotate(-90deg);
  opacity: 1;
}

.sc-launcher.opened .sc-closed-icon {
  transform: rotate(-90deg);
  opacity: 1;
}

.sc-launcher.opened:before {
  box-shadow: 0px 0px 40px 25px rgba(148, 149, 150, 0.2);
}

.sc-launcher:hover {
  box-shadow: 0 0px 27px 1.5px rgba(0, 0, 0, 0.2);
}

.sc-new-messsages-count {
  position: absolute;
  top: -3px;
  left: 41px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  background: #ff4646;
  color: white;
  text-align: center;
  margin: auto;
  font-size: 12px;
  font-weight: 500;
}
</style>

<style lang="scss" scoped>
  .chat-landing{
    position: fixed;
    width: 375px;
    max-width: 100%;
    height: 0px; 
    opacity: 0;
    right: 20px;
    bottom: 20px;
    top: auto;
    border-radius: 16px;
    overflow: hidden;
    border: 0 none;
    box-shadow: 0 5px 40px #00000029;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    .el-icon-close{
      position: fixed;
      right: 40px;
      top: 30px;
    }
    .icebreaker{
      overflow-x: hidden;
      overflow-y: auto;
      height: 100%;
    }
    .chat-box{
      height: 100%;
      width: 100%;
    }
    &.open{
      opacity: 1;
      height: calc(100% - 35px); 
    }
    &-header{
      background: #002e79;
      padding: 20px;
      color: #fff;
    }
    .agent-available{
      padding: 8px;
      border-radius: 8px;
      width: 100%;
      max-width: 100%;
      background-color: hsla(0,0%,100%,.08);
      cursor: pointer;

      &:hover{
        background-color: rgba(165, 165, 165, 0.192);
      }
    }
    p{
      font-size: 14px;
    }
    .divider{
    background: #DCDFE6;
    height: 1px;
    margin-top: 0px;
    }
    .title{
      font-size: 16px;
    }
    .content{
      font-size: 14px;
    }
    .icon{
      font-size: 30px;
    }
  }

</style>