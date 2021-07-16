<template>
        <div class="mySidebar" id="mySidebar">


    <b-sidebar id="my-sidebar" title="Sidebar" class="scheme-color"
        width="200px" 
        :backdrop-variant="'transparent'"
        backdrop
        no-header
        shadow>

        <div class="mySidebar-container scheme-color">
            <nav class="mb-3">
                <b-nav vertical>
                    <b-nav-item v-b-toggle href="#my-sidebar" @click.prevent v-b-toggle.my-sidebar class="menu_btn_close">
                        <i class="fa fa-arrow-left">&nbsp;&nbsp;</i>
                    </b-nav-item>
                    <b-nav-item disabled class="text-align-center user-info">
<div style="height: 40px">
    <span class="fa-stack fa-1x float-left" style="font-size: 19px;">
      <i class="fas fa-user fa-stack-1x"></i>
      <i class="far fa-circle fa-stack-2x"></i>
    </span>
    <span class="float-left">
        {{MyConst.agent}}<br/><small>{{MyConst.dept}}</small><br>
        <i class="fa" v-bind:class="{ 'fa-check-circle' : isOnline, 'fa-minus-circle' : !isOnline }"/>&nbsp;
        <small><em>{{ isOnline ? 'Available' : 'Not Available'}}</em></small>
    </span>
</div>
                    </b-nav-item>
                    <b-nav-item :href="MyConst.appPrefix + '/auth/logout'">
                        <i class="fas fa-sign-out-alt">&nbsp;&nbsp;</i>Logout
                    </b-nav-item>
                    <b-nav-item :href="'/admin'">
                        <i class="fas fa-columns">&nbsp;&nbsp;</i>Go to Admin Panel
                    </b-nav-item>
                </b-nav>
            </nav>

                <hr />
                <span theme="dashboard.agent.metalic" class="w3-bar-item w3-button"
                    hidden><i class="fas fa-atom"></i> Metalic</span> <span
                    theme="dashboard.agent.indigo" class="w3-bar-item w3-button" hidden><i
                    class="fas fa-atom"></i> Indigo</span> <span
                    theme="dashboard.agent.bubble" class="w3-bar-item w3-button" hidden><i
                    class="fas fa-atom"></i> Bubble</span>



                <div class="s logo-src" v-bind:style="logoStyle" >
                    
                </div>
            </div>


    </b-sidebar>


        </div>
</template>

<script>
    import { MyFlags,MyConst } from './../../services/global';

    import { BSidebar } from 'bootstrap-vue'
    import 'bootstrap-vue/dist/bootstrap-vue.css'

    function menuFilter(menu){
        var header = null;
        return menu.filter(function(item){
            if(item.header == true){
                header = item;
                return true;
            }  
            if(item.child){
                item.child = menuFilter(item.child);
                item.enabled = (item.child.length > 0);
            }
            if(item.disabled === false || item.enabled === true){
                if(header)
                    header.enabled = true;
                return true;
            }
            return false;
        }).filter(function(item){
            return item.disabled === false || item.enabled === true;
        });
    }
    export default {
        components: {
            BSidebar
        },
        props: {
            sidebarbg: String,
        },
        data : () => ({
            MyFlags : MyFlags, MyConst : MyConst,
            logoStyle : {
                "background-image" : "url("+MyConst.logo.full_inverse+")"
            },
            showSidebarOpening : false
        }),
        computed : {
            isOnline :  function (){
                if(this.$store.getters.StateMeta){
                    return this.$store.getters.StateMeta.isOnline;
                }
                return false;
            },
        },
        methods: {
            toggleBodyClass(className) {
                const el = document.body;
                this.isOpen = !this.isOpen;

                if (this.isOpen) {
                    el.classList.add(className);
                } else {
                    el.classList.remove(className);
                }
            },
            toggleSidebarHover(add, className) {
                const el = document.body;
                this.sidebarActive = !this.sidebarActive;

                this.windowWidth = document.documentElement.clientWidth;

                if (this.windowWidth > '992') {
                    if (add === 'add') {
                        el.classList.add(className);
                    } else {
                        el.classList.remove(className);
                    }
                }
            },
            getWindowWidth() {
                const el = document.body;

                this.windowWidth = document.documentElement.clientWidth;

                if (this.windowWidth < '1350') {
                    el.classList.add('closed-sidebar', 'closed-sidebar-md');
                } else {
                    el.classList.remove('closed-sidebar', 'closed-sidebar-md');
                }
            },
        },
        mounted() {
            var THAT =  this;
            this.$nextTick(function () {
                window.addEventListener('resize', this.getWindowWidth);

                //Init
                this.getWindowWidth();
            })
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.getWindowWidth);
        }
    }
</script>
<style type="text/css" scoped >
    .logo-src{
        height: 45px;
        width: 165px;

        position: absolute;
        bottom: 5px;

        background-size: 140px auto;
        background-repeat: no-repeat;
        background-position: center;
        background-color: #fff0;
        padding: 0px;

    }
    .user-info {
        background-color: #0006;
    }
    .mySidebar {
      color: #ffffff!important;
      background-color: transparent!important
    }
    .mySidebar .mySidebar-container {
      /*background-color: #4953ba !important;*/
      height : 100%;
    }
    .mySidebar .menu_btn_close {
      background-color: rgb(0 0 0 / 12%) !important;
      color: #ffffff;
    }
    .mySidebar a{
        color: #fff!important;
        background-color: rgb(0 0 0 / 9%) !important;
    }
    .mySidebar a:hover{
      color : #FFF!important;
      background-color: rgb(0 0 0 / 50%) !important;
    }
    .w3-button:hover {
        color: #fff!important;
        background-color: #424ca9!important;
    }
    .fa-check-circle {
        color: #3aa233;
        font-size: smaller;
      }
    .fa-minus-circle {
        color: #c10505;
        font-size: smaller;
    }
</style>
