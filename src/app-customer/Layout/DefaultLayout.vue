<template>
    <div class="main-content-wrapper">
         <slot></slot>
    </div>
</template>

<script>

    export default {
        name: 'app',
        components: {
        },
        data : ()=> ({
        }),
        mounted:function(){
            console.log("Customer Layout is mounted")
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


</style>

