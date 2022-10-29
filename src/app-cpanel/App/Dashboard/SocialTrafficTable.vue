<template>
    <b-card no-body class="shadow">
        <b-card-header class="bg-transparent border-0">
          <b-row>
          <b-col lg="9">
            <h3 class="mb-0">{{headerTitle}}</h3>
          </b-col>
          <b-col lg="3"  v-if="options && options.length">
              <base-select
                  alternative
                  question
                  type="text"
                  name="Domain"
                  placeholder="Domain"
                  rules="required"
                  required
                  @change="optionOnChange"
                  :options="options"
                  >
              </base-select>
          </b-col>
          </b-row>
        </b-card-header>

        <el-table class="table-responsive table "
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
            <el-table-column label="Inbound Message"
                             prop="I"
                             min-width="140px">
            </el-table-column>

            <el-table-column label="Outbound Message"
                             min-width="170px"
                             prop="O">
            </el-table-column>
        </el-table>

    </b-card>
</template>
<script>
  import { Table, TableColumn} from 'element-ui'
  export default {
    name: 'social-traffic-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    props:{
      tableData:Array,
      headerTitle:String,
      optionOnChange:Function,
      options:Array,
    },
    data() {
      return {
        currentPage: 1
      };
    }
  }
</script>