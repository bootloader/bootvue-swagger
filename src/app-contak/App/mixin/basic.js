export  default {
    data() {
        return {
          basic  : {
            isSelectDefaultCompanyEnabled :  false,
            isLoading : false
          }
        };
      },
    computed : {
        companies(){
            return this.$store.getters.StateRest.PanelApiV1Companys
        },
        iCompany(){
            if(!this.$route.params.orgId)
                return null;
            for(var i in this.companies){
                let c = this.companies[i];
                if(c.company.companyId == this.$route.params.orgId){
                    return c.company;
                }
            }
        }
    },
    watch : {
        '$route.params.orgId' :  function(){
            if(this.basic.isSelectDefaultCompanyEnabled){
                this.selectDefaultCompany();
            }
        }
    },
    methods : {
        async loadBasic(fun){
          this.basic.isLoding = true; 
            try {
              return await this.$service.getX("/panel/api/v1/companys");
            } finally {
                this.basic.isLoding = false;  
                if(fun){
                  fun();
                }
            }
        },
        async loadBasicRefresh(fun){
          this.basic.isLoding = true; 
          try {
            return await this.$service.getX("/panel/api/v1/companys",{},{
              refresh : true
            });
          } finally {
              this.basic.isLoding = false;  
              if(fun){
                fun();
              }
          }
        },
        async selectDefaultCompany(){
            await this.loadBasic();
            if(this.$route.params.orgId==0){
               this.$router.push({
                 params : {
                   orgId : this.companies[0].companyId
                 }
               })
            }
            this.basic.isSelectDefaultCompanyEnabled = true;
        }
    } 
}