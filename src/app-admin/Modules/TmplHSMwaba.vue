<template>
    <div>
        <master-view
            :header="{
                heading: 'WhatsApp Templates',
                subheading: 'All the templates registered with WhatsApp',
                icon: 'icon-gradient bg-happy-itmeo fa fa-whatsapp',
            }"
            :table="table"
            :filters="filters" :autoApply="false"
            @action="onAction">
            <template #filter(channelId)="{apply,filter}">
                <MyChannelSelect v-model="filter.value" @change="apply"> </MyChannelSelect>
            </template>
            <template #filter(sync)="{apply,filter}">
                <b-button variant="success" class="fa fa-sync" @click="filter.value=true;apply()"> </b-button>
            </template>
            <template #cell(row_actions)="{item}">
                <MyHSMTmplSelect v-model="item.hsmTemplateId" @change="onChange(item,'hsmTemplateId')"/>
            </template>
        </master-view>
    </div>
</template>

<script>
    import MasterView from '../Layout/MasterView.vue'
    import MyChannelSelect from '@/@common/custom/components/MyChannelSelect.vue'
    import MyHSMTmplSelect from '@/@common/custom/components/MyHSMTmplSelect.vue'
    export default {
        components: {
            MasterView,
            MyChannelSelect,MyHSMTmplSelect
        },
        data: () => ({
            filters: [
                {
                    name: 'sync',
                    label: 'Sync',
                    value : false
                },
                {
                    label: 'Select Account',
                    name: 'channelId',
                    type: 'lane',
                    value : "",
                },
            ],
            table: {
                fields: [
                    { key: 'template.category', label: 'category' },
                    { key: 'template.name', label: 'name' },
                    { key: 'template.namespace', label: 'namespace' },
                    { key: 'template.status', label: 'status' },
                    { key: 'template.language', label: 'language' },
                    { key: 'row_actions', label: 'Linked HSM Template' },
                ],
                items: [],
                perPage: 25,
                currentPage: 1,
                rows: 0,
                api: 'api/tmpl/hsm/waba_templates',
            },
            modelName: 'MODAL_CHANNELS',
            modalInputs: [],
            oldHash: null,
            model: {
                channelId: '',
            },
        }),
        computed: {
            items: function () {
                return this.$store.getters.StateAgents
            },
            teams: function () {
                return this.$store.getters.StateTeams
            },
            isChanged: function () {
                return true //this.oldHash !== JSON.stringify(this.oneItem);
            },
        },
        created: function (argument) {
            //this.loadItems();
        },
        methods: {
            async loadItems() {
                let resp = await this.$service.get('api/options/channels')
                this.table.items = resp.results
            },
            async viewItem(item) {},
            async onAction(argument) {
                switch (argument.name) {
                    default:
                        console.log('NoMapping', argument)
                }
            },
            async onChange(row,field){
                if(field == "hsmTemplateId"){
                    await this.$service.submit('api/tmpl/hsm/link',{
                        templateId : row.id,
                        hsmTemplateId : row.hsmTemplateId
                    })
                }
            }
        },
    }
</script>
<style type="text/css"></style>
