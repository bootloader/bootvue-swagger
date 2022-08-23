<template>
    <div class="app-container app-theme-white">
        <transition name="fade" mode="out-in" appear>
            <Header />
        </transition>
        <transition name="fade" mode="out-in" appear>
            <Sidebar />
        </transition>
        <div class="app-main__outer">
            <div class="app-main__inner">
                <slot></slot>
            </div>
            <transition name="fade" mode="out-in" appear>
                <Footer/>
            </transition>
        </div>
        <!-- Modal Component -->
        <b-modal id="modal1" title="Bootstrap-Vue">
            <p class="my-4">Hello from modal!</p>
        </b-modal>
        <b-modal id="modallg" size="lg" title="Large Modal">
            Hello Modal!
        </b-modal>
        <b-modal id="modalsm" size="sm" title="Small Modal">
            Hello Modal!
        </b-modal>
    </div>
</template>

<script>
    import Header from "./Header";
    import Sidebar from "./Sidebar";
    import Footer from "./Footer";
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'

    export default {
        name: 'app',
        components: {
            Header,
            Sidebar,
            Footer,
            VuePerfectScrollbar
        },
        methods: {
        },
    }
</script>

<style lang="scss">

::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: rgb(115, 115, 115);
  opacity: 1; /* Firefox */
  font-style: italic;
  font-size: 0.8em;
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
   color: rgb(115, 115, 115);
  font-style: italic;
  font-size: 0.8em;
}

::-ms-input-placeholder { /* Microsoft Edge */
   color: rgb(115, 115, 115);
  font-style: italic;
  font-size: 0.8em;
}
.form-group{
    label{
        color: #333;
    }
}
body{color: #333;}
</style>