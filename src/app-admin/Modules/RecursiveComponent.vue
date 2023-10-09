<template>
    <table>
        <tr v-for="item in data" :key="item.id">
            <td colspan="5" class="child">
                <table>
                    <tr>
                        <td width="10%">{{ item.parent }}</td>
                        <td width="10%">{{ item.code }}</td>
                        <td width="30%">{{ item.shortDesc }}</td>
                        <td width="40%">{{ item.title }}</td>
                        <td width="10%"><button @click="()=>clickAction({name:'EDIT_ITEM',item:item})">Edit</button></td>
                    </tr>
                    <tr>
                        <td colspan="5" class="child">
                            <template v-if="item.children && level < maxLevel">
                                <recursive-component :data="item.children" :level="level + 1" :max-level="maxLevel"></recursive-component>
                            </template>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
  </template>
  
  <script>
  export default {
    name: 'recursive-component',
    props: {
      data: { type: Array, required: true },
      level: { type: Number, default: 1 },
      maxLevel: { type: Number, default: 20 }
    },
    methods:{
        clickAction : function (argument) {
            this.$emit('action',argument);
        },
    }
  }
  </script>

<style lang="scss" scoped>
    table{
        margin: 0;
        padding: 0;
        border-collapse:collapse;
        width: 100%;
        table-layout: fixed;

        td{
            border-top: 1px solid #ccc;
            padding: 3px;
            widows: calc(100% / 3);
            background: #fff;
        }
        .child{
            padding: 0 0 0 5px;
            border: 0 none;
            width: 100%;
            background: #ccc;
            // &::before{
            //     content: "Γ";
            //     transform: scaleY(-1);
            // }
        }
    }
</style>