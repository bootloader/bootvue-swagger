<template>
    <div>
      <master-view id="scriptus-editor"  ref="jseditor"
      :header="{
          heading: heading,
          subheading: subheading,
          icon: icon,
      }" :filters="[
            { label : 'Terminal', name : 'terminalwin' },
            { label : state, name : 'saveScript'},
      ]">
      <template #filter(saveScript)="{filter}">
        <b-button variant="success" :disabled="table.busy" @click="saveScript">{{filter.label}}</b-button>&nbsp;
      </template>
      <template #filter(terminalwin)="{}">
        <b-button :variant="showTerminal ? 'grey' : 'outline-grey'" 
          @click="terminalwin"><i class="fas fa-terminal"></i></b-button>&nbsp;
      </template>
      <template #body>
        <div class="editor pane" :style="{width:width,height : editorHeight}" >
          <AceEditor 
              v-model="content"  ref="aceEditor"
              @init="editorInit" 
              lang="javascript" 
              theme="monokai" 
              :width="editorWidth" 
              :height="editorHeight"
              :options="{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  fontSize: 12,
                  highlightActiveLine: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                  showPrintMargin: false,
                  showGutter: true,
                  autoScrollEditorIntoView : true,
                  wrapBehavioursEnabled : true,
                  navigateWithinSoftTabs : true,
                  hScrollBarAlwaysVisible : true,
                  fixedWidthGutter : true,
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
        <div class="pane" :style="{width:width,height : editorHeight}">
          <ScriptusTerminal v-show="showTerminal"
            :user="terminal.user"  :logs="terminal.logs" :system="terminal.system">
            <template #terminalbar>
                <setup-configuration-key class="text-white"
                      configKey="postman.debug.contact" readable editable
                      @load="loadDebugContact">
                </setup-configuration-key>
            </template> 
          </ScriptusTerminal>
        </div>  
      </template>  
      </master-view>


    </div>
</template>

<script>

    import AceEditor from 'vuejs-ace-editor';
    import ScriptusTerminal from './ScriptusTerminal.vue';
    import SetupConfigurationKey from './SetupConfigurationKey.vue';
    import botfun from './snippets/botfun';

    export default {
        components: {
          AceEditor,ScriptusTerminal,
            SetupConfigurationKey
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
            editorHeight : (window.document.body.scrollHeight-20) + 'px',
            editorWidth : '100%',
            width : '100%',

            showTerminal : false, 
           terminal : {
              system : '>',
              user : "lt@someone",
              logs : [
              ]
           }

        }),
        computed : {
        },
        created : function (argument) {
         // console.log("created",this.$refs.editor.clientHeight)
        },
        mounted : function (argument) {
          this.editorHeight =  (window.document.body.scrollHeight-80) + 'px';
          this.load();
          let THAT = this;
          //this.loadDebugContact();
          this.loadWebChat();
        },
        methods : {
          async load (){
            try {
              this.table.busy = true;
              this.state = "Loading...";
              let resp = await this.$service.get('/api/objects/appscript/'+this.$route.params.appId);
              console.log('load',resp)
              if(resp.meta){
                this.heading = resp.meta.appName;
                this.subheading = resp.meta.appQueue;
              }
              if(resp.results[0].data?.content){
                this.content = resp.results[0].data.content;
              }
            } finally {
              this.table.busy = false;
              this.state = "Save";
            }
          },
          async loadDebugContact(e){
            console.log("loadDebugContact",e)
            //let resp = await this.$service.get("/api/config?key=postman.debug.contact");
            this.terminal.user = e?.config?.value;
            this.loadLogs();
          },
          async loadLogs(){
            if(this.showTerminal){
              try {
                if(this.terminal.user){
                let resp = await this.$service.get('/api/objects/appscript/'+this.$route.params.appId+"/logs");
                  for(var i in resp.results){
                    this.terminal.logs.push(resp.results[i].logs);
                  }
                }
              } catch(e){
                  console.error(e);
              }
            }
            clearTimeout( this.trail);
            this.trail = setTimeout(()=> this.loadLogs(),2000);
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
          editorInit: function (editor) {
              //botfun();
              require('brace/ext/searchbox')
              require('brace/ext/language_tools') //language extension prerequsite...
              require('brace/mode/html')                
              require('brace/mode/javascript')    //language
              require('brace/mode/less')
              require('brace/theme/monokai')
              require('brace/snippets/javascript') //snippet
              var langTools = ace.acequire("ace/ext/language_tools");
              editor.setOptions({enableBasicAutocompletion: true});
              langTools.addCompleter(botfun);
              
          },
          terminalwin(){
            this.showTerminal = !this.showTerminal;
            this.width =  this.showTerminal ? '50%' : '100%';
            this.editorWidth = this.showTerminal ? '99%' : '100%';
          },
          async loadWebChat(){
            console.log("this.$global.MyConst.cdn",this.$global.MyConst.cdn)
            let recaptchaScript = document.createElement('script')
            recaptchaScript.setAttribute('src', this.$global.MyConst.cdn + '/plugins/customer.js?theme=bubble');
            recaptchaScript.innerHTML = JSON.stringify({
                "domain" : [this.$global.MyConst.appDomain || this.$global.MyConst.tenant,this.$global.MyConst.config.PROP_SERVICE_SERVER].join("."),
                "channelId" : "web:"+this.$global.MyConst.config.PROP_SERVICE_SERVER,
                "channelKey" : "1gdmxikhbf5fz56SR5JRDFY",
                "config" : {
                      "header.bg.color" : "#1e293b",
                      "header.text.color" : "#ffffff",
                      "header.icon.url" : "https://cdn.jsdelivr.net/gh/mehery-soccom/mehery-web-dist@834bfa2c3b8060cac2ebcd7778758d6021be2dca/dist/logo/logo-tiny-o.png",
                      "header.title.text" : "Support",
                      //"header.disabled" : true,
                      "launcher.bg.color" : "#1e293b",
                      //"launcher.open" : true,
                      "messageList.bg.color" : "#ffffff",
                      "sentMessage.bg.color" : "#4e8cff",
                      "sentMessage.text.color" : "#ffffff",
                      "receivedMessage.bg.color" : "#eaeaea",
                      "receivedMessage.text.color" : "#222222",
                      "userInput.bg.color" : "#f4f7f9",
                      "userInput.text.color" : "#565867"
                  }
              });
            document.body.appendChild(recaptchaScript);
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
      overflow-x: scroll;
    }
    .pane {
      float: left;
    }
  }
</style>
