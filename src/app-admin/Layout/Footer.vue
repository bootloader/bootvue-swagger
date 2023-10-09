<template>
    <div class="app-footer">
        <div class="app-footer__inner text-center">
            Copyright &copy; {{year}} {{$config.PROP_SERVICE_NAME}} - All Rights Reserved
        </div>
    </div>
</template>

<script>
    export default {
        name: "Footer",
        components: {
        },
        data() {
            return {
                year: new Date().getFullYear()
            };
        }
    };
</script>
