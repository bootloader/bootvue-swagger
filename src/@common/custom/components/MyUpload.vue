<template>
    <span class="myVueDropzoneWrapper">
        <vue-dropzone v-if="uploadActive" ref="myVueDropzone" class="myVueDropzone justify-content-center align-items-end d-flex-x"
            :useCustomSlot="true"
            id="dropzone" :options="{
                url: url,
                thumbnailWidth: thumbnailWidth,
                thumbnailHeight : thumbnailHeight,
                maxFilesize: maxFilesize,
                autoProcessQueue: false,//autoProcessQueue,
                disablePreviews :disablePreviews,
                addRemoveLinks : addRemoveLinks,
                maxFiles : maxFiles,
                clickable : clickable
            }"
            v-on:vdropzone-sending="sendingEvent"
            v-on:vdropzone-file-added="fileAdded" 
            v-on:vdropzone-success="fileUploaded"
            v-on:vdropzone-thumbnail="thumbnail"
            :data-logo="value"
            :class="{
                'has-image' : !!value, 'no-image' : !value
            }">
            <slot>
                <div class="dropzone-custom-content" :style="{
                            'height' : 'calc('+height+'px)'
                }">
                    <span class="dropzone-custom-title">
                        <b-button class="" variant="outline-primary">
                            {{placeholder}}
                        </b-button> 
                    </span>    
                </div>
            </slot>    
        </vue-dropzone>
        <div v-else
            ref="myVueDropzone" class="myVueDropzone justify-content-center align-items-end d-flex-x  vue-dropzone dropzone"
            :class="{
                'has-image' : !!value, 'no-image' : !value
            }">
            <div class="media-wrapper" :style="{
                'height' : 'calc('+height+'px + 4em)'
            }" v-if="value"> 
                <img v-if="type=='IMAGE'" :src="value"  :style="{
                    'max-height' : 'calc('+height+'px + 4em)'
                }"/>
                <video v-else-if="type=='VIDEO'" :src="value"></video>
            </div> 
            <div class="dz-message">
                <slot>
                    <div class="dropzone-custom-content" :style="{
                            'height' : 'calc('+height+'px)'
                    }">
                        <span class="dropzone-custom-title" v-if="removable" >
                            <b-button variant="outline-danger" @click="removeFile"> Remove
                            </b-button>  
                        </span>    
                    </div>
                </slot> 
            </div>
        </div>    
    </span>    
</template>

