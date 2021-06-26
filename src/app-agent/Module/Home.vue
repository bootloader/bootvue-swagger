<template>
    <div>
        <div class="row">
            <div class="col-md-6 col-xl-6" v-for="graph in graphs">
                <b-card :title="graph.title" class="main-card mb-3">

                </b-card>
            </div>
        </div>
    </div>

</template>

<script>


    import {library} from '@fortawesome/fontawesome-svg-core'

    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'


    export default {
        components: {
            'font-awesome-icon': FontAwesomeIcon,
        },
        data: () => ({
            heading: 'Analytics Dashboard',
            subheading: 'Select date range for report',
            icon: 'pe-7s-plane icon-gradient bg-tempting-azure',
            graphs : [
                {
                    title : "Conversations - Cumulative",
                    data : [65, 59, 80, 81, 56, 55, 40] 
                },
                {
                    title : "Conversations - individuals",
                    data : [65, 59, 80, 81, 56, 55, 40] 
                },
                {
                    title : "Messages - Team",
                    data : [65, 59, 80, 81, 56, 55, 40] 
                },
                {
                    title : "Messages - Individuals",
                    data : [65, 59, 80, 81, 56, 55, 40] 
                },
            ],
            stats :  {
                "contactType": {},
                "filter": "string",
                "peakLoad": {
                  "timestamp": 0,
                  "total": 0
                },
                "todayMsgExchanged": 0,
                "totalInMsgExchanged": 0,
                "totalMsgExchanged": 0,
                "totalOutMsgExchanged": 0,
                "uniqueConversation": 0
            }
        }),

        methods: {},

    }


</script>
