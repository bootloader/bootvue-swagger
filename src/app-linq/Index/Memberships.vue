<template>
    <div class="px-6-x">
        <div class="section-wrapper">
          <div class="social-tile-container ">
            <social-tile class="w-full lg:w-4/12"
              :title="membership.verification.title" :subtitle="membership.membershipType" provider="google"> 
              <template #thumb>
                <social-icon icon="fas fa-certificate"></social-icon>
              </template>  
            </social-tile>
          </div>  
        </div> 

        <div class="py-5 text-center">
          <div class="flex flex-wrap justify-center">
            <div class="w-full lg:w-9/12 px-4 flex flex-wrap justify-center">
              <b-button variant="outline-evening" size="sm" v-if="membership.membershipId"
                :to="`/app/v/${$route.params.verificationId}/m/${membership.membershipId}`">
                Back
              </b-button> 
              <b-button v-if="canViewMembers" size="sm" @click="table.filter.membershipType='ACTIVE'"
                 :variant="table.filter.membershipType=='ACTIVE' ? 'evening' : 'outline-evening'">
                Members
              </b-button>
              <b-button v-if="canViewMembers" size="sm" @click="table.filter.membershipType='PENDING'"
                :variant="table.filter.membershipType=='PENDING' ? 'evening' : 'outline-evening'">
                Pending
              </b-button> 
              <b-button v-if="canViewMembers" size="sm" @click="table.filter.membershipType='REJECTED'"
                :variant="table.filter.membershipType=='REJECTED' ? 'evening' : 'outline-evening'">
                Rejected
              </b-button> 
            </div>
          </div>  
        </div>

          <div class="section-wrapper styler-height-fix">
              <div class="position-relative">
                <b-table ref="my-table" id="table-id" :items="table.items" 
                    :fields="table.fields" 
                     sticky-header responsive bordered no-border-collapse show-empty primary-key="id"
                     stacked="sm"
                >
                    <template #cell(actions)="row">
                        <b-button v-if="row.item.membershipType == 'PENDING'" size="sm" variant="evening"
                          @click="modify(row.item.membershipId,'MEMBER')">
                            Approve
                        </b-button>
                        <b-button v-if="row.item.membershipType == 'PENDING'" size="sm" variant="danger"
                          @click="modify(row.item.membershipId,'REJECTED')">
                            Reject
                        </b-button>
                         <b-button v-if="row.item.approved" size="sm" variant="outline-danger"
                          @click="modify(row.item.membershipId,'NONE')">
                            Remove
                        </b-button>  
                    </template>
                     <template #cell(profiles)="row">
                        <social-icon size="sm" v-tooltip="row.item.membershipType"
                                :provider="`user-${row.item.membershipType}`" ></social-icon>
                         <social-icon v-for="p in row.item.profiles" v-bind:key="p.id" size="sm" v-tooltip="`${p.email || p.phone}`"
                                :provider="p.provider" ></social-icon>
                     </template> 
                    </b-table>
                <b-overlay :show="table.isBusy" no-wrap opacity="0.5"></b-overlay>
              </div> 
          </div>  


    </div>
</template>
<script>
import SocialBoxes from "./SocialBoxes.vue";
import mixin from '../mixin.js'

export default {
  mixins : [mixin],
  data() {
    return {
      table : {
        fields: [
          { key : "user.name", label : "Member"},
          //{ key : "user.email", label : "Email"},
          { key : "profiles", label : "Profiles"},
          { key : "actions", label : ""},
        ],
        items: [],
        currentPage: 0,
        perPage: 50,
        totalItems: 10000,
        isBusy: false,
        filter : {
          approved : true,
          membershipType : 'ACTIVE'
        }
      },
      membership : {
        membershipType : 'NONE',
        verification : {
          "title": "",
          "description": "",
          "profileTypes": [
          ],
          "verificationId": null
        },
      },
    };
  },
  created() {
    this.loadMembership();
    this.fetchItems();
  },
  mounted() {
    const tableScrollBody = this.$refs["my-table"].$el;
    /* Consider debouncing the event call */
    tableScrollBody.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    /* Clean up just to be sure */
    const tableScrollBody = this.$refs["my-table"].$el;
    tableScrollBody.removeEventListener("scroll", this.onScroll);
  },
  watch: {
    /* Optionally hide scrollbar when loading */
    "table.isBusy" : function(newVal, oldVal) {
      if (newVal !== oldVal) {
        const tableScrollBody = this.$refs["my-table"].$el;
        if (newVal === true) {
          tableScrollBody.classList.add("overflow-hidden");
        } else {
          tableScrollBody.classList.remove("overflow-hidden");
        }
      }
    },
    "table.filter.membershipType" : function () {
      this.table.items = [];
      this.table.currentPage = 0;
      this.fetchItems();
    }
  },
  computed : {
    canViewMembers(){
      return ['OWNER','ADMIN','MODERATOR'].indexOf(this.membership.membershipType) > -1
    },
    canEdit(){
      return ['OWNER'].indexOf(this.membership.membershipType) > -1
    }
  },
  methods : {
    async loadMembership(){
      var resp = await this.$service.get('/api/v1/verification/membership',{
        verificationId : this.$route.params.verificationId,
        membershipId : this.$route.params.membershipId
      });
      this.membership = resp.results[0];
    },
    async loadMemberships(currentPage,perPage){
      var resp = await this.$service.get('/api/v1/verification/membership',{
        verificationId : this.$route.params.verificationId,
        approved : this.table.filter.approved,
        membershipType : this.table.filter.membershipType,
        pageNo :    currentPage,
        pageSize :  perPage,
      });
      return resp.results;
    },
    async modify(membershipId,membershipType){
      try {
        var resp = await this.$service.submit('/api/v1/membership',{
          membershipType : membershipType,
          membershipId : membershipId
        });
        for(var i in this.table.items){
          if(this.table.items[i].membershipId == resp.results[0].membershipId){
            this.table.items.splice(i, 1, resp.results[0]);
          }
        }
      } catch(e){

      }
    },
    async fetchItems() {
      /* No need to call if all items retrieved */
      if (this.table.items.length === this.table.totalItems) return;

      /* Enable busy state */
      this.table.isBusy = true;

      /* Missing error handling if call fails */
      //const startIndex = this.table.currentPage++ * this.table.perPage;
      //const endIndex = startIndex + this.table.perPage;
      const newItems= await this.loadMemberships(this.table.currentPage++,this.table.perPage);
      /* Add new items to existing ones */
    
      this.table.items = this.table.items.concat(newItems);
      console.log("ITEMS",this.table.items.length,"ADDED:",newItems.length);

      /* Disable busy state */
      this.table.isBusy = false;
    },
    onScroll(event) {
      if (
        event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight
      ) {
        if (!this.table.isBusy) {
          this.fetchItems();
        }
      }
    }
  },
  components: {
    SocialBoxes
  },
};
</script>
<style lang="scss">

.bg-cover-x {
  background-image: url('~@/assets/vendor/notus/img/social-bg-bottom.png');
  background-position: bottom;
}
.h-300-px {
  height: 300px;
}
.social-tile-container {
  margin: auto;
  font-size: 0;
  text-align: center;
  left: 0;
  right: 0;
}
.profile-bar {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
}
</style>
