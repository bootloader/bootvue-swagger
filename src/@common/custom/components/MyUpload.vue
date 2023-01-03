<template>
    <vue-dropzone ref="myVueDropzone" class="myVueDropzone justify-content-center align-items-end d-flex"
        :useCustomSlot="true"
        id="dropzone" :options="{
            url: url,
            thumbnailWidth: thumbnailWidth,
            thumbnailHeight : thumbnailHeight,
            maxFilesize: maxFilesize,
            autoProcessQueue: autoProcessQueue,
            disablePreviews :disablePreviews,
            addRemoveLinks : addRemoveLinks
        }"
        v-on:vdropzone-sending="sendingEvent"
        v-on:vdropzone-file-added="fileAdded" 
        v-on:vdropzone-success="fileUploaded"
        :data-logo="value"
        :style="{
        'background-image' : 'url(\'' + value + '\')'
        }"
        >
        <slot>
            <div class="dropzone-custom-content">
                <h3 class="dropzone-custom-title">Drag and Drop file Here</h3>
            </div>
        </slot>    
    </vue-dropzone>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';

    export default {
        inheritAttrs: false,
        props : {
            thumbnailWidth : { default : 150 },
            thumbnailHeight : { default : 150 },
            maxFilesize : { default : 5 },
            autoProcessQueue : { type : Boolean, default : false },
            disablePreviews : { type : Boolean, default : false },
            addRemoveLinks : { type : Boolean, default : false },
            uploadUrl : { default : '/upload'},
            value : {
            },
            filter : {
            },
            optionLabel : {
            },
            emptyDisplay :{},
            invalidDisplay : {}
        },
        computed : {
            url (){
                return this.$formatters.clean_url( this.uploadUrl);
            }
        },
        methods :{
            fileAdded(){
                console.log("fileAdded")
            },
            sendingEvent(file, xhr, formData){
                //formData.append('tnt', this.model.domain);
            },
            async fileUploaded (file, response) {
                    //this.model.social.logo = response.results[0];
                let value = response.results[0];
                this.$emit("input", value);
                this.$emit("change", value);
                this.$refs.myVueDropzone.removeFile(file);
                console.log("fileUploaded",response)
            },
        },
        components: {
            vueDropzone : vue2Dropzone,
        }
    }
</script>
