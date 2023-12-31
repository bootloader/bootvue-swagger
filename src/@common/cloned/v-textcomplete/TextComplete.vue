<template>
  <div :class="['complete-box', boxClass]">
    <textarea :id="'v-textcomplete-' + id"
              ref="textarea"
              :value="value"
              @input="updateValue($event.target.value)"
              :style="textareaStyle"
              :class="['v-textcomplete__inner', areaClass]"
              :placeholder="placeholder"
              :rows="rows"
              name="textcomplete"
              @focus="handleFocus"
              @blur="handleBlur"
              @keydown="keyEvent" 
              @keyup="keyUp"></textarea>

    <div class="autocomplete transition" :id="'autocomplete-' + id" v-show="showList">
      <ul>
        <li v-for="(value, index) in list" :key="index"
            :class="(actived.value == value) ? 'active' : ''"
            @click="selectList(value)"
            v-html="template(value)"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import calcTextareaHeight from './calcTextareaHeight'
import { default as getCaretCoordinates } from 'textarea-caret'
import { default as keyEvent } from './keyEvent'

export default {
  mixins: [keyEvent],
  props: {
    resize: String,
    value:  String,
    boxClass: String,
    areaClass: String,
    placeholder: String,
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    lineHeight: {
      type: Number,
      default: 20
    },
    strategies: {
      type: Array,
      default() {
        return []
      }
    },
    selectedDefaultFirst: {
      type: Boolean,
      default: true
    },
    rows: {
      type: [Number,String],
      default: 2
    },
    nonewline : {
      type : Boolean, 
      default : false
    }
  },
  data() {
    return {
      id: Math.random().toString(36).substr(5),
      content: this.value,
      showList: false,
      cursor: 0,
      list: [],
      matched: [],
      match: '',
      actived: { value: '', index: 0 },
      template: () => {},
      replace: () => {},
      textareaCalcStyle: {},
    }
  },
  mounted() {
    this.resizeTextarea()
  },
  computed: {
    textareaStyle() {
      return Object.assign({
        'line-height': this.lineHeight + 'px',
        resize: this.resize,
      }, this.textareaCalcStyle)
    }
  },
  watch: {
    value() {
      this.change()
      this.resizeTextarea()
    }
  },
  methods: {
    handleFocus(event) {
      this.$emit('focus', event);
      this.$emit('active', {active:true});
    },
    handleBlur(event) {
      this.$emit('blur', event);
      this.$emit('active', {active:false});
    },
    resizeTextarea() {
      var { autosize } = this
      if (!autosize) return
      const minRows = autosize.minRows
      const maxRows = autosize.maxRows

      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows)
    },
    updateValue: function (value) {
      this.$refs.textarea.value = value
      if(this.nonewline){
        value = value.replace(/\n/g, " "); 
      }
      this.$emit('input', value)
    },
    change() {
      let that = this
      this.strategies.forEach((item) => {
        let autocomplete = document.getElementById('autocomplete-' + that.id)
        let textarea = document.getElementById('v-textcomplete-' + that.id)
        let content = textarea.value.substring(0, textarea.selectionEnd)
        let match = ''

        match = content.match(item.match)

        if (match != null) {
          let i = match[2].replace(/(^\s*)|(\s*$)/g, '')
          let cursorPosition = that.getCursorPosition(textarea)
          let scroll = that.getElementScroll(textarea)
          let coordinates = getCaretCoordinates(textarea, cursorPosition)
          let top = coordinates.top + that.lineHeight - scroll.top
          let left = coordinates.left + textarea.offsetLeft
          let clientHeight = document.documentElement.offsetHeight

          that.template = item.template
          that.match = item.match
          that.replace = item.replace

          if (item.list != undefined && item.list.length > 0 && match[2] == '') {
            that.list = item.list
          } else {
            if (item.remote) {
              that.list = []
              item.remote(i, (list) => {
                if (list.length !== 0) {
                  that.list = list
                  item.search(i, that.getList,content)
                  that.showList = true
                }
              })
            } else {
              item.search(i, that.getList,content)
            }
          }

          if ((clientHeight - textarea.getBoundingClientRect().top) < (that.lineHeight * this.list.length)) {
            autocomplete.style.top = - (that.lineHeight * this.list.length) - ( 2 * top ) + 'px'
          } else {
            autocomplete.style.top = top + 'px'
          }

          autocomplete.style.left = left + 'px'

          that.matched.push(match)
        } else {
          that.matched.push(null)
        }
      })

      let filterMatched = this.matched.filter((value) => { return value != null }).length > 0

      this.showList = (filterMatched && this.list.length > 0) ? true : false

      if(!this.showList) {
        this.actived.value = ''
        this.actived.index = 0
      }

      if(this.selectedDefaultFirst) {
        this.actived.value = this.list[0]
      }
      this.matched = []
    },
    getElementOffset(element) {
      let rect = element.getBoundingClientRect()
      let {defaultView, documentElement} = element.ownerDocument
      let offset = { top: rect.top + defaultView.pageYOffset, left: rect.left + defaultView.pageXOffset }

      if (documentElement) {
        offset.top -= documentElement.clientTop
        offset.left -= documentElement.clientLeft
      }

      return offset
    },
    getList(list) {
      this.list = list
    },
    selectList(value) {
      let textarea = document.getElementById('v-textcomplete-' + this.id)
      let cursorPosition = this.getCursorPosition(textarea)
      let start = textarea.value.substring(0, textarea.selectionEnd)
      let end = textarea.value.slice(textarea.selectionEnd)

      if (!start.match(this.match)) {
        this.setCaretPosition(textarea, cursorPosition)
        this.showList = false
        this.actived.value = ''
        this.actived.index = 0
        return
      }

      let replaceValue = this.replace(value,end);
      
      let replace,cursorPositionNew;
      if(typeof replaceValue == 'string'){
        replace = start.replace(this.match, replaceValue);
        cursorPositionNew = replace.length;
      } else {
        replace = start.replace(this.match, replaceValue[0]+replaceValue[1]);
        cursorPositionNew = replace.length-replaceValue[1].length;
      }
      this.updateValue(replace + end)

      textarea.focus()

      this.setCaretPosition(textarea, cursorPositionNew)

      this.showList = false
      this.actived.value = ''
      this.actived.index = 0
    },
    getCursorPosition(element) {
      var CaretPos = 0
      if (document.selection) {
        element.focus()

        let selection = document.selection.createRange()

        selection.moveStart ('character', -element.value.length)
        CaretPos = selection.text.length
      } else if (element.selectionStart || element.selectionStart == '0') {
        CaretPos = element.selectionStart
      }
      return (CaretPos)
    },
    getElementScroll(element) {
      return { top: element.scrollTop, left: element.scrollLeft }
    },
    setCaretPosition(element, position){
      if(element.setSelectionRange) {
        element.focus()
        setTimeout(() => element.setSelectionRange(position, position), 1)
      } else if (element.createTextRange) {
        var range = element.createTextRange()
        range.collapse(true)
        range.moveEnd('character', position)
        range.moveStart('character', position)
        range.select()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.complete-box {
  position: relative;
}
textarea {
  overflow: auto;
}
.v-textcomplete__inner {
  //EMpty Are
}
.autocomplete {
  background-color: #fff;
  position: absolute;
  z-index: 1000;
}
.autocomplete ul {
  list-style: none;
  padding-left: 0;
  border: 1px #f3f5f7 solid;
  border-radius: 3px;
  margin: 0;

  li {
    padding-left: 5px;
    padding-right: 5px;
    border-bottom: 1px solid #f3f5f7;
    cursor: pointer;

    &:hover {
      background-color: #f3f5f7;
    }
    span small {
      padding-left: 10px;
    }
  }
  .active {
    background-color: #f3f5f7;
  }
}
</style>
