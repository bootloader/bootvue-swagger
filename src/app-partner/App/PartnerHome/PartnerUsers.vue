<template>
    <el-table class="table-responsive table table-light"
                header-row-class-name="thead-light"
                :data="[...items,{
                  isAdd : true
                }]">
          <el-table-column label="Name"
                            min-width="130px"
                            prop="contact.name">
                <template v-slot="{row}">
                    <span v-if="row.isAdd">
                      <input v-model="newItem.name"/>
                    </span>  
                    <span v-else pointer>
                      {{row.contact.name}}
                    </span>  
                </template> 
          </el-table-column>
          <el-table-column label="Email"
                            min-width="130px"
                            prop="contact.email">
                <template v-slot="{row}">
                    <span v-if="row.isAdd">
                      <input v-model="newItem.email"/>
                    </span>  
                    <span v-else pointer>
                      {{row.contact.email}}
                    </span>  
                </template> 
          </el-table-column>
          <el-table-column label="Company"
                            prop="contact.company"
                            min-width="130px">
                <template v-slot="{row}">
                    <span v-if="row.isAdd">
                      <input v-model="newItem.company"/>
                    </span>  
                    <span v-else pointer>
                      {{row.contact.company}}
                    </span>  
                </template> 
          </el-table-column>
          <el-table-column label="Action"
                            min-width="170px">
                <template v-slot="{row}">
                    <span v-if="row.isAdd" class="btn btn-primary btn-sm" style="cursor:pointer"
                    @click="addDomainOwner">
                      <i class="fa fa-plus"/>&nbsp;Add Domain Owner
                    </span>  
                    <span v-else pointer class="fa fa-times-circle cursor-pointer" style="cursor:pointer"
                      @click="removeDomainOwner(row.contact.email)">
                    </span>  
                </template>  
          </el-table-column>
      </el-table>
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
      domain:String
    },
    data() {
      return {
        currentPage: 1,
        items : [],
        newItem : {
            email : '',
            name : '', company : ''
        }
      };
    },
    mounted(){
      this.loadUser();
    },
    methods : {
      async loadUser(){
        let resp = await this.$service.get("/partner/api/domain/users",{
          domain : this.domain
        });
        this.items = resp.results;
      },
      async addDomainOwner(){
        if(!this.newItem.name) return;
        if(!this.newItem.email) return;
        let resp = await this.$service.submit("/partner/api/domain/user",{
          domain : this.domain,
          email : this.newItem.email,
          name : this.newItem.name,
          company : this.newItem.company
        });
        this.newItem.name = '';
        this.newItem.email = '';
        this.newItem.company = '';
        this.loadUser();
      },
     async removeDomainOwner(email){
        let resp = await this.$service.submit("/partner/api/domain/user",{
          domain : this.domain,
          email : email,
          remove : true
        });
        this.loadUser();
     }
    }
  }
</script>