<template>
  <div>
    <div class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center profile-header">
      <b-container fluid>
        <span class="mask bg-default min-vh-100"></span>
        <!-- Header container -->
        <b-row  v-if="$global.User.isDuperUser" slot="header"  class="my-normalize-v2">
          <b-col  cols="12">
            <base-v-select options="getx:/partner/pub/waba/clients"  class="d-block" 
                layout="default" size="sm"
                v-model="search.clientId" clearable searchable filterable
                optionKey="id"
                :filter="{
                  '!!client' :  true
                }"
                :search="clientFilter"
                @change="loadDetails()"
            >
              <template #option="option">
                <my-icon type="waba" :value="option.item.client.status"/>&nbsp;<b>{{option.item.client.name}}</b> &nbsp;-&nbsp; <small>{{option.item.client.contact_info.email}}</small>
              </template>
              <template #selected-option="option">
                  <my-icon type="waba" :value="option.item.client.status"/>&nbsp;<b>{{option.item.client.name}}</b> &nbsp;-&nbsp; <small>{{option.item.client.contact_info.email}}</small>
              </template> 
            </base-v-select>
          </b-col> 
        </b-row>
      <b-row class=" mb-2 w-100 min-h-100 bg-white">
        <b-col xl="4" class="order-xl-0 text-uppercase"> 
          <summary-tile v-if="balance.currency" class="bg-white">
            <summary-tile-detail label="balance"
              :text="`${balance.balance} ${balance.currency}`"></summary-tile-detail>
            <summary-tile-detail label="bi_price_for_currency_and_client_country"
              :text="`${balance.bi_price_for_currency_and_client_country} ${balance.currency}`"></summary-tile-detail>
            <summary-tile-detail label="ui_price_for_currency_and_client_country" 
              :text="`${balance.ui_price_for_currency_and_client_country} ${balance.currency}`"></summary-tile-detail>
            <summary-tile-detail label="estimated_template_cost"
              :text="`${balance.estimated_template_cost} ${balance.currency}`"></summary-tile-detail>
          </summary-tile>  
        </b-col>
        <b-col xl="4" class="order-xl-0 text-uppercase" v-if="balance.last_renewal"> 
          <summary-tile header="Last Renewal" class="bg-white">
            <summary-tile-detail label="Amount"
              :text="`${balance.last_renewal.amount} ${balance.currency}`"></summary-tile-detail>
            <summary-tile-detail label="Date" 
              :text="balance.last_renewal.date"></summary-tile-detail>
          </summary-tile> 
        </b-col>
        <b-col xl="4" class="order-xl-0 text-uppercase"> 
          <summary-tile v-if="client.name">
            <summary-tile-detail label="name"
              :text="client.name"></summary-tile-detail>
            <summary-tile-detail label="max_channels"
              :text="client.max_channels"></summary-tile-detail>
            <summary-tile-detail label="status"
              :text="client.status"></summary-tile-detail>
            <summary-tile-detail label="suspicious"
              :text="client.suspicious"></summary-tile-detail>
          </summary-tile>
        </b-col>
      </b-row>

      <b-row>
        <b-col xl="12" class="order-xl-0 mb-5 bg-white"> 
          <div class="overflow-auto w-100">
              <b-table
                :items="table.items"
                :fields="table.fields"
                primary-key="period_date" 
                small striped hover responsive sticky-header>
              <template slot="thead-top" slot-scope="{}">
                <tr>
                  <th></th>
                  <th class="text-center table-primary" colspan="3">All conversations</th>
                  <th class="text-center table-info" colspan="3">Free conversations</th>
                  <th class="text-center table-danger" colspan="3">Paid conversations</th>
                  <th class="text-center table-success" colspan="3">Approximate charges ({{balance.currency}})</th>
                </tr>
              </template>
              </b-table>  
          </div>  
        </b-col>
      </b-row>

      </b-container>
    </div>

    <b-container fluid class="mt--6">

    </b-container>
  </div>
</template>
<script>

import BaseVSelect from '../../../@common/custom/components/base/BaseVSelect.vue';
import MyIcon from '../../../@common/custom/components/MyIcon.vue';
import SummaryTile from '../../../@common/custom/components/SummaryTile.vue';
import SummaryTileDetail from '../../../@common/custom/components/SummaryTileDetail.vue';


export default {
  components: {
    BaseVSelect,MyIcon,
    SummaryTileDetail,SummaryTile
  },
  data (){
     return {
      search : {
        clientId : "", 
        domain : ''
      },
      client : {},
      balance : {
      },
      table : {
        fields : [
          { key : 'period_date', label : "period_date" },

          { key : 'business_initiated_quantity', label : "business \n\r initiated" , variant: 'primary'},
          { key : 'user_initiated_quantity', label : "user initiated",variant: 'primary' },
          { key : 'quantity', label : "Total",variant: 'primary' },
          
          { key : 'free_tier', label : "free tier", variant: 'info' },
          { key : 'free_entry_point', label : "free entry point",variant: 'info' },
          { key : 'free_quantity', label : "Free", variant: 'info' },

          { key : 'business_initiated_paid_quantity', label : "business initiated",variant: 'danger' },
          { key : 'user_initiated_paid_quantity', label : "user initiated", variant: 'danger' },
          { key : 'paid_quantity', label : "Paid",variant: 'danger' },

          { key : 'business_initiated_price', label : "business initiated", variant: 'success' },
          { key : 'user_initiated_price', label : "user initiated", variant: 'success'  },
          { key : 'total_price', label : "Charges",  variant: 'success'  },
       
        ],
        items : []
      }
    }
  },
  mounted(){
    this.search.clientId = this.$route.query.clientId;
    this.loadDetails();
  },
  methods : {
    async loadDetails(refresh){
      if(!this.search.clientId ){
        this.table.items = [];
        this.balance = {};
        return;
      }
      if(this.$route.query.clientId!=this.search.clientId){
        this.$router.push({
          query :  { clientId : this.search.clientId }
        });
      }
      let resp = await this.$service.get("/partner/pub/waba/clients/balance",{
        refresh : true,
        clientId : this.search.clientId
      });
      this.table.items = resp.results.map(function(result){
        return result.usage;
      });
      this.balance = resp.meta?.balance || {};
      this.client = resp.meta?.client || {};
    },
    clientFilter(options,search){
      let _search = (search || "").toLowerCase()
      return options.filter(function(option){
        return option.item.client.name.toLowerCase().indexOf(_search) > -1
        || option.item.client.contact_info.email.toLowerCase().replace('@mehery.com','').indexOf(_search) > -1
      });
    },    
  }
};
</script>
<style>
</style>
