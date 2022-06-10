<template>
    <span class="m-auto">
        <vue-player v-if="secureType == 'video'"
            :id="'detailplayer'" 
            :type="secureFormat" 
            :auto="auto" 
            :isSwf="swf" 
            :src="secureSource" 
            :height="'300px'">
        </vue-player>
        <img v-else :src="secureSource" :width="width" :height="height" />
    </span>
</template>
<script>
import Vue from 'vue';
import VuePlayer from 'vue-player-media';
Vue.use(VuePlayer);

export default {
    props : {
        type : {
        },
        format : {
        },
        auto : {
            type : Boolean,
            default : false
        },
        swf : {
            type : Boolean,
            default : false
        },
        src : {
        }, 
        height : {
        },
        width : {
        }
    },
    computed : {
        secureSource(){
            return this.src;
        },
        secureFormat(){
            if(this.format){
                return this.format;
            }
            let file =  this.secureSource.split('?')[0].split('.'); 
            let ext = file[file.length-1];
            return ext;
        },
        secureType(){
            if(this.type){
                return this.type;
            } else if(this.secureFormat) {
                switch(this.secureFormat){
                    case 'mp4':
                        return 'video';    
                }
            }
            return 'image';
        }
    }
}
</script>