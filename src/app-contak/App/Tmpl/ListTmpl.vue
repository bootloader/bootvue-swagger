<template>
    <div>
    <b-card class=" bg-greyish">
        <template v-slot:header>
          <b-row align-v="center" v-if="iCompany">
            <b-col cols="4">
              <base-select v-model="iCompany.companyId"  size="sm"
                :options="companies.map((c)=> {
                  return {  id : c.companyId,  label : c.company.displayName}
                })" />
            </b-col>
            <b-col cols="8" class="text-right">
              <b-button :to="{ name: 'Add Template',
                        params: { orgId: iCompany.companyId},
                 }" variant="oa-blue" size="sm" >Add Template</b-button>
            </b-col>
          </b-row>
        </template>
        <el-table class="table-responsive table"
                  :data="tableData"
                  header-row-class-name="thead-light">
          <el-table-column label="Template Code"
                          min-width="50px"
                          prop="code">
          </el-table-column>
          <el-table-column label="Template Title"
                          min-width="50px"
                          prop="title">
          </el-table-column>

          <el-table-column label="Status"
                          min-width="30px"
                          prop="approved">
            <template>
              <my-icon type="status" status="approved" value="Approved"/>
            </template>
          </el-table-column>
          <el-table-column label="Status"
                          min-width="30px"
                          prop="templateId">
            <template v-slot="{row}">
                <b-button v-if="iCompany"
                        variant="outline-oa-blue" size="sm"
                        :to="{
                            name: 'View Template',
                            params: {
                                orgId: iCompany.companyId,
                                templateId: row.templateId,
                            },
                        }">
                        View
                </b-button>
            </template>
          </el-table-column>
        </el-table>

    </b-card> 
  </div>
</template>
<script>
import basic from '../mixin/basic.js'
import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'

export default {
 mixins : [basic],
 components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Dropdown.name]: Dropdown,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
    },
    data() {
      return {
        tmpl : [],
      }
    },
    computed : {
      tableData(){
        return this.tmpl;
      }
    },
    mounted(){
      this.load()
    }, 
    methods : {
      async load(){
         await this.loadBasic();
         await this.selectDefaultCompany();
         let resp = await this.$service.get('/panel/api/v1/hsm/tmpl',{
          companyId : this.iCompany.companyId
         });
        this.tmpl = resp.results;
      }
    }
};
</script>
