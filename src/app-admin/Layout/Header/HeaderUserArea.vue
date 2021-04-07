<template>
    <div class="d-flex">
        <div class="header-btn-lg pr-0">
            <div class="widget-content p-0">
                <div class="widget-content-wrapper">
        
                     <div class="widget-content-left">
                        <b-dropdown toggle-class="p-0 mr-2" menu-class="dropdown-menu-lg" variant="link" right>

                        <div class="widget-content-left  ml-3 header-user-info">
                            <div class="widget-heading" v-if="!!MyConst.user" >{{MyConst.user}}</div>
                            <div class="widget-subheading">System Admin</div>
                        </div>

                            <span slot="button-content">
                                <div class="icon-wrapper icon-wrapper-alt rounded-circle">
                                    <img width="42" class="rounded-circle" src="@/assets/images/avatars/profile.png" alt="">
                                </div>
                            </span>
                            <div tabindex="-1" class="dropdown-divider"></div>
                            <span v-if="!!MyConst.user">
                                <a  :href="MyConst.appPrefix + '/auth/logout'"
                                    type="button" tabindex="0" class="dropdown-item">Logout</a>
                            </span>
                            <span v-else>
                                <a :href="MyConst.appPrefix + '/auth/logout'" class="dropdown-item" >Login</a>
                            </span>
                        </b-dropdown>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faAngleDown,
        faCalendarAlt,
        faTrashAlt,
        faCheck,
        faFileAlt,
        faCloudDownloadAlt,
        faFileExcel,
        faFilePdf,
        faFileArchive,
        faEllipsisH,
    } from '@fortawesome/free-solid-svg-icons'

    library.add(
        faAngleDown,
        faCalendarAlt,
        faTrashAlt,
        faCheck,
        faFileAlt,
        faCloudDownloadAlt,
        faFileExcel,
        faFilePdf,
        faFileArchive,
        faEllipsisH,
    );
    import { MyFlags,MyConst } from './../../../services/global';

    export default {
        components: {
        },
        computed : {
          
        },
        data : () => ({
            MyFlags : MyFlags, MyConst : MyConst
        }),
        methods: {
            async logout (){
                await this.$store.dispatch('LogOut')
                this.$router.push('auth/login')
            }
        },

        
    }


</script>
