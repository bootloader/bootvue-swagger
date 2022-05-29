<template>
    <div>
      <master-view id="scriptus-editor"  ref="jseditor"
      :header="{
          heading: heading,
          subheading: subheading,
          icon: icon,
      }" :filters="[{ label : state, name : 'saveScript'}]">
      <template #filter(saveScript)="{filter}">
        <b-button variant="success" :disabled="table.busy" @click="saveScript">{{filter.label}}</b-button>&nbsp;
      </template>
      <template #body>
        <div class="editor" >
          <AceEditor 
              v-model="content" 
              @init="editorInit" 
              lang="javascript" 
              theme="monokai" 
              width="100%" 
              :height="editorHeight"
              :options="{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  fontSize: 14,
                  highlightActiveLine: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                  showPrintMargin: false,
                  showGutter: true,
              }"
              :commands="[
                  {
                      name: 'save',
                      bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
                      exec: dataSumit,
                      readOnly: true,
                  },
              ]"
              />
        </div>
      </template>  
      </master-view>
    </div>
</template>

<script>

    import AceEditor from 'vuejs-ace-editor';

    export default {
        components: {
          AceEditor
        },
        data: () => ({
            heading: 'App Script',
            subheading: 'Write your own bot script',
            icon: 'icon-gradient bg-tempting-azure fab fa-codepen',
            actions : [{
              label : "Add Team", icon : "plus", name : "ADD_ITEM"
            }],
            table : {
              fields: [ { key : 'name', label : "Name" }, { key : 'code', label : "Code" }, 
                //{ key : 'dept_email', label : "Email" },
                { key: 'actions', label: 'Actions' }],
              busy : false,
              sortBy: 'name',
            },
            modelName :  "MODAL_ADD_TEAM",
            content : "",
            state : "Save",
            editorHeight : (window.document.body.scrollHeight-20) + 'px'
        }),
        computed : {
        },
        created : function (argument) {
         // console.log("created",this.$refs.editor.clientHeight)
        },
        mounted : function (argument) {
          this.editorHeight =  (window.document.body.scrollHeight-80) + 'px';
          this.load()
        },
        methods : {
          async load (){
            try {
              this.table.busy = true;
              this.state = "Loading...";
              let resp = await this.$service.get('/api/objects/appscript/'+this.$route.params.appId);
              console.log('load',resp)
              if(resp.results[0].data?.content){
                this.content = resp.results[0].data.content;
              }
            } finally {
              this.table.busy = false;
              this.state = "Save";
            }
          },
          async saveScript(){
            try {
              this.table.busy = true;
              this.state = "Saving...";
              let resp = await this.$service.post('/api/objects/appscript/'+this.$route.params.appId,{
                files : [{
                  name : "main",
                  content : this.content
                }] 
              });
            } finally {
              this.table.busy = false;
              this.state = "Save";
            }
          },
          dataSumit() {
              this.saveScript();
          },
          editorInit: function () {
              require('brace/ext/language_tools') //language extension prerequsite...
              require('brace/mode/html')                
              require('brace/mode/javascript')    //language
              require('brace/mode/less')
              require('brace/theme/monokai')
              require('brace/snippets/javascript') //snippet
          }
        }
    }
</script>
<style lang="scss">
  #scriptus-editor {
    .app-page-title {
        padding: 0px;
        margin: 0px 0px 0px;
        position: relative;
    }
    .editor {
      height: 100%;
    }
  }
</style>
