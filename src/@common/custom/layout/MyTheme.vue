<template>
    <component :is="'style'" v-html="style">
    </component>  
</template>

<script>
    export default {
        props : {
        },
        components: {
        },
        computed : {
            style() {
                return `
                    :root {
                        --scheme-color: ${this.$global.MyConst.config.SETUP.POSTMAN_AGENT_SCHEME_COLOR};
                        --scheme-color-rgb : ${this.hex2rgb(this.$global.MyConst.config.SETUP.POSTMAN_AGENT_SCHEME_COLOR).rgb};
                        --scheme-color-rgba : ${this.hex2rgb(this.$global.MyConst.config.SETUP.POSTMAN_AGENT_SCHEME_COLOR).rgba};
                    }
                    `;
            }
        },
        methods : {
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
                        return {};
                }
                r = parseInt( r,16 );
                g = parseInt( g,16 );
                b = parseInt( b,16 );
                return { 
                    rgb : `${r} ${g} ${b}`,
                    rgba : `${r} , ${g} , ${b}`,
                 };
            }
        }
    }
</script>
