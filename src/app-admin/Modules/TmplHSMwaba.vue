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
            <template #cell(details)="row">
                <i
                    :class="[
                        $global.MyDict.socialPrefix(row.item.contactType, 'fa'),
                    ]"></i>
                &nbsp;{{ row.item.lane }}
            </template>
            <template #cell(disabled)="row">
                {{ row.item.disabled | display('true:Yes;false:No') }}
            </template>
            <template #cell(actions)="row">
                <b-button
                    size="sm"
                    @click="editItem(row.item, row.index, $event.target)"
                    v-tooltip="row.item.message"
                    variant="outline-primary">
                    <i class="fas fa-edit"></i>
                </b-button>
            </template>
        </master-view>
    </div>
</template>

<script>
    import MasterView from '../Layout/MasterView.vue'
    import MyChannelSelect from '@/@common/custom/components/MyChannelSelect.vue'
    export default {
        components: {
            MasterView,
            MyChannelSelect,
        },
        data: () => ({
            filters: [
                {
                    label: 'Select Account',
                    name: 'channelId',
                    type: 'lane',
                    value : "",
                    selectFirst: true,
                },
                {
                    label: 'Search',
                    type: 'apply',
                    selectFirst: true,
                },
            ],
            table: {
                fields: [
                    { key: 'category', label: 'category' },
                    { key: 'name', label: 'name' },
                    { key: 'namespace', label: 'namespace' },
                    { key: 'status', label: 'status' },
                    { key: 'language', label: 'language' },
                ],
                items: [],
                perPage: 25,
                currentPage: 1,
                rows: 0,
                api: 'api/tmpl/waba_templates',
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
        },
    }
</script>
<style type="text/css"></style>
