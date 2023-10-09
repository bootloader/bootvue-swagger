<template>
    <b-card no-body class="shadow">
        <b-card-header class="border-0">
            <h3 class="mb-0">{{headerTitle}}</h3>
        </b-card-header>

        <el-table class="table-responsive table"
                  :data="tableData">
            <el-table-column label="Channel"
                             min-width="310px"
                             prop="name">
                <template v-slot="{row}">
                    <b-media no-body class="align-items-center">
                        <b-media-body>
                            <span class="font-weight-600 name mb-0 text-sm">{{row.name}}</span>
                        </b-media-body>
                    </b-media>
                </template>
            </el-table-column>
            <el-table-column label="User Initiated"
                             prop="I"
                             min-width="140px">
            </el-table-column>

            <el-table-column label="Business Initiated"
                             min-width="170px"
                             prop="O">
            </el-table-column>
        </el-table>

    </b-card>
</template>
<script>
  import { Table, TableColumn} from 'element-ui'
  export default {
    name: 'social-traffic-table-waba',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    props:{
      tableData:Array,
      headerTitle:String
    },
    data() {
      return {
        currentPage: 1
      };
    }
  }
</script>