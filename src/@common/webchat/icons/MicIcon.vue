<template>
  <div class="sc-user-input--picker-wrapper">
    <div v-if="isActive" class="card-body upload_card_body">
      <av-media
        class="av-media"
        type="frequ"
        :media="media"
        line-color="white"
        frequ-direction="mo"
        :frequ-lnum="60"
      />
      <div class="button-wrapper">
        <b-button
          class="btn-sm text-white:hover"
          variant="outline-white-dirty"
          pill
          @click="onCancelRecording"
        >
          Cancel
        </b-button>
        <b-button
          class="btn-sm text-white:hover"
          variant="outline-white-dirty"
          pill
          @click="onSendRecording"
        >
          Stop and Send
        </b-button>
      </div>
    </div>
    <button class="sc-user-input--emoji-icon-wrapper" @click.prevent="openAudioRecord">
      <svg
        class="sc-user-input--emoji-icon"
        :class="{active: isActive}"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 490.2 490.2"
      >
        <path
          :style="{fill: color}"
          d="M146.146,99.2v127.6c0,54.7,44.5,99.2,99.2,99.2s99.2-44.5,99.2-99.2V99.2c0-54.7-44.5-99.2-99.2-99.2
				S146.146,44.5,146.146,99.2z M310.246,99.2v127.6c0,35.8-29.1,64.9-64.9,64.9s-64.9-29.1-64.9-64.9V99.2
				c0-35.8,29.1-64.9,64.9-64.9S310.246,63.4,310.246,99.2z"
        />
        <path
          :style="{fill: color}"
          d="M393.046,209.7c-9.5,0-17.2,7.7-17.2,17.1c0,72-58.6,130.6-130.6,130.6s-130.6-58.6-130.6-130.6
				c0-9.5-7.7-17.1-17.2-17.1s-17.2,7.7-17.2,17.1c0,85.1,64.8,155.4,147.7,164v65.1h-57.3c-9.5,0-17.2,7.7-17.2,17.2
				s7.7,17.1,17.2,17.1h148.9c9.5,0,17.2-7.7,17.2-17.1c0-9.5-7.7-17.2-17.2-17.2h-57.3v-65.1c82.9-8.6,147.7-78.9,147.7-164
				C410.246,217.4,402.546,209.7,393.046,209.7z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
import getUserMedia from 'get-user-media-promise';

export default {
  components: {getUserMedia},
  props: {
    onChange: {
      type: Function,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isActive: false,
      media: null,
      mediaRecorder: null
    }
  },
  methods: {
    _openPicker(e) {
      this.isActive = !this.isActive
    },
    _handlePickerBlur() {
      this.isActive = false
    },

    openAudioRecord: function () {
      this.isActive = !this.isActive
      let chunks = []
      let _THAT = this;
      getUserMedia({audio: true})
        .then(function (stream) {
          _THAT.media = stream
          const mime = 'video/mp4; codecs="avc1.424028, mp4a.40.2"'
          _THAT.mediaRecorder = new MediaRecorder(_THAT.media)
          _THAT.mediaRecorder.start()
          _THAT.mediaRecorder.onstop = function (e) {
            if (_THAT.uploadRecording) {
              let blob = new Blob(chunks, {type: 'audio/mpeg'})
              _THAT.media.getTracks().forEach((track) => track.stop())
              chunks = []
              _THAT.mediaRecorder = null
              let audioFile = new File([blob], "Recording.mp3", {
                type: 'audio/mpeg'
              });
              _THAT.onChange(audioFile);
            } else {
              _THAT.media.getTracks().forEach((track) => track.stop())
              chunks = []
              _THAT.mediaRecorder = null
            }
          }
          _THAT.mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data)
          }
        })
        .catch(function (error) {
          console.error(error);
        })
    },
    onSendRecording() {
      this.uploadRecording = true
      this.mediaRecorder.stop();
      this.isActive = false
    },
    onCancelRecording() {
      this.uploadRecording = false
      this.mediaRecorder.stop(false)
      this.isActive = false
    }
  }
}
</script>

<style scoped>
.sc-user-input--emoji-icon-wrapper {
  display: block;
  background: none;
  border: none;
  padding: 0px;
  margin: 0px;
  outline: none;
}

.sc-user-input--emoji-icon-wrapper:focus {
  outline: none;
}

.sc-user-input--emoji-icon {
  display: block;
  cursor: pointer;
}
.upload_card_body {
  position: fixed;
  top: 55px;
  left: 0;
  right: 0;
  bottom: 55px;
  background-color: #1e293b;
  z-index: 1;
}
.av-media {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 100px);
}

.button-wrapper {
  display: flex;
  height: 100px;
  justify-content: center;
  align-content: space-between;
}
.button-wrapper .btn-sm {
  width: 40%;
  margin: 0 10px;
  height: 50px;
  box-shadow: 0 1.5px 1.5px #00000052;
  background-color: #fff;
  color: #000;
  font-size: 18px;
  max-width: 200px;
}
</style>
<style type="text/css">
.av-media canvas {
  max-height: 100px;
  height: 100%;
}
</style>
