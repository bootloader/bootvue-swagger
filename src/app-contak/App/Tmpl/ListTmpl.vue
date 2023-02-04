<template>
    <div>
    <b-card class=" bg-greyish">
        <template v-slot:header>
          <b-row align-v="center" v-if="iCompany">
            <b-col cols="4">
              <base-v-select v-model="iCompany.companyId"  size="sm" disabled
                :options="companies.map((c)=> {
                  return {  id : c.companyId,  label : c.company.displayName}
                })" alternative question  />
            </b-col>
            <b-col cols="8" class="text-right">
              <b-button variant="outline-oa-blue" size="sm" @click="show_deleted=!show_deleted">
                <i class="fa fa-eye"/>
                {{show_deleted ? `Show` : `Hide`}} Deleted</b-button>
              <b-button :to="{ name: 'Add Template',
                        params: { orgId: iCompany.companyId},
                 }" variant="oa-blue" size="sm" >Add Template</b-button>
            </b-col>
          </b-row>
        </template>
        <el-table class="table-responsive table"
                  :data="tableData"
                  header-row-class-name="thead-light">
          <el-table-column label="Template Code" sortable
                          min-width="40px"
                          prop="code">
          </el-table-column>
          <el-table-column label="Template Category" sortable
                          min-width="40px"
                          prop="category">
          </el-table-column>
          <el-table-column label="Media" sortable
                          min-width="40px"
                          prop="header.mediaType">
              <template v-slot="{row}">
                <my-icon v-if="row" type="messageType" :status="row.header.mediaType" :value="row.header.mediaType"/>
              </template>
          </el-table-column>
          <el-table-column label="Status"
                          min-width="20px"
                          prop="approved">
            <template v-slot="{row}">
              <my-icon v-if="row" type="status" status="approved" value="Approved"/>
            </template>
          </el-table-column>
          <el-table-column label="Action"
                          min-width="40px"
                          prop="templateId">
            <template #header>
              <el-input v-model="search" size="small" placeholder="Type to search" />
            </template>             
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
                <b-button v-if="iCompany" :variant="row.deleted ? `grey` : `outline-danger`" size="sm" @click="deletTmpl(row)"
                  v-tooltip='row.deleted ? `Restore` : `Delete`'
                >
                  <i  class="fa" :class="{
                    'fa-trash-restore' : row.deleted,
                    'fa-trash' : !row.deleted
                  }"/>
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
        search : "",
        show_deleted : false
      }
    },
    computed : {
      tableData(){
        let search = this.search.toLowerCase();
        return this.tmpl.filter((row)=>{
          return (this.show_deleted || !row.deleted) && row.code.toLowerCase().indexOf(search)>-1;
        });;
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
      },
      async deletTmpl(row){
         let resp = await this.$service.delete(
            `/panel/api/v2/org/${this.iCompany.companyId}/hsm/tmpl/${row.templateId}`,{
         });
         this.load();
      }
    }
};
</script>
