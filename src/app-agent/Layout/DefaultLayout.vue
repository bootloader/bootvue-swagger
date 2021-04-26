<template>
    <div class="main-content-wrapper">
        <Sidebar/>
        <div class="container-fluid h-100">
            <div class="row h-100">
                <div class="col-md-3 col-xl-3 chat">
                      <Contacts v-on:loaded="closeLoading"/>
                </div>
                <div class="col-xl-6 chat" 
                    v-bind:class="{
                        'col-md-6' : MyFlags.agent.showProfile,
                        'col-md-9' : !MyFlags.agent.showProfile,
                        'col-xl-6' : MyFlags.agent.showProfile,
                        'col-xl-9' : !MyFlags.agent.showProfile
                    }" >
                     <Chatbox/>
                </div>
                
                <div class="col-md-4 col-xl-3 chat" v-if="MyFlags.agent.showProfile">
                    <ContactProfile/>
                </div>
                
                
            </div>
        </div>

    </div>
</template>

<script>

    import Sidebar from './../Module/Sidebar';
    import Contacts from './../Module/Contacts';
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
            Contacts,Chatbox,ContactProfile,Sidebar,
            VuePerfectScrollbar,
            'font-awesome-icon': FontAwesomeIcon,
        },
        data : ()=> ({
            MyFlags
        }),
        mounted:function(){
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
    @import './../../assets/agent/css/dashboard.agent.css'
</style>