<script>
    import vue2Dropzone from 'vue2-dropzone';
    import 'vue2-dropzone/dist/vue2Dropzone.min.css';

    export default {
        inheritAttrs: false,
        props : {
            thumbnailWidth : { default : 200 },
            thumbnailHeight : { default : 200 },
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
            type : {
                default : "IMAGE"
            },
            emptyDisplay :{},
            invalidDisplay : {},
            placeholder : {
                default : "Drag and Drop file Here"
            },
            maxFiles : {
                default : 1
            },
            readonly : {
                type : Boolean, default : false 
            },
            height : {
                type : Number,
                default : 100
            },
        },
        data() {
            return {
                lastMediaType : null, previewVideo : null, previewThumb : null, previewThumblob : null,
                canvasId : 'previewCanvas-'+ Date.now()
            }   
        },
        computed : {
            url (){
                return this.$formatters.clean_url( this.uploadUrl);
            },
            clickable(){
                return !this.readonly
            },
            single(){
                return this.maxFiles==1;
            },
            uploadActive (){
                return !(this.readonly || (this.single && !!this.value));
            },
            removable (){
                return !!this.value && !this.readonly
            },
            nowMediaType(){
                return this.lastMediaType || this.type
            }
        },
        methods :{
            fileAdded(file){
                if(file.type.indexOf('video/')==0){
                    this.lastMediaType = "VIDEO"
                } else if(file.type.indexOf('image/')==0){
                    this.lastMediaType = "IMAGE"
                }
                this.$emit("update:type", this.lastMediaType);
                if(this.lastMediaType == "VIDEO"){
                    const canvas = document.createElement("canvas");
                    const video = document.createElement("video");
                    if (video.canPlayType(file.type) !== "no"){
                        var fileURL = URL.createObjectURL(file);
                        video.autoplay = true;
                        video.muted = true;
                        this.previewVideo = fileURL;
                        video.src = URL.createObjectURL(file);
                        video.onloadeddata = () => {
                            let ctx = canvas.getContext("2d");
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                            video.pause();
                            this.createThumb(canvas);
                        }
                    }
                }
                console.log("fileAdded",file)
            },
            thumbnail(file, dataUrl){
                console.log("file, dataUrl",file, dataUrl);
                const canvas = document.createElement("canvas");
                const img = document.createElement("img");
                img.src = dataUrl;
                img.width = this.thumbnailWidth;
                img.height = this.thumbnailHeight;
                img.onload = () => {
                    let ctx = canvas.getContext("2d");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    this.createThumb(canvas);
                };
            },
            async createThumb(canvas){
                setTimeout(()=>{
                    this.previewThumb = canvas.toDataURL("image/png");
                    canvas.toBlob((blob)=>{
                        this.previewThumblob = blob;
                        this.processQueue();
                    },'image/png"')
                },1000);
            },
            sendingEvent(file, xhr, formData){
                if(this.previewThumblob){
                    console.log('thumbnail',this.previewThumblob)
                    formData.append('thumbnail', this.previewThumblob);
                }
            },
            async processQueue() {
                await this.$refs.myVueDropzone.processQueue();
            },
            async fileUploaded (file, response) {
                    //this.model.social.logo = response.results[0];
                let value = response.results[0];
                this.$emit("input", value?.url);
                this.$emit("change", value?.url);
                this.$emit("update:thumb", value?.thumb);
                this.$emit("update:type", value?.type);
                this.$emit("uploaded", value);
                this.$refs.myVueDropzone.removeFile(file);
                console.log("fileUploaded",response)
            },
            removeFile(){
                this.$emit("input", null);
                this.$emit("change", null);
                this.$emit("update:type", null);
                this.$emit("update:thumb", null);
            }
        },
        components: {
            vueDropzone : vue2Dropzone,
        }
    }
</script>
<style lang="scss" >
    .myVueDropzoneWrapper {
        display: inline-block !important;
        width: 100%;

        .dropzone .dz-message {
            background-color: #00000008;
            text-align: center;
            margin: 0 0;
            padding: 2em 0;
        }
        .myVueDropzone {
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            background-origin: content-box;
        }
        .myVueDropzone .media-wrapper {
            position: absolute;
            left : 37px; right : 37px;
            overflow: hidden;
            min-height: 100px;
            max-height: 200px;
            object-fit: contain;
            text-align: center;
            img {
                max-width: 100%;
                max-height: 100%;
            }
        }
        .myVueDropzone .dropzone-custom-content {
            cursor: pointer;
            padding: 2em 5px;
            /* background-color: #f3f3f3; */
            border-radius: 50px;
            color: #000;

            .dropzone-custom-title{
                display: inline-block;
                padding: 0px;
                border-radius: 0.375rem;
            }
        }
        .myVueDropzone.has-image .dropzone-custom-content {
            opacity: .4;
            color: rgba(0, 0, 0, 0.445);
        }
        .myVueDropzone.has-image:hover .dropzone-custom-content {
            opacity: .8;
            .dropzone-custom-title{
                background-color: #0000008c;
                &:hover{
                    background-color: transparent;
                }
            }
        }
        .myVueDropzone.no-image .dropzone-custom-content {
            opacity: 1;
        }
        .hiddenPreview {
            height: 600px;
            width: 600px;
            overflow: hidden;
            img,video {
                width: 200px;
            }
        }

        .vue-dropzone>.dz-preview {
            .dz-remove  {
                z-index: 1090;
                background-color: #ad2123;
                width: 43%;
                right: 10px;
                content: 'X';
                font-size: .5em;
                padding: 5px;
                top: 21px;
                bottom: auto;
            }
        }

    }
</style>
