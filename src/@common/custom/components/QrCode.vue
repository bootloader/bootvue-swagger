<template>
     <div class="text-center">
        <canvas class="channelqrcode" ref="qrcode"></canvas>
     </div>   
</template>

<script>
    import QRious from 'qrious';
    export default {
        inheritAttrs: false,
        props : {
            options : {
                default : function(){
                    return {
                    }
                }
            },
            value : {
                default : "hello"
            }
        },
        components: {
            QRious
        },
        mounted(){
            var qr = new QRious({
                background: 'white',
                backgroundAlpha: 0.8,
                foreground: 'black',
                foregroundAlpha: 0.8,
                level: 'H',
                padding: 25,
                size: 500,
                ...this.options,
                value: this.value,
                element: this.$refs.qrcode,
            });
        }
    }
</script>
