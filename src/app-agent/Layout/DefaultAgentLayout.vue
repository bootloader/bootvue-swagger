<template>
    <div class="main-content-wrapper">
        <Sidebar/>
        <div class="container-fluid h-100">
            <div class="row h-100">

                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 chat"
                    v-bind:class="{
                        'd-none d-sm-none d-md-block' : MyFlags.agent.mvu!='CONTACTS',
                    }">

                    <div id="my-contact-search"
                        class="chat hSlider-wrapper"
                         v-bind:class="{
                            'open' : MyFlags.agent.showContactSearch,
                        }">
                        <ContactSearch/>                     
                    </div>
                      
                    <Contacts v-on:loaded="closeLoading"/>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-8 col-lg-6 col-xl-6  chat"
                    v-bind:class="{
                        'col-lg-6' : (MyFlags.agent.showProfile && MyFlags.agent.showProfileAllowed),
                        'col-lg-9' : !(MyFlags.agent.showProfile && MyFlags.agent.showProfileAllowed),
                        'col-xl-6' : (MyFlags.agent.showProfile && MyFlags.agent.showProfileAllowed),
                        'col-xl-9' : !(MyFlags.agent.showProfile && MyFlags.agent.showProfileAllowed),
                        'd-none d-sm-none d-md-block' : MyFlags.agent.mvu!='CHATBOX',
                    }" >
                     <Chatbox/>
                </div>
                
                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 chat" 
                        v-if="MyFlags.agent.showProfile && MyFlags.agent.showProfileAllowed"
                       v-bind:class="{
                            'd-none d-sm-none d-md-block' : MyFlags.agent.mvu!='CPROFILE',
                        }">
                    <ContactProfile/>
                </div>
                
                
            </div>
        </div>

    <component is="style" v-html="style">
    </component>

    </div>
</template>

<script>

    import Sidebar from './../Module/Sidebar';
    import Contacts from './../Module/Contacts';
    import ContactSearch from './../Module/ContactSearch';
    import Chatbox from './../Module/Chatbox';
    import ContactProfile from './../Module/ContactProfile';
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';
    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import debounce from 'debounce';

    export default {
        name: 'app',
        components: {
            Contacts,Chatbox,ContactProfile,Sidebar,ContactSearch,
            VuePerfectScrollbar,
        },
        data : ()=> ({
            MyFlags,MyConst
        }),
        computed: {
            style() {
                return `
                    :root {
                        --scheme-color: ${MyConst.config.SETUP.POSTMAN_AGENT_SCHEME_COLOR};
                        --scheme-color-rgb : ${this.hex2rgb(MyConst.config.SETUP.POSTMAN_AGENT_SCHEME_COLOR)}
                    }
                    `;
            }
        },
        mounted:function(){
            console.log("THIS IS AGENT LAYOUT");
            //this.closeLoading(); //method1 will execute at pageload
            this.viewUpdate();
        },
        watch: {
           '$route.params.profileView': function (profileView) {
                this.viewUpdate();
            },
            '$route.params.mvu': function (profileView) {
                this.viewUpdate();
            }
        },
        methods: {
            closeLoading : function (argument) {
                var element = document.getElementsByTagName("html")[0];
                element.className = element.className.replace(/\loading\b/g, "")
            },
            viewUpdate : debounce(function () {
                console.log("profileView",this.$route.params.profileView)
                MyFlags.agent.profileView = this.$route.params.profileView || MyFlags.agent.profileView;
                MyFlags.agent.mvu = this.$route.params.mvu || MyFlags.agent.mvu;
                MyFlags.agent.showProfile = (MyFlags.agent.profileView !== 'hide');
            },200),
            hex2rgb : function (color) {
                if ( color[0] == '#' ) {
                        color= color.substr(1);
                }

                console.log("color",color);

                var r,g,b;
                if ( color.length == 6 ) {
                    [ r, g, b ] = [ `${color[0]}${color[1]}`, `${color[2]}${color[3]}`, `${color[4]}${color[5]}` ];
                } else if ( color.length == 3 ) {
                        [ r, g, b ] = [ `${color[0]}${color[0]}`, `${color[1]}${color[1]}`, `${color[2]}${color[2]}` ];
                } else {
                        return false;
                }
                r = parseInt( r,16 );
                g = parseInt( g,16 );
                b = parseInt( b,16 );
                return `${r} ${g} ${b}`;
            }
        },
        created(){
            this.$store.dispatch('LoadQuickLabels');
            this.$store.dispatch('LoadQuickTags')
        }
    }
</script>

<style lang="css">
    @import './../../assets/agent/css/dashboard.agent.css';
    @import 'https://fonts.googleapis.com/css?family=Reenie+Beanie|Lato:700';
    .main-content-wrapper {
        overflow: hidden;
    }
    .modal-dialog.modal-dialog-sm  .modal-header, .modal-dialog.modal-dialog-sm  .modal-footer{
        padding: 8px 16px;
    }
    .modal-dialog.modal-dialog-sm .modal-title {
        font-size: 16px;
    }


.hSlider-wrapper {
  position: absolute; 
  z-index: 100;
  top: 0;
  transition: all 0.5s ease-out; 
  padding: 0px; 
  margin: 0px;
  background: #ddd0;
  overflow: hidden;
  left: 0; 
  background: #000;
  width: 100%;
}

.hSlider-wrapper .hSlider {
    width: 100%;
}
.hSlider-wrapper:not(.open) {
  left: -100%;
}
.hSlider-wrapper.open {
  left: 0; 
  
}



</style>

