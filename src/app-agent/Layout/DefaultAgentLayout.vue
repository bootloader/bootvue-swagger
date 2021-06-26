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
                <div class="col-xs-12 col-sm-12 col-md-8 col-lg-6 col-xl-6  chat""
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

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faCog,
    } from '@fortawesome/free-solid-svg-icons'
    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

    library.add(
        faCog,
    );
    export default {
        name: 'app',
        components: {
            Contacts,Chatbox,ContactProfile,Sidebar,ContactSearch,
            VuePerfectScrollbar,
            'font-awesome-icon': FontAwesomeIcon,
        },
        data : ()=> ({
            MyFlags
        }),
        mounted:function(){
            console.log("THIS IS AGENT LAYOUT");
            //this.closeLoading(); //method1 will execute at pageload
        },
        methods: {
            closeLoading : function (argument) {
                var element = document.getElementsByTagName("html")[0];
                element.className = element.className.replace(/\loading\b/g, "")
            }
        },
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

